/**
 * Writes a real HTML file for every route.
 *
 * GitHub Pages serves 404.html for an unknown path, which renders fine in a
 * browser but comes back with a 404 status. Search engines drop those, so the
 * case studies would have been invisible despite having their own URLs.
 *
 * Rendering each route to dist/<route>/index.html makes them return 200, and
 * the HTML already contains the text rather than only a script tag that would
 * have to run first.
 */
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import puppeteer from 'puppeteer';
import { projects } from '../src/data/projects.ts';

const DIST = resolve(process.cwd(), 'dist');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf',
};

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
  for (const c of [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
  ]) {
    if (await exists(c)) return c;
  }
  return undefined;
}

// The home page too: most AI crawlers (GPTBot, ClaudeBot, PerplexityBot) do not run
// JavaScript, so without this the page they fetch is an empty <div id="root">.
// 404.html is copied from the bare shell in postbuild, before this overwrites index.html.
const routes = ['/', '/cv', ...projects.map((p) => `/projekti/${p.id}`)];

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let filePath = join(DIST, decodeURIComponent(url.pathname));
  if (!(await exists(filePath)) || !extname(filePath)) filePath = join(DIST, 'index.html');
  try {
    const body = await readFile(filePath);
    res.writeHead(200, { 'content-type': TYPES[extname(filePath)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;

const browser = await puppeteer.launch({ headless: true, executablePath: await findChrome() });

try {
  for (const route of routes) {
    const page = await browser.newPage();
    // No stored preference, so the snapshot is in the default language (Serbian).
    // The site has one theme now, so there is nothing else to reset. Motion is
    // skipped under automation (see motionOK), so nothing ships half-faded.
    await page.evaluateOnNewDocument(() => {
      try {
        localStorage.clear();
      } catch {
        /* private mode */
      }
    });
    await page.goto(`${origin}${route}`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('main');

    const html = await page.evaluate(() => `<!doctype html>\n${document.documentElement.outerHTML}`);

    const dir = join(DIST, route);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'index.html'), html, 'utf8');

    console.log(`prerendered ${route}  ${(html.length / 1024).toFixed(0)} KB`);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

console.log(`prerender: ${routes.length} routes written as real HTML files`);
