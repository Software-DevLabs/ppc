import { query } from '../db/index.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 120, email: 254, contactMethod: 120, message: 5000 };

// Simple in-memory throttle: max 5 messages / hour per IP (single instance).
const hits = new Map();
function throttled(ip) {
  const now = Date.now();
  const windowStart = now - 60 * 60 * 1000;
  const times = (hits.get(ip) || []).filter((t) => t > windowStart);
  if (times.length >= 5) return true;
  times.push(now);
  hits.set(ip, times);
  if (hits.size > 5000) hits.clear();
  return false;
}

function validate(body = {}) {
  const name = (body.name || '').trim();
  const email = (body.email || '').trim().toLowerCase();
  const contactMethod = (body.contactMethod || '').trim();
  const message = (body.message || '').trim();
  if (!name) return { error: 'الاسم مطلوب' };
  if (name.length > LIMITS.name) return { error: 'الاسم طويل جدًا' };
  if (!EMAIL_RE.test(email)) return { error: 'البريد الإلكتروني غير صالح' };
  if (email.length > LIMITS.email) return { error: 'البريد الإلكتروني طويل جدًا' };
  if (contactMethod.length > LIMITS.contactMethod) return { error: 'طريقة التواصل طويلة جدًا' };
  if (!message) return { error: 'الرسالة مطلوبة' };
  if (message.length > LIMITS.message) return { error: 'الرسالة طويلة جدًا (الحد 5000 حرف)' };
  return { name, email, contactMethod, message };
}

// POST /api/contact — public, anyone can write in.
export const submitMessage = async (req, res) => {
  try {
    // Reject oversized bodies (content-length can be absent with chunked
    // encoding, so also measure the parsed body).
    if (Number(req.headers['content-length'] || 0) > 50_000) {
      return res.status(413).json({ error: 'الرسالة كبيرة جدًا' });
    }
    if (JSON.stringify(req.body || {}).length > 50_000) {
      return res.status(413).json({ error: 'الرسالة كبيرة جدًا' });
    }
    // Validate first so typos and bot probes don't burn the rate budget.
    const v = validate(req.body);
    if (v.error) return res.status(400).json({ error: v.error });
    if (throttled(req.ip)) {
      return res.status(429).json({ error: 'عدد كبير من الرسائل — حاول لاحقًا' });
    }
    const result = await query(
      'INSERT INTO contact_messages (name, email, contact_method, message) VALUES ($1, $2, $3, $4) RETURNING id, created_at',
      [v.name, v.email, v.contactMethod, v.message]
    );
    res.status(201).json({ ok: true, id: result.rows[0].id });
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({ error: 'تعذّر إرسال الرسالة' });
  }
};

// GET /api/contact — admin inbox.
export const listMessages = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, email, contact_method, message, is_read, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 200'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/contact/unread-count — admin badge.
export const unreadCount = async (req, res) => {
  try {
    const result = await query('SELECT COUNT(*)::int AS count FROM contact_messages WHERE is_read = false');
    res.json({ count: result.rows[0].count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/contact/:id — mark read/unread (admin).
export const setRead = async (req, res) => {
  try {
    if (!/^\d+$/.test(req.params.id)) return res.status(404).json({ error: 'Not found' });
    const isRead = req.body?.is_read !== false;
    const result = await query(
      'UPDATE contact_messages SET is_read = $1 WHERE id = $2 RETURNING id, is_read',
      [isRead, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/contact/:id — admin.
export const removeMessage = async (req, res) => {
  try {
    if (!/^\d+$/.test(req.params.id)) return res.status(404).json({ error: 'Not found' });
    await query('DELETE FROM contact_messages WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
