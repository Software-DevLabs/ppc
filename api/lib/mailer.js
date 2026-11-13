import { google } from 'googleapis';
import crypto from 'node:crypto';
import { query } from '../db/index.js';

// Single restricted scope covering send + read + mark-read.
const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.modify';

export function gmailRedirectUri() {
  if (process.env.GMAIL_REDIRECT_URI) return process.env.GMAIL_REDIRECT_URI;
  return process.env.NODE_ENV === 'production'
    ? `${process.env.FRONTEND_URL}/api/mail/gmail/callback`
    : 'http://localhost:3001/api/mail/gmail/callback';
}

export function gmailOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    gmailRedirectUri()
  );
}

export function gmailAuthUrl(state) {
  return gmailOAuthClient().generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [GMAIL_SCOPE],
    state,
  });
}

export function newState() {
  return crypto.randomBytes(24).toString('hex');
}

async function meta(keys) {
  const r = await query('SELECT key, value FROM mail_meta WHERE key = ANY($1)', [keys]);
  return Object.fromEntries(r.rows.map((x) => [x.key, x.value]));
}

async function authedGmail() {
  const m = await meta(['gmail_refresh_token']);
  if (!m.gmail_refresh_token) {
    throw new Error('Gmail not connected. Connect the mailbox from the workspace first.');
  }
  const oauth = gmailOAuthClient();
  oauth.setCredentials({ refresh_token: m.gmail_refresh_token });
  return google.gmail({ version: 'v1', auth: oauth });
}

export async function gmailStatus() {
  try {
    const gmail = await authedGmail();
    const profile = await gmail.users.getProfile({ userId: 'me' });
    return { connected: true, email: profile.data.emailAddress };
  } catch {
    return { connected: false };
  }
}

export async function saveGmailTokens({ refreshToken }) {
  if (refreshToken) {
    await query(
      "INSERT INTO mail_meta (key, value) VALUES ('gmail_refresh_token', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
      [refreshToken]
    );
  }
  try {
    const gmail = await authedGmail();
    const profile = await gmail.users.getProfile({ userId: 'me' });
    if (profile.data?.emailAddress) {
      await query(
        "INSERT INTO mail_meta (key, value) VALUES ('gmail_email', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
        [profile.data.emailAddress]
      );
    }
  } catch {}
}

export async function disconnectGmail() {
  const m = await meta(['gmail_refresh_token']);
  if (m.gmail_refresh_token) {
    try {
      await gmailOAuthClient().revokeToken(m.gmail_refresh_token);
    } catch {}
  }
  await query("DELETE FROM mail_meta WHERE key IN ('gmail_refresh_token', 'gmail_email')");
}

// vars like {{name}} / {{email}} are replaced from the thread's client data.
export function applyVars(template = '', vars = {}) {
  return template.replace(/\{\{\s*(name|email)\s*\}\}/gi, (_, key) => vars[key.toLowerCase()] ?? '');
}

function stripToText(html = '') {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h\d|li|tr)>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function b64url(str) {
  return Buffer.from(str, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function buildMime({ from, to, subject, html, text, messageId, inReplyTo, references }) {
  const boundary = `mail_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    `Message-ID: ${messageId}`,
    ...(inReplyTo ? [`In-Reply-To: ${inReplyTo}`] : []),
    ...(references ? [`References: ${references}`] : []),
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    text || stripToText(html),
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    '',
    html,
    `--${boundary}--`,
  ];
  return lines.join('\r\n');
}

export async function sendMail({ to, subject, html, text, inReplyTo, references, threadId }) {
  const gmail = await authedGmail();
  const profile = await gmail.users.getProfile({ userId: 'me' });
  const from = profile.data.emailAddress;
  // Our own RFC Message-ID — replies reference it, so we can match them back.
  const messageId = `<${Date.now()}.${Math.random().toString(36).slice(2)}@softwaredevlabs>`;
  const raw = b64url(buildMime({ from, to, subject, html, text, messageId, inReplyTo, references }));
  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw, ...(threadId ? { threadId } : {}) },
  });
  return { messageId, gmailId: res.data?.id, gmailThreadId: res.data?.threadId };
}
