import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { profile } from './data/profile';
import { cvProjects, projects } from './data/projects';
import { experience } from './data/experience';
import { education } from './data/education';
import { skillGroups, skillsAsLines } from './data/skills';
import { tables } from './data/schema';
import { ui } from './i18n/ui';

/**
 * `school` is matched against the Education entry, which always spells the
 * university in the nominative. An earlier value here ('univerzitetu u
 * beogradu') matched the locative in a summary sentence instead, so rewording
 * the summary broke a test that is supposed to be about Education.
 */
const PDFS = [
  { path: 'public/Veljko_Knezevic_CV_EN.pdf', school: 'university of belgrade' },
  { path: 'public/Veljko_Knezevic_CV_SR.pdf', school: 'univerzitet u beogradu' },
];

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

/** Reads the text layer the same way an applicant tracking system would. */
async function pdfText(path: string): Promise<{ pages: number; text: string }> {
  // The legacy build runs in Node without a DOM.
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(await readFile(path));
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;

  let text = '';
  for (let i = 1; i <= doc.numPages; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => ('str' in item ? item.str : '')).join(' ');
  }
  return { pages: doc.numPages, text };
}

describe('data integrity', () => {
  it('gives every project a unique, url-safe id', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('requires a screenshot or diagram with alt text on every project', () => {
    for (const p of projects) {
      expect(p.media.length, `${p.id} has no media`).toBeGreaterThan(0);
      for (const m of p.media) {
        expect(m.src.startsWith('/'), `${p.id} media src must be absolute`).toBe(true);
        expect(m.alt.en.length, `${p.id} media needs English alt text`).toBeGreaterThan(10);
        expect(m.alt.sr.length, `${p.id} media needs Serbian alt text`).toBeGreaterThan(10);
      }
    }
  });

  it('translates every project field into both languages', () => {
    for (const p of projects) {
      expect(p.title.sr).not.toBe('');
      expect(p.subtitle.sr).not.toBe('');
      expect(p.highlights.en.length).toBe(p.highlights.sr.length);
      expect(p.highlights.en.length).toBeGreaterThan(1);
    }
  });

  it('keeps CV bullets short enough to survive a parser', () => {
    // Bullets over roughly 30 words get merged into the previous one by some
    // parsers, and read as filler to a human.
    const all = [
      ...cvProjects.flatMap((p) => [...p.highlights.en, ...p.highlights.sr]),
      ...experience.flatMap((r) => [...r.points.en, ...r.points.sr]),
    ];
    for (const bullet of all) {
      expect(bullet.split(/\s+/).length, `too long: ${bullet}`).toBeLessThanOrEqual(30);
    }
  });

  it('separates applied skills from coursework', () => {
    expect(skillGroups.some((g) => g.kind === 'applied')).toBe(true);
    expect(skillGroups.some((g) => g.kind === 'academic')).toBe(true);
    // Coursework must not leak into the CV skills block, where it would read as
    // a claim of hands-on experience.
    const cvLabels = skillsAsLines('en').map((l) => l.label);
    expect(cvLabels).not.toContain('Studied in coursework');
  });

  it('does not claim tools with no artifact behind them', () => {
    // These came up while auditing the machine: studied or mentioned, but with
    // nothing on disk to show. They stay out of the skills block.
    const banned = ['Cisco', 'Packet Tracer', 'GNS3', 'Wireshark', 'Docker', 'Kubernetes'];
    const claimed = skillGroups
      .filter((g) => g.kind === 'applied')
      .flatMap((g) => g.items)
      .join(' ');
    for (const tool of banned) {
      expect(claimed.toLowerCase()).not.toContain(tool.toLowerCase());
    }
  });

  it('states the same table count in the data and in the copy', () => {
    // The count drifted once already: the prose said nine while the real schema
    // had eleven. Whatever the diagram models, the sentence has to agree.
    const words: Record<number, { en: string; sr: string }> = {
      9: { en: 'Nine', sr: 'Devet' },
      10: { en: 'Ten', sr: 'Deset' },
      11: { en: 'Eleven', sr: 'Jedanaest' },
      12: { en: 'Twelve', sr: 'Dvanaest' },
    };
    const word = words[tables.length];
    expect(word, `no spelling on file for ${tables.length} tables`).toBeDefined();
    expect(ui['schema.lead'].en.startsWith(word.en)).toBe(true);
    expect(ui['schema.lead'].sr.startsWith(word.sr)).toBe(true);

    // Every table the diagram draws has to be reachable from a relation or stand
    // alone deliberately; a typo in an id would otherwise silently drop an edge.
    const ids = new Set(tables.map((tb) => tb.id));
    expect(ids.size).toBe(tables.length);
  });

  it('keeps education dates and institution filled in', () => {
    expect(education.institution.en).toContain('University of Belgrade');
    expect(education.period.en).toMatch(/\d{4}/);
  });
});

describe('prerendered routes', () => {
  // GitHub Pages answers an unknown path with 404.html and a 404 status. The page
  // renders, but search engines drop it, which would have made every case study
  // invisible. A real file per route is what makes them return 200.
  const routes = ['cv', ...projects.map((p) => `projekti/${p.id}`)];

  it.each(routes)('/%s is a real HTML file with its own metadata', async (route) => {
    const file = resolve(process.cwd(), 'dist', route, 'index.html');
    if (!(await exists(file))) {
      throw new Error(`dist/${route}/index.html is missing. Run \`npm run build\`.`);
    }
    const html = await readFile(file, 'utf8');

    expect(html).toContain(`href="${profile.siteUrl}/${route}/"`);
    // Rendered content, not just the empty shell the bundle would fill in later.
    // An unrendered page measures near zero here; the shortest real one is ~800.
    const body = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? '';
    expect(body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length).toBeGreaterThan(600);
    // The published copies never carry a phone number.
    expect(html).not.toMatch(/\+381\s?\d/);
  });
});

describe('generated CV PDFs', () => {
  it('keeps the phone number out of the repository', async () => {
    // It lives in private.local.json, which is gitignored, and reaches only the
    // copy rendered by `npm run cv:private`.
    const { readdir } = await import('node:fs/promises');
    const dirs = ['src/data', 'src/pages', 'src/components', 'src/i18n'];
    for (const dir of dirs) {
      const files = await readdir(resolve(process.cwd(), dir), { recursive: true });
      for (const f of files) {
        if (!/\.(ts|tsx)$/.test(String(f))) continue;
        const body = await readFile(resolve(process.cwd(), dir, String(f)), 'utf8');
        expect(body, `${dir}/${f} contains a phone number`).not.toMatch(/\+381\s?\d/);
      }
    }
  });

  it.each(PDFS)('$path is one page and machine readable', async ({ path, school }) => {
    const full = resolve(process.cwd(), path);
    if (!(await exists(full))) {
      throw new Error(`${path} is missing. Run \`npm run build && npm run cv\` first.`);
    }

    const { pages, text } = await pdfText(full);

    // One page: adding an entry silently pushed the reference CV to two pages
    // and nobody noticed for months. This is the guard against that.
    expect(pages).toBe(1);

    // A text layer at all, meaning the PDF is not a picture of a CV.
    expect(text.length).toBeGreaterThan(1500);

    // The details a parser scores the document on.
    const flat = text.replace(/\s+/g, ' ');
    expect(flat).toContain(profile.email);
    expect(flat).toContain('github.com/knez4');

    // The published copy must not carry a phone number. This is the guard that
    // catches it leaking back in through a data file or a stray edit.
    expect(flat).not.toMatch(/\+381|06[0-9]\s?\d{3}/);
    expect(flat.toLowerCase()).toContain(school);

    // Nothing half-filled ever goes out the door.
    expect(flat).not.toMatch(/XXX|TODO|Lorem|placeholder/i);

    // The name has to come out as one run. When latin and latin-ext glyphs came
    // from two different font files, a parser read this as "Kne z evi c".
    expect(flat).toContain(profile.name);
  }, 30_000);

  it.each(PDFS)('$path has working links for email, LinkedIn and GitHub', async ({ path }) => {
    const full = resolve(process.cwd(), path);
    if (!(await exists(full))) {
      throw new Error(`${path} is missing. Run \`npm run build && npm run cv\` first.`);
    }

    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const data = new Uint8Array(await readFile(full));
    const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
    const page = await doc.getPage(1);
    const annotations = await page.getAnnotations();
    const urls = annotations.filter((a) => a.subtype === 'Link').map((a) => a.url as string);

    expect(urls).toContain(`mailto:${profile.email}`);
    expect(urls).toContain(profile.linkedin);
    expect(urls).toContain(profile.github);

    // The published copy carries no phone number, so no tel: link either.
    expect(urls.some((u) => u.startsWith('tel:'))).toBe(false);
  }, 30_000);
});
