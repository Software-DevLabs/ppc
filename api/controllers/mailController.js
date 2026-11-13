import { query } from '../db/index.js';
import {
  applyVars,
  disconnectGmail,
  gmailAuthUrl,
  gmailOAuthClient,
  gmailStatus,
  newState,
  saveGmailTokens,
  sendMail,
} from '../lib/mailer.js';
import { isAdminEmail } from '../middleware/auth.js';
import { pollReplies } from '../lib/mailbox.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// GET /api/mail/threads — admin inbox (targeted threads only).
export const listThreads = async (req, res) => {
  try {
    if (req.query.sync === '1') {
      try { await pollReplies(); } catch (e) { console.error('Mail poll error:', e.message); }
    }
    const status = await gmailStatus().catch(() => ({ connected: false }));
    const result = await query(
      `SELECT t.id, t.client_email, t.client_name, t.subject, t.updated_at,
              (SELECT COUNT(*)::int FROM mail_messages m WHERE m.thread_id = t.id AND m.direction = 'in' AND m.is_read = false) AS unread,
              (SELECT m.body_text FROM mail_messages m WHERE m.thread_id = t.id ORDER BY m.created_at DESC LIMIT 1) AS preview
       FROM mail_threads t ORDER BY t.updated_at DESC LIMIT 100`
    );
    res.json({ threads: result.rows, mailReady: status.connected === true, mailEmail: status.email || null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/mail/threads/:id — full thread.
export const getThread = async (req, res) => {
  try {
    if (!/^\d+$/.test(req.params.id)) return res.status(404).json({ error: 'Not found' });
    const thread = await query('SELECT * FROM mail_threads WHERE id = $1', [req.params.id]);
    if (!thread.rows[0]) return res.status(404).json({ error: 'Not found' });
    const messages = await query(
      'SELECT id, direction, subject, body_text, is_read, created_at FROM mail_messages WHERE thread_id = $1 ORDER BY created_at ASC',
      [req.params.id]
    );
    res.json({ thread: thread.rows[0], messages: messages.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/mail/send — compose + send (admin). Body: to, name?, subject, html.
export const sendLetter = async (req, res) => {
  try {
    if (Number(req.headers['content-length'] || 0) > 300_000) {
      return res.status(413).json({ error: 'القالب كبير جدًا' });
    }
    if (JSON.stringify(req.body || {}).length > 300_000) {
      return res.status(413).json({ error: 'القالب كبير جدًا' });
    }
    const to = (req.body?.to || '').trim().toLowerCase();
    const name = (req.body?.name || '').trim().slice(0, 120);
    const subject = (req.body?.subject || '').trim().replace(/[\r\n]+/g, ' ').slice(0, 200);
    const html = req.body?.html || '';
    if (!EMAIL_RE.test(to)) return res.status(400).json({ error: 'البريد المستلم غير صالح' });
    if (!subject) return res.status(400).json({ error: 'الموضوع مطلوب' });
    if (!html || html.length > 200_000) {
      return res.status(400).json({ error: 'قالب الرسالة مطلوب (بحد أقصى 200 ألف حرف)' });
    }

    // One thread per client — replies land back here.
    let thread = await query('SELECT * FROM mail_threads WHERE client_email = $1', [to]);
    let threadId;
    if (thread.rows[0]) {
      threadId = thread.rows[0].id;
      await query(
        'UPDATE mail_threads SET client_name = COALESCE(NULLIF($1, \'\'), client_name), subject = $2, updated_at = NOW() WHERE id = $3',
        [name, subject, threadId]
      );
    } else {
      const created = await query(
        'INSERT INTO mail_threads (client_email, client_name, subject) VALUES ($1, $2, $3) RETURNING id',
        [to, name, subject]
      );
      threadId = created.rows[0].id;
    }

    const body = applyVars(html, { name: name || to.split('@')[0], email: to });
    const lastOut = await query(
      "SELECT provider_message_id, provider_thread FROM mail_messages WHERE thread_id = $1 AND direction = 'out' ORDER BY created_at DESC LIMIT 1",
      [threadId]
    );
    const inReplyTo = lastOut.rows[0]?.provider_message_id || undefined;
    const gmailThreadId = lastOut.rows[0]?.provider_thread || undefined;

    const info = await sendMail({ to, subject, html: body, inReplyTo, references: inReplyTo, threadId: gmailThreadId });
    await query(
      `INSERT INTO mail_messages (thread_id, direction, subject, body_text, provider_message_id, provider_uid, provider_thread, is_read)
       VALUES ($1, 'out', $2, $3, $4, $5, $6, true)`,
      [threadId, subject, body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 5000), info.messageId || '', `out/${Date.now()}/${threadId}`, info.gmailThreadId || '']
    );
    await query('UPDATE mail_threads SET updated_at = NOW() WHERE id = $1', [threadId]);
    res.status(201).json({ ok: true, threadId });
  } catch (err) {
    console.error('Mail send error:', err.message);
    res.status(500).json({ error: err.message || 'تعذّر إرسال الرسالة' });
  }
};

// PATCH /api/mail/threads/:id/read — mark thread read.
export const markThreadRead = async (req, res) => {
  try {
    if (!/^\d+$/.test(req.params.id)) return res.status(404).json({ error: 'Not found' });
    await query('UPDATE mail_messages SET is_read = true WHERE thread_id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/mail/threads/:id — admin.
export const deleteThread = async (req, res) => {
  try {
    if (!/^\d+$/.test(req.params.id)) return res.status(404).json({ error: 'Not found' });
    await query('DELETE FROM mail_threads WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/mail/sync — force reply poll (admin).
export const syncNow = async (req, res) => {
  try {
    const result = await pollReplies({ force: true });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function frontendBase() {
  return process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:5173';
}

// GET /api/mail/gmail/connect — start Gmail OAuth (admin only).
export const gmailConnect = async (req, res) => {
  try {
    const state = newState();
    req.session.gmailState = state;
    // Persist to the pg session store BEFORE redirecting — otherwise the
    // callback can arrive before the state is saved (flaky state mismatch).
    req.session.save(() => res.redirect(gmailAuthUrl(state)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/mail/gmail/callback — Google redirects here after consent.
export const gmailCallback = async (req, res) => {
  const fail = () => res.redirect(`${frontendBase()}/dashboard/workspace?gmail=error`);
  try {
    // Only the signed-in admin who started the flow may complete it.
    if (!req.user || !isAdminEmail(req.user.email)) return fail();
    if (!req.query.state || req.query.state !== req.session?.gmailState) return fail();
    delete req.session.gmailState;
    if (req.query.error || !req.query.code) return fail();
    const { tokens } = await gmailOAuthClient().getToken(req.query.code);
    if (!tokens.refresh_token) {
      // Google only returns a refresh token on first consent; without it
      // we cannot poll/send later — force reconsent happens via prompt=consent.
      return fail();
    }
    await saveGmailTokens({ refreshToken: tokens.refresh_token });
    res.redirect(`${frontendBase()}/dashboard/workspace?gmail=connected`);
  } catch {
    fail();
  }
};

// GET /api/mail/gmail/status — connection state (admin).
export const gmailStatusHandler = async (req, res) => {
  try {
    res.json(await gmailStatus());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/mail/gmail/disconnect — revoke + forget (admin).
export const gmailDisconnect = async (req, res) => {
  try {
    await disconnectGmail();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
