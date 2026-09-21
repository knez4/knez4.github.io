/**
 * Renders the CV route to A4 PDFs, one per language.
 *
 * The page is served from dist/ by a throwaway static server rather than opened
 * from the filesystem, because file:// URLs cannot set localStorage, and the
 * language and theme are both read from there before first paint.
 */
import { createServer } from 'node:http';
import { readFile, writeFile, access, mkdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';

const DIST = resolve(process.cwd(), 'dist');

const mmToPx = (mm) => Math.round((mm / 25.4) * 96);
// A4 at 96dpi, minus the @page margins declared in src/styles/index.css.
const PRINT_WIDTH_PX = mmToPx(210 - 14 - 14);
const PRINT_HEIGHT_PX = mmToPx(297 - 12 - 11);
/**
 * Two renderings from the same page.
 *
 * The default is public: no phone number, written to public/ and dist/, and it is
 * what the deployed site serves. `--private` injects the details from
 * private.local.json and writes to private/, which is gitignored. That copy is the
 * one to attach to an application.
 */
const PRIVATE = process.argv.includes('--private');
const OUT_DIR = resolve(process.cwd(), PRIVATE ? 'private' : 'public');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(DIST))) {
  console.error('dist/ is missing. Run `npm run build` first.');
  process.exit(1);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let filePath = join(DIST, decodeURIComponent(url.pathname));

  if (!(await exists(filePath)) || !extname(filePath)) {
    // Client-side route: hand back the app shell, same as GitHub Pages does.
    filePath = join(DIST, 'index.html');
  }

  try {
    const body = await readFile(filePath);
    res.writeHead(200, { 'content-type': TYPES[extname(filePath)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});

let privateDetails = {};
if (PRIVATE) {
  const file = resolve(process.cwd(), 'private.local.json');
  if (!(await exists(file))) {
    console.error(
      'private.local.json is missing. Create it with a phone field, for example:',
      '{ "phone": "+381 ..." }',
      'It is gitignored and never leaves this machine.',
    );
    process.exit(1);
  }
  privateDetails = JSON.parse(await readFile(file, 'utf8'));
}

await mkdir(OUT_DIR, { recursive: true });

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;

/**
 * Prefer a Chrome that is already on the machine so a local run does not have to
 * download its own copy. CI sets PUPPETEER_EXECUTABLE_PATH or installs one.
 */
async function findChrome() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
  ];
  for (const c of candidates) {
    if (await exists(c)) return c;
  }
  return undefined; // fall back to puppeteer's own download
}

const executablePath = await findChrome();
const browser = await puppeteer.launch({ headless: true, executablePath });
const results = [];

try {
  for (const lang of ['en', 'sr']) {
    const page = await browser.newPage();

    // Force the light rendering two ways: the media feature for anything that
    // reads prefers-color-scheme, and the stored keys the app reads on boot.
    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
    await page.evaluateOnNewDocument(
      (l, priv) => {
        try {
          localStorage.setItem('theme', 'light');
          localStorage.setItem('lang', l);
        } catch {
          /* nothing to do */
        }
        if (priv) window.__CV_PRIVATE__ = priv;
      },
      lang,
      PRIVATE ? privateDetails : null,
    );

    await page.goto(`${origin}/cv`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.cv-sheet');
    // Give webfonts a moment; metrics shift the layout if we shoot too early.
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 400));

    // Measure the sheet in the print layout so an overflow reports how much to cut
    // rather than just that it happened.
    //
    // The viewport has to be narrowed to the printable width first: emulateMediaType
    // alone leaves the page at its wide layout, where text wraps less and the sheet
    // measures shorter than it actually prints.
    await page.emulateMediaType('print');
    // A tall viewport keeps scrollHeight from clamping the reading to the window
    // height; only the sheet's own box is of interest.
    await page.setViewport({ width: PRINT_WIDTH_PX, height: 4000 });
    const measured = await page.evaluate(() => {
      const el = document.querySelector('.cv-sheet');
      return el ? Math.ceil(el.getBoundingClientRect().height) : 0;
    });

    const name = `Veljko_Knezevic_CV_${lang.toUpperCase()}.pdf`;
    const file = join(OUT_DIR, name);
    // preferCSSPageSize makes Chrome honour the @page rule in index.css for both
    // the sheet size and its margins. Passing margins here as well would stack on
    // top of the CSS ones (and omitting them falls back to Chrome's 1cm default).
    const buffer = await page.pdf({ printBackground: true, preferCSSPageSize: true });
    await writeFile(file, buffer);
    // The public copy also goes to dist/, so the deploy that just built the site
    // serves the freshly rendered file. The private one never touches dist/.
    if (!PRIVATE) await writeFile(join(DIST, name), buffer);

    // Chrome writes compressed object streams, so the page count has to be read
    // from a parsed document rather than grepped out of the raw bytes.
    const pages = (await PDFDocument.load(buffer)).getPageCount();

    results.push({ lang, file, pages, bytes: buffer.length, measured });
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

console.log(PRIVATE ? 'Private copy (with phone):' : 'Public copy (no phone):');
for (const r of results) {
  const flag = r.pages === 1 ? 'OK ' : '>>>';
  const BUDGET = PRINT_HEIGHT_PX;
  const over = r.measured - BUDGET;
  console.log(
    `${flag} ${r.lang.toUpperCase()}  ${r.pages} page(s)  ${(r.bytes / 1024).toFixed(0)} KB  ` +
      `content ${r.measured}px vs ${BUDGET}px budget (${over > 0 ? '+' : ''}${over}px)`,
  );
}

const overflowing = results.filter((r) => r.pages !== 1);
if (overflowing.length) {
  console.error(
    `\nThese are not one page: ${overflowing.map((r) => r.lang).join(', ')}. ` +
      'Trim a bullet in src/data or lower BULLETS_PER_PROJECT in src/pages/CvPage.tsx.',
  );
  process.exit(1);
}
