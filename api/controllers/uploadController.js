import { query } from '../db/index.js';

const MAX_SIZE = 5 * 1024 * 1024;
const MIN_SIZE = 32; // below any real image header — blocks empty/garbage payloads

// Raster formats ONLY. SVG is intentionally excluded: it is XML and can
// carry <script> / on* handlers = stored XSS when served inline.
export const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const normalizeMime = (m) => (m === 'image/jpg' ? 'image/jpeg' : m);

// Sniff the REAL type from magic bytes. The client-supplied mimetype
// (req.file.mimetype) is attacker-controlled and must never be trusted:
// a virus/HTML/JS file can claim to be "image/png".
export function sniffImageType(buf) {
  if (!buf || buf.length < 12) return null;
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  ) return 'image/png';
  // GIF: GIF87a / GIF89a
  const gifSig = buf.toString('ascii', 0, 6);
  if (gifSig === 'GIF87a' || gifSig === 'GIF89a') return 'image/gif';
  // WebP: RIFF....WEBP
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    return 'image/webp';
  }
  return null;
}

function sanitizeFilename(name = 'upload') {
  return (
    name.replace(/[/\\]/g, '_').replace(/["\r\n]/g, '').slice(0, 200) || 'upload'
  );
}

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const { originalname, buffer, mimetype, size } = req.file;

    if (size > MAX_SIZE || buffer.length > MAX_SIZE) {
      return res.status(400).json({ error: 'File too large (max 5MB)' });
    }
    if (buffer.length < MIN_SIZE) {
      return res.status(400).json({ error: 'File is too small to be a valid image' });
    }

    const claimed = normalizeMime(mimetype);
    if (!ALLOWED_MIMES.has(claimed)) {
      return res.status(400).json({ error: 'Only JPEG, PNG, WebP or GIF images allowed' });
    }

    // Front bytes must actually decode as the claimed raster format.
    // Blocks: renamed .exe/.html/.js/.svg, polyglots with fake headers.
    const detected = sniffImageType(buffer);
    if (!detected) {
      return res.status(400).json({ error: 'File is not a valid image' });
    }
    if (detected !== claimed) {
      return res.status(400).json({ error: 'File content does not match its type' });
    }

    // Store the SERVER-determined type, never the client claim.
    const safeName = sanitizeFilename(originalname);
    const result = await query(
      'INSERT INTO uploads (filename, mimetype, size, url, data) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [safeName, detected, buffer.length, 'pending', buffer]
    );
    const id = result.rows[0].id;
    const url = `/api/upload/${id}/file`;

    await query('UPDATE uploads SET url=$1 WHERE id=$2', [url, id]);

    res.json({ url, filename: safeName, id });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const serveFile = async (req, res) => {
  try {
    // Strict id shape — non-numeric ids 404 before touching the DB.
    if (!/^\d+$/.test(req.params.id)) {
      return res.status(404).json({ error: 'File not found' });
    }
    const result = await query(
      'SELECT filename, mimetype, data FROM uploads WHERE id=$1',
      [req.params.id]
    );
    const row = result.rows[0];
    if (!row?.data) return res.status(404).json({ error: 'File not found' });

    // Re-verify on serve (protects rows written before this hardening).
    // Anything that is not a sniffed raster image never executes:
    //  - nosniff stops browsers re-interpreting it as HTML/JS
    //  - sandbox CSP stops script even if it were parsed as a document
    const detected = sniffImageType(row.data);
    const type =
      detected && ALLOWED_MIMES.has(detected)
        ? detected
        : ALLOWED_MIMES.has(row.mimetype)
          ? row.mimetype
          : null;
    if (!type) return res.status(404).json({ error: 'Invalid image data' });

    res.setHeader('Content-Type', type);
    res.setHeader('Content-Length', row.data.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "sandbox; default-src 'none'");
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${sanitizeFilename(row.filename)}"`
    );
    res.send(row.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
