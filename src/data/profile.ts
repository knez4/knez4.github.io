import type { L } from './types';

/**
 * Contact details and where each one came from:
 *  - phone: deliberately NOT here. It lives in private.local.json, which is
 *    gitignored, and only reaches the copy rendered by `npm run cv:private`.
 *    See src/lib/privateContact.ts.
 *  - email: the machine's global git config, and the author of every commit on
 *    his three repos. TODO(veljko): confirm this is the address for applications.
 *  - index: 2022/0390, from the document metadata of the Software Design title
 *    page. The 2022/0337 in the chatbot repo name is a teammate's.
 *  - linkedin: given by Veljko directly (see the note on the field).
 */
export const profile = {
  name: 'Veljko Knežević',
  /** ASCII spelling, repeated in meta tags so name searches match. */
  nameAscii: 'Veljko Knezevic',
  initials: 'VK',
  location: { en: 'Belgrade, Serbia', sr: 'Beograd, Srbija' } as L,
  email: 'veljkoknez11@gmail.com',
  github: 'https://github.com/knez4',
  githubHandle: 'github.com/knez4',
  /**
   * ASCII vanity URL, set by Veljko in September 2026. It replaced a Unicode slug
   * (veljkokne%C5%BEevi%C4%87) that needed percent-encoding to survive PDF link
   * extraction and still rendered as veljkoknežević in the visible text, which
   * some ATS parsers split on the diacritics. The old URL no longer resolves.
   */
  linkedin: 'https://www.linkedin.com/in/knezevicveljko/',
  linkedinHandle: 'linkedin.com/in/knezevicveljko',
  siteUrl: 'https://knez4.github.io',

  /**
   * Status, not a job title. The same CV goes to backend, database and general
   * IT internship openings, so claiming one position would narrow it for no gain
   * and invite "what experience?" on a CV with no IT employment yet.
   */
  role: {
    en: 'Final-year student, Faculty of Organizational Sciences',
    sr: 'Apsolvent Fakulteta organizacionih nauka',
  } as L,

  /** Site hero only. Names the field of work so it does not repeat `role`. */
  tagline: {
    en: 'Databases and web application development',
    sr: 'Baze podataka i razvoj veb aplikacija',
  } as L,

  status: {
    en: 'Looking for an internship or junior role in Belgrade',
    sr: 'Tražim stručnu praksu ili junior poziciju u Beogradu',
  } as L,

  /**
   * The CV summary. Leads with the one thing that is deepest and hardest to
   * fake (the booking schema) and carries its real counts, rather than a
   * breadth claim like "comfortable across the stack", which is unfalsifiable
   * and reads as filler to both recruiters and AI-content screens.
   *
   * The Java desktop app is deliberately absent: it is not in `cvProjects`, so
   * naming it here sent the reader looking for a section that does not exist.
   */
  summary: {
    en:
      'Final-year Information Systems and Technologies student at the University of Belgrade. Built a ' +
      'multi-tenant appointment booking platform on PostgreSQL across 17 migrations, with the booking ' +
      'rules enforced inside the database rather than in application code. Wrote a Laravel REST API ' +
      'with two teammates, and take on paid freelance web and reporting work alongside studies. ' +
      'Available full time in Belgrade.',
    sr:
      'Student završne godine Informacionih sistema i tehnologija na Univerzitetu u Beogradu. Napravio ' +
      'multi-tenant platformu za zakazivanje termina na PostgreSQL-u kroz 17 migracija, sa pravilima ' +
      'zakazivanja u samoj bazi umesto u aplikaciji. Napisao Laravel REST API sa dve koleginice, a uz ' +
      'studije radim plaćene frilens poslove izrade sajtova i izveštaja. Dostupan puno radno vreme ' +
      'u Beogradu.',
  } as L,

  /** Short pitch for the contact section and for copy-to-clipboard. */
  pitch: {
    en:
      'I am a final-year FON student. I built a multi-tenant booking platform on PostgreSQL where the ' +
      'scheduling rules live in the database, wrote a Laravel REST API with a team, and do paid ' +
      'freelance web and reporting work. Looking for an internship in Belgrade where I can keep ' +
      'building and learning.',
    sr:
      'Student sam završne godine FON-a. Napravio sam multi-tenant platformu za zakazivanje na ' +
      'PostgreSQL-u gde pravila zakazivanja žive u samoj bazi, napisao REST API sa timom, i radim ' +
      'plaćene frilens poslove izrade sajtova i izveštaja. Tražim praksu u Beogradu gde bih nastavio ' +
      'da gradim i učim.',
  } as L,
} as const;

export const languages: { name: L; level: L }[] = [
  {
    name: { en: 'Serbian', sr: 'Srpski' },
    level: { en: 'Native', sr: 'Maternji' },
  },
  {
    name: { en: 'English', sr: 'Engleski' },
    level: {
      en: 'Solid reading and writing, speaking still developing',
      sr: 'Čitanje i pisanje na solidnom nivou, govor u razvoju',
    },
  },
];
