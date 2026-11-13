import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  // Neon cold starts routinely take 1s+ — a 2s budget caused cascading
  // "connection terminated due to connection timeout" failures.
  connectionTimeoutMillis: 10000,
});

// Idle-client errors must never crash the process (default Pool behavior
// throws). Log them; the faulting query still reports its own error.
pool.on('error', (err) => {
  console.error('PG pool error:', err.message);
});

export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();

export default pool;
