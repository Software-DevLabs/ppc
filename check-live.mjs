import puppeteer from 'puppeteer-core';

const url = process.argv[2];
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  userDataDir: 'D:/tempwork/chromeprof',
  args: ['--disable-gpu', '--no-sandbox', '--window-size=1600,1000', '--disk-cache-dir=D:/tempwork/chromecache'],
  defaultViewport: { width: 1600, height: 1000 },
});

const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e).slice(0, 300)));

await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
await new Promise((r) => setTimeout(r, 12000));

const info = await page.evaluate(() => ({
  text: document.body.innerText.slice(0, 160),
  videoSrc: [...document.querySelectorAll('video')].map((v) => v.currentSrc || v.src).slice(0, 2),
}));
console.log('URL', url);
console.log('ERRORS', JSON.stringify(errors.slice(0, 5)));
console.log('TEXT', JSON.stringify(info.text));
console.log('VIDEOS', JSON.stringify(info.videoSrc));
await browser.close();
