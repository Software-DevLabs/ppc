import puppeteer from 'puppeteer-core';

const url = process.argv[2];
const out = process.argv[3];
const waitMs = Number(process.argv[4] || 9000);

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--disable-gpu', '--no-sandbox', '--window-size=1600,1000'],
  defaultViewport: { width: 1600, height: 1000 },
});

const page = await browser.newPage();
const errors = [];
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text().slice(0, 300));
});
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e).slice(0, 500)));
page.on('requestfailed', (r) =>
  errors.push('REQFAIL: ' + r.url().slice(0, 120) + ' ' + (r.failure() || {}).errorText)
);

await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
await new Promise((r) => setTimeout(r, waitMs));

const bodyBg = await page.evaluate(() => document.body.innerText.slice(0, 400));
await page.screenshot({ path: out });
console.log('URL', url);
console.log('ERRORS', JSON.stringify(errors.slice(0, 12), null, 1));
console.log('TEXT', JSON.stringify(bodyBg));
await browser.close();
