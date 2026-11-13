import { query } from '../db/index.js';

export const getAll = async (req, res) => {
  try {
    const { published } = req.query;
    let sql = 'SELECT * FROM blog_posts WHERE 1=1';
    const params = [];

    if (published !== undefined) {
      params.push(published === 'true');
      sql += ` AND published = $${params.length}`;
    }

    sql += ' ORDER BY created_at DESC LIMIT 200';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBySlug = async (req, res) => {
  try {
    // Public endpoint: drafts stay invisible even if the slug is guessed.
    const result = await query(
      'SELECT * FROM blog_posts WHERE slug = $1 AND published = true',
      [req.params.slug]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const { title, slug, excerpt, content, cover_url, tags, published, published_at } = req.body;
    const result = await query(
      `INSERT INTO blog_posts (title, slug, excerpt, content, cover_url, tags, published, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [title, slug, excerpt, content, cover_url, tags || [], published || false,
       published ? (published_at || new Date().toISOString()) : null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Slug already exists' });
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    if (!/^\d+$/.test(req.params.id)) return res.status(404).json({ error: 'Not found' });
    const { title, slug, excerpt, content, cover_url, tags, published, published_at } = req.body;

    const existing = await query('SELECT published_at FROM blog_posts WHERE id=$1', [req.params.id]);
    const prevPublishedAt = existing.rows[0]?.published_at;
    const finalPublishedAt = published
      ? (prevPublishedAt || published_at || new Date().toISOString())
      : null;

    const result = await query(
      `UPDATE blog_posts SET
        title=$1, slug=$2, excerpt=$3, content=$4, cover_url=$5,
        tags=$6, published=$7, published_at=$8, updated_at=NOW()
       WHERE id=$9 RETURNING *`,
      [title, slug, excerpt, content, cover_url, tags || [], published, finalPublishedAt, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Slug already exists' });
    res.status(500).json({ error: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    if (!/^\d+$/.test(req.params.id)) return res.status(404).json({ error: 'Not found' });
    await query('DELETE FROM blog_posts WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
