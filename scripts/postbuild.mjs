import { copyFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = resolve(process.cwd(), 'dist');
const SITE = 'https://knez4.github.io';

// GitHub Pages serves 404.html for any path it does not recognise. Copying the
// built index there makes deep links like /projekti/booking-platform work on a
// cold load instead of only after client-side navigation.
await copyFile(resolve(dist, 'index.html'), resolve(dist, '404.html'));

// Routes are real paths, so every case study is its own indexable URL.
const { projects } = await import('../src/data/projects.ts').catch(() => ({ projects: null }));

const ids = projects
  ? projects.map((p) => p.id)
  : ['booking-platform', 'three-tier-java', 'chatbot-api', 'client-web'];

const urls = ['/', '/cv', ...ids.map((id) => `/projekti/${id}`)];
const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u === '/' ? '1.0' : '0.8'}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

await writeFile(resolve(dist, 'sitemap.xml'), xml, 'utf8');

console.log(`postbuild: 404.html written, sitemap.xml lists ${urls.length} URLs`);
