export const getMe = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
    avatar: req.user.avatar,
    role: req.user.role,
  });
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ ok: true });
    });
  });
};
