import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ConnectPgSimple from 'connect-pg-simple';
import pool, { query } from './db/index.js';
import { isAdminEmail } from './middleware/auth.js';

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import blogRoutes from './routes/blog.js';
import workspaceRoutes from './routes/workspace.js';
import uploadRoutes from './routes/upload.js';
import contactRoutes from './routes/contact.js';
import mailRoutes from './routes/mail.js';

const app = express();
const PgSession = ConnectPgSimple(session);

// Behind Vercel's edge (and the Vite dev proxy) so req.ip is the real
// visitor IP, not the proxy's. Required for the contact-form throttle.
app.set('trust proxy', 1);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || true
    : 'http://localhost:5173',
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Sessions (stored in Neon) ─────────────────────────────────────────────────
app.use(session({
  store: new PgSession({
    pool,
    tableName: 'user_sessions',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'fallback_secret_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
}));

// ── Passport ──────────────────────────────────────────────────────────────────
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production'
      ? `${process.env.FRONTEND_URL}/auth/google/callback`
      : 'http://localhost:3001/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;
      const existing = await query('SELECT * FROM users WHERE google_id=$1', [profile.id]);

      if (existing.rows[0]) {
        await query(
          'UPDATE users SET name=$1, avatar=$2, updated_at=NOW() WHERE google_id=$3',
          [profile.displayName, profile.photos?.[0]?.value, profile.id]
        );
        return done(null, existing.rows[0]);
      }

      const role = isAdminEmail(email) ? 'admin' : 'user';
      const result = await query(
        'INSERT INTO users (google_id, email, name, avatar, role) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [profile.id, email, profile.displayName, profile.photos?.[0]?.value, role]
      );
      return done(null, result.rows[0]);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await query('SELECT * FROM users WHERE id=$1', [id]);
    done(null, result.rows[0] || null);
  } catch (err) {
    done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/mail', mailRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// ── Start ─────────────────────────────────────────────────────────────────────
// On Vercel (@vercel/node) this file is imported as a handler — listening
// would bind a port and hang the invocation, so only listen when run directly.
const PORT = process.env.PORT || 3001;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

export default app;
