import { query } from '../db/index.js';

// Tasks
export const getTasks = async (req, res) => {
  try {
    const result = await query('SELECT * FROM workspace_tasks ORDER BY created_at DESC LIMIT 50');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, status } = req.body;
    const result = await query(
      'INSERT INTO workspace_tasks (title, status) VALUES ($1, $2) RETURNING *',
      [title, status || 'open']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    if (!/^\d+$/.test(req.params.id)) return res.status(404).json({ error: 'Not found' });
    const { status } = req.body;
    if (status !== 'open' && status !== 'done') {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const result = await query(
      'UPDATE workspace_tasks SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    if (!/^\d+$/.test(req.params.id)) return res.status(404).json({ error: 'Not found' });
    await query('DELETE FROM workspace_tasks WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Activities
export const getActivities = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM workspace_activities ORDER BY created_at DESC LIMIT 15'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createActivity = async (req, res) => {
  try {
    const { source, action, detail } = req.body;
    const result = await query(
      'INSERT INTO workspace_activities (source, action, detail) VALUES ($1, $2, $3) RETURNING *',
      [source || 'workspace', action, detail]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
