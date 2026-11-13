import 'dotenv/config';
import { query } from './index.js';

const migrations = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    google_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    content TEXT,
    banner_url TEXT,
    github_url TEXT,
    demo_url TEXT,
    skills TEXT[] DEFAULT '{}',
    category TEXT,
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    cover_url TEXT,
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS workspace_tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS workspace_activities (
    id SERIAL PRIMARY KEY,
    source TEXT DEFAULT 'workspace',
    action TEXT NOT NULL,
    detail TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS uploads (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size INTEGER NOT NULL,
    url TEXT NOT NULL,
    data BYTEA,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  -- for DB-only uploads (no Blob/GCS needed)
  ALTER TABLE uploads ADD COLUMN IF NOT EXISTS data BYTEA;

  CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_method TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(is_read);
  CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);

  -- Outbound letters + targeted client replies (workspace mail).
  -- Threads exist ONLY for clients we wrote to — the rest of the mailbox
  -- is never imported.
  CREATE TABLE IF NOT EXISTS mail_threads (
    id SERIAL PRIMARY KEY,
    client_email TEXT NOT NULL,
    client_name TEXT NOT NULL DEFAULT '',
    subject TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE TABLE IF NOT EXISTS mail_messages (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER NOT NULL REFERENCES mail_threads(id) ON DELETE CASCADE,
    direction TEXT NOT NULL CHECK (direction IN ('out', 'in')),
    subject TEXT NOT NULL DEFAULT '',
    body_text TEXT NOT NULL DEFAULT '',
    provider_message_id TEXT NOT NULL DEFAULT '',
    provider_uid TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (provider_uid)
  );
  CREATE INDEX IF NOT EXISTS idx_mail_messages_thread ON mail_messages(thread_id, created_at);
  ALTER TABLE mail_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT true;
  ALTER TABLE mail_messages ADD COLUMN IF NOT EXISTS provider_thread TEXT NOT NULL DEFAULT '';
  CREATE TABLE IF NOT EXISTS mail_meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT ''
  );

  CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
  CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
  CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
  -- banner display sizing, chosen in the dashboard preview
  ALTER TABLE projects ADD COLUMN IF NOT EXISTS banner_aspect TEXT DEFAULT '16/9';
  ALTER TABLE projects ADD COLUMN IF NOT EXISTS banner_fit TEXT DEFAULT 'cover';
`;

async function migrate() {
  try {
    console.log('Running migrations...');
    await query(migrations);
    console.log('Migrations completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
