// Admin-ness NEVER comes from the request. It is derived server-side from
// the Google-verified session email compared against a server-side allowlist.
// Editing requests (Burp/devtools) cannot change it: there is no user-update
// endpoint and no role field is ever read from client input.
function adminEmails() {
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '';
  return raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
}

export function isAdminEmail(email) {
  return adminEmails().includes((email || '').trim().toLowerCase());
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!isAdminEmail(req.user.email)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
