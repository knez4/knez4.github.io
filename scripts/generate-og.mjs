/**
 * Renders the social preview card to public/og-image.png.
 *
 * LinkedIn and the rest want a raster image at 1200x630, so this is a small
 * standalone page shot with the same headless Chrome the CV uses.
 */
import { readFile, writeFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import puppeteer from 'puppeteer';

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function findChrome() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
  ];
  for (const c of candidates) if (await exists(c)) return c;
  return undefined;
}

const fontPath = resolve(process.cwd(), 'public/fonts/inter-700.woff2');
const fontRegular = resolve(process.cwd(), 'public/fonts/inter-400.woff2');
const monoPath = resolve(process.cwd(), 'public/fonts/jetbrains-mono-400.woff2');

const [bold, regular, mono] = await Promise.all([
  readFile(fontPath, 'base64'),
  readFile(fontRegular, 'base64'),
  readFile(monoPath, 'base64'),
]);

const html = `<!doctype html>
<html><head><meta charset="utf-8" />
<style>
  @font-face { font-family: Inter; font-weight: 700; src: url(data:font/woff2;base64,${bold}) format('woff2'); }
  @font-face { font-family: Inter; font-weight: 400; src: url(data:font/woff2;base64,${regular}) format('woff2'); }
  @font-face { font-family: JB; font-weight: 400; src: url(data:font/woff2;base64,${mono}) format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; background: #090b10; color: #edf2f7;
    font-family: Inter, sans-serif; padding: 72px 80px;
    display: flex; flex-direction: column; justify-content: space-between;
    background-image:
      linear-gradient(rgba(38,44,56,.7) 1px, transparent 1px),
      linear-gradient(90deg, rgba(38,44,56,.7) 1px, transparent 1px);
    background-size: 48px 48px;
    position: relative; overflow: hidden;
  }
  .glow { position: absolute; top: -220px; right: -160px; width: 620px; height: 620px;
          border-radius: 50%; background: rgba(34,211,238,.14); filter: blur(90px); }
  .tag { font-family: JB; font-size: 20px; letter-spacing: .18em; text-transform: uppercase; color: #22d3ee; }
  h1 { font-size: 78px; font-weight: 700; letter-spacing: -.02em; line-height: 1.05; }
  .role { font-size: 34px; color: #22d3ee; margin-top: 14px; }
  .sub { font-size: 24px; color: #a0aec0; margin-top: 18px; max-width: 880px; line-height: 1.45; }
  .foot { font-family: JB; font-size: 21px; color: #7a8a9e; display: flex; gap: 28px; }
  .rule { height: 3px; width: 92px; background: #22d3ee; margin: 26px 0 0; }
</style></head>
<body>
  <div class="glow"></div>
  <div>
    <div class="tag">Fakultet organizacionih nauka &middot; Belgrade</div>
    <div class="rule"></div>
  </div>
  <div>
    <h1>Veljko Knežević</h1>
    <div class="role">Databases and backend web development</div>
    <div class="sub">PostgreSQL, Oracle SQL, Laravel and Java. Multi-tenant schema design, row-level security, REST APIs.</div>
  </div>
  <div class="foot"><span>knez4.github.io</span><span>github.com/knez4</span></div>
</body></html>`;

const browser = await puppeteer.launch({ headless: true, executablePath: await findChrome() });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);

const out = resolve(process.cwd(), 'public/og-image.png');
await writeFile(out, await page.screenshot({ type: 'png' }));
await browser.close();

const { size } = await import('node:fs/promises').then((fs) => fs.stat(out));
console.log(`og-image.png written, ${(size / 1024).toFixed(0)} KB`);
