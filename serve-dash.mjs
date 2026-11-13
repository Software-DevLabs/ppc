import http from 'http';
import { createReadStream, existsSync, statSync } from 'fs';
import { join, extname } from 'path';

const DIST = process.argv[2] || 'dist';
const PORT = Number(process.argv[3] || 4388);
const ROOT = join(process.cwd(), DIST);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
};

http
  .createServer((req, res) => {
    const url = (req.url || '/').split('?')[0];
    let p = join(ROOT, url === '/' ? 'index.html' : url);
    if (!existsSync(p) || statSync(p).isDirectory()) p = join(ROOT, 'index.html');
    const type = MIME[extname(p)] || 'application/octet-stream';
    res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' });
    createReadStream(p).pipe(res);
  })
  .listen(PORT, '127.0.0.1', () => console.log('serving ' + DIST + ' on ' + PORT));
