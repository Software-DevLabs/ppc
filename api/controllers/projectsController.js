import { query } from '../db/index.js';

export const getAll = async (req, res) => {
  try {
    const { published, featured } = req.query;
    let sql = 'SELECT * FROM projects WHERE 1=1';
    const params = [];

    if (published !== undefined) {
      params.push(published === 'true');
      sql += ` AND published = $${params.length}`;
    }
    if (featured !== undefined) {
      params.push(featured === 'true');
      sql += ` AND featured = $${params.length}`;
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
      'SELECT * FROM projects WHERE slug = $1 AND published = true',
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
    const {
      title, slug, short_description, content,
      banner_url, banner_aspect, banner_fit, github_url, demo_url,
      skills, category, featured, published,
    } = req.body;

    const result = await query(
      `INSERT INTO projects
        (title, slug, short_description, content, banner_url, banner_aspect,
         banner_fit, github_url,
         demo_url, skills, category, featured, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [title, slug, short_description, content, banner_url, banner_aspect || '16/9',
       banner_fit || 'cover', github_url,
       demo_url, skills || [], category, featured || false, published || false]
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
    const {
      title, slug, short_description, content,
      banner_url, banner_aspect, banner_fit, github_url, demo_url,
      skills, category, featured, published,
    } = req.body;

    const result = await query(
      `UPDATE projects SET
        title=$1, slug=$2, short_description=$3, content=$4,
        banner_url=$5, banner_aspect=$6, banner_fit=$7, github_url=$8,
        demo_url=$9, skills=$10,
        category=$11, featured=$12, published=$13, updated_at=NOW()
       WHERE id=$14 RETURNING *`,
      [title, slug, short_description, content, banner_url, banner_aspect || '16/9',
       banner_fit || 'cover', github_url,
       demo_url, skills || [], category, featured, published, req.params.id]
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
    await query('DELETE FROM projects WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
