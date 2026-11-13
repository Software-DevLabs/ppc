import { Router } from 'express';
import passport from 'passport';
import { getMe, logout } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Redirect to Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173'}/?error=auth_failed`,
  }),
  (req, res) => {
    const frontend = process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL
      : 'http://localhost:5173';
    res.redirect(`${frontend}/dashboard`);
  }
);

router.get('/me', requireAuth, getMe);
router.post('/logout', logout);

export default router;
