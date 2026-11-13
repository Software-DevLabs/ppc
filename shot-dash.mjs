import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'fs';

const URL = process.argv[2] || 'http://127.0.0.1:4388/';
const SCHEME = process.argv[3] || 'dark';
const OUT = process.argv[4] || 'D:/tempwork/dash-view.png';
const PROFILE = process.argv[5] || 'D:/tempwork/chromeprof-dash';
mkdirSync(PROFILE, { recursive: true });

const B = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await puppeteer.launch({
  executablePath: B,
  headless: 'new',
  userDataDir: PROFILE,
  args: ['--no-first-run', '--no-default-browser-check', '--disable-gpu', '--window-size=1440,900'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: SCHEME }]);
/* theme.jsx reads a stored value and ignores the media query — pin it */
await page.evaluateOnNewDocument((scheme) => {
  try { localStorage.setItem('dashboard-theme', scheme); } catch {}
}, SCHEME);
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: OUT });
console.log('OK', OUT, 'errors:', JSON.stringify(errors));
await browser.close();
