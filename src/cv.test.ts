import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { profile } from './data/profile';
import { cvProjects, projects } from './data/projects';
import { experience } from './data/experience';
import { education } from './data/education';
import { skillGroups, skillsAsLines } from './data/skills';

const PDFS = [
  { path: 'public/Veljko_Knezevic_CV_EN.pdf', school: 'university of belgrade' },
  { path: 'public/Veljko_Knezevic_CV_SR.pdf', school: 'univerzitetu u beogradu' },
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

  it('keeps education dates and institution filled in', () => {
    expect(education.institution.en).toContain('University of Belgrade');
    expect(education.period.en).toMatch(/\d{4}/);
    expect(education.coursework.en.length).toBe(education.coursework.sr.length);
  });
});

describe('generated CV PDFs', () => {
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
    expect(flat).toContain(profile.phone);
    expect(flat).toContain('github.com/knez4');
    expect(flat.toLowerCase()).toContain(school);

    // Nothing half-filled ever goes out the door.
    expect(flat).not.toMatch(/XXX|TODO|Lorem|placeholder/i);

    // The name has to come out as one run. When latin and latin-ext glyphs came
    // from two different font files, a parser read this as "Kne z evi c".
    expect(flat).toContain(profile.name);
  }, 30_000);
});
