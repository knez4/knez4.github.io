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

/**
 * The card follows the site: dark stage, one violet accent, the surname in the
 * display face, the signature, and the cut-out portrait on the right.
 */
const read64 = (p) => readFile(resolve(process.cwd(), p), 'base64');
const [regular, mono, archivo, archivoExt, script, portrait] = await Promise.all([
  read64('public/fonts/inter-400.woff2'),
  read64('public/fonts/jetbrains-mono-400.woff2'),
  read64('public/fonts/archivo-wdth-latin.woff2'),
  read64('public/fonts/archivo-wdth-latin-ext.woff2'),
  read64('public/fonts/mrs-saint-delafield.woff2'),
  read64('public/img/portrait-800.webp'),
]);

const html = `<!doctype html>
<html><head><meta charset="utf-8" />
<style>
  @font-face { font-family: Inter; font-weight: 400; src: url(data:font/woff2;base64,${regular}) format('woff2'); }
  @font-face { font-family: JB; font-weight: 400; src: url(data:font/woff2;base64,${mono}) format('woff2'); }
  @font-face { font-family: Archivo; font-weight: 100 900; font-stretch: 62% 125%;
    src: url(data:font/woff2;base64,${archivo}) format('woff2'); unicode-range: U+0000-00FF, U+2000-206F; }
  @font-face { font-family: Archivo; font-weight: 100 900; font-stretch: 62% 125%;
    src: url(data:font/woff2;base64,${archivoExt}) format('woff2'); unicode-range: U+0100-02BA; }
  @font-face { font-family: Sig; src: url(data:font/woff2;base64,${script}) format('woff2'); }
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; background: #08060e; color: #f4f1fa;
    font-family: Inter, sans-serif; position: relative; overflow: hidden;
    background-image:
      linear-gradient(rgba(42,36,60,.55) 1px, transparent 1px),
      linear-gradient(90deg, rgba(42,36,60,.55) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .glow { position: absolute; right: 80px; top: 60px; width: 560px; height: 560px; border-radius: 50%;
          background: rgba(124,77,255,.45); filter: blur(110px); }
  .portrait { position: absolute; right: 70px; bottom: -40px; height: 640px;
              -webkit-mask-image: linear-gradient(to top, transparent, black 20%); }
  .tag { position: absolute; left: 72px; top: 64px; font-family: JB; font-size: 20px; letter-spacing: .2em;
         text-transform: uppercase; color: #a07cff; }
  .name { position: absolute; left: 60px; bottom: 120px; font-family: Archivo; font-stretch: 68%; font-weight: 850;
          font-size: 196px; line-height: .82; text-transform: uppercase; letter-spacing: -.01em; }
  .sig { position: absolute; left: 230px; bottom: 250px; font-family: Sig; font-size: 150px; color: #a07cff;
         transform: rotate(-9deg); text-shadow: 0 6px 30px rgba(124,77,255,.6); }
  .foot { position: absolute; left: 72px; bottom: 56px; font-family: JB; font-size: 20px; color: #aca4c0;
          display: flex; gap: 28px; letter-spacing: .06em; }
  .logo { position: absolute; right: 64px; top: 52px; width: 64px; height: 64px; }
</style></head>
<body>
  <div class="glow"></div>
  <img class="portrait" src="data:image/webp;base64,${portrait}" />
  <div class="tag">Web dizajn &middot; Automatizacija &middot; Baze podataka</div>
  <div class="name">Knežević</div>
  <div class="sig">Veljko</div>
  <div class="foot"><span>knez4.github.io</span><span>github.com/knez4</span></div>
  <svg class="logo" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#7C4DFF"/>
    <g fill="none" stroke="#08060E" stroke-opacity=".38" stroke-width="1.6"><path d="M2 32H62"/><path d="M12 9C22 20 22 44 12 55"/><path d="M52 9C42 20 42 44 52 55"/></g>
    <polygon points="13,20 19.5,20 23,35 26.5,20 33,20 26,44 20,44" fill="#fff"/>
    <polygon points="35,20 40.5,20 40.5,29.5 45,20 51,20 44.6,32 51.5,44 45.5,44 40.5,34.5 40.5,44 35,44" fill="#fff"/></svg>
</body></html>`;

const browser = await puppeteer.launch({ headless: true, executablePath: await findChrome() });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
await page.evaluate(() => document.fonts.ready);

const out = resolve(process.cwd(), 'public/og-image.png');
await writeFile(out, await page.screenshot({ type: 'png' }));
await browser.close();

const { size } = await import('node:fs/promises').then((fs) => fs.stat(out));
console.log(`og-image.png written, ${(size / 1024).toFixed(0)} KB`);
