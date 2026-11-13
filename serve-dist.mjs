import http from 'http';
import { readFile, stat } from 'fs/promises';
import { extname, join, normalize } from 'path';

const root = process.argv[2] || 'dist-macterm';
const port = Number(process.argv[3] || 4330);
const base = join(process.cwd(), root);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
};

const resolveFile = (p) => {
  if (p === '/') return 'macterm.html';
  if (!extname(p)) return p.replace(/^\/+|\/+$/g, '') + '/macterm.html'.replace('/macterm', '');
  return p.replace(/^\/+/, '');
};

http
  .createServer(async (req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    try {
      const rel = normalize(resolveFile(p)).replace(/^(\.\.[\/\\])+/, '');
      if (rel.includes('..')) throw new Error('traversal');
      await stat(join(base, rel));
      const data = await readFile(join(base, rel));
      const headers = {
        'content-type': types[extname(rel).toLowerCase()] || 'text/html; charset=utf-8',
      };
      if (extname(rel) === '.mp4') headers['accept-ranges'] = 'bytes';
      res.writeHead(200, headers);
      process.stdout.write(`200 ${rel}\n`);
      res.end(data);
    } catch (e) {
      process.stdout.write(`NF ${p} -> ${e.message}\n`);
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('nf');
    }
  })
  .listen(port, () => process.stdout.write('up ' + port + '\n'));
