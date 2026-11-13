import { query } from '../db/index.js';

// NOTE: mailer.js also exports authedGmail pieces; mailbox keeps its own
// import to avoid cycles (mailer never imports mailbox).
import { google } from 'googleapis';
import { gmailOAuthClient } from './mailer.js';

let polling = false;

async function authedGmail() {
  const r = await query('SELECT value FROM mail_meta WHERE key = $1', ['gmail_refresh_token']);
  const refresh = r.rows[0]?.value;
  if (!refresh) throw new Error('Gmail not connected. Connect the mailbox from the workspace first.');
  const oauth = gmailOAuthClient();
  oauth.setCredentials({ refresh_token: refresh });
  return google.gmail({ version: 'v1', auth: oauth });
}

function header(msg, name) {
  const h = msg.payload?.headers?.find((x) => x.name?.toLowerCase() === name);
  return h?.value || '';
}

function emailOf(addr = '') {
  const m = addr.match(/<([^>]+)>/) || [null, addr];
  return (m[1] || '').trim().toLowerCase();
}

function b64urlDecode(s = '') {
  return Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
}

function findBody(payload, mime) {
  if (!payload) return null;
  if (payload.mimeType === mime && payload.body?.data) return payload.body.data;
  for (const p of payload.parts || []) {
    const found = findBody(p, mime);
    if (found) return found;
  }
  return null;
}

function htmlToText(html = '') {
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
    .trim()
    .slice(0, 20000);
}

// Pull replies ONLY from clients we wrote to before. Anything else in the
// mailbox is ignored — the workspace shows targeted threads, nothing else.
export async function pollReplies({ force = false } = {}) {
  if (polling) return { skipped: 'already running' };
  const meta = await query("SELECT value FROM mail_meta WHERE key = 'last_poll'");
  const lastPoll = Number(meta.rows[0]?.value || 0);
  if (!force && Date.now() - lastPoll < 120_000) return { skipped: 'too soon' };

  polling = true;
  try {
    const gmail = await authedGmail();
    const threads = (await query('SELECT id, client_email FROM mail_threads')).rows;
    if (!threads.length) return { imported: 0 };
    const byEmail = new Map(threads.map((t) => [t.client_email.toLowerCase(), t]));

    const sent = await query(
      "SELECT provider_message_id, provider_thread FROM mail_messages WHERE direction = 'out'"
    );
    const ourIds = new Set(sent.rows.map((r) => r.provider_message_id).filter(Boolean));
    const ourGmailThreads = new Map(
      sent.rows.filter((r) => r.provider_thread).map((r) => [r.provider_thread, true])
    );

    const listed = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread in:inbox',
      maxResults: 50,
    });
    let imported = 0;
    const markRead = [];
    for (const ref of listed.data?.messages || []) {
      try {
        const full = await gmail.users.messages.get({ userId: 'me', id: ref.id, format: 'full' });
        const msg = full.data;
        const from = emailOf(header(msg, 'from'));
        const thread = from && byEmail.get(from);
        const inReplyTo = header(msg, 'in-reply-to');
        const references = header(msg, 'references').split(/\s+/);
        const matched =
          thread &&
          (ourIds.has(inReplyTo) ||
            references.some((r) => ourIds.has(r)) ||
            ourGmailThreads.has(msg.threadId));
        if (!matched) continue;

        const plain = findBody(msg.payload, 'text/plain');
        const html = !plain && findBody(msg.payload, 'text/html');
        const body = plain
          ? b64urlDecode(plain).trim().slice(0, 20000)
          : htmlToText(b64urlDecode(html || ''));
        await query(
          `INSERT INTO mail_messages (thread_id, direction, subject, body_text, provider_message_id, provider_uid, provider_thread, is_read)
           VALUES ($1, 'in', $2, $3, $4, $5, $6, false)
           ON CONFLICT (provider_uid) DO NOTHING`,
          [
            thread.id,
            header(msg, 'subject').slice(0, 300),
            body,
            header(msg, 'message-id').slice(0, 300),
            `gmail/${msg.id}`,
            msg.threadId || '',
          ]
        );
        await query('UPDATE mail_threads SET updated_at = NOW() WHERE id = $1', [thread.id]);
        imported += 1;
        markRead.push(ref.id);
      } catch {
        // Skip one broken message, continue with the rest.
      }
    }
    // Mark imported replies as read — only messages we imported,
    // the rest of the mailbox is untouched.
    for (const id of markRead) {
      try {
        await gmail.users.messages.modify({ userId: 'me', id, requestBody: { removeLabelIds: ['UNREAD'] } });
      } catch {}
    }
    await query(
      "INSERT INTO mail_meta (key, value) VALUES ('last_poll', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
      [String(Date.now())]
    );
    return { imported };
  } finally {
    polling = false;
  }
}
