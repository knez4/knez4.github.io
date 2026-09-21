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
   * Percent-encoded: a bare Unicode slug breaks some ATS parsers and PDF link extractors.
   *
   * Source: Veljko pasted this URL himself. It appears nowhere else on the machine,
   * so an automated sweep of the disk will flag it as unsourced — it is not. Leave
   * this note here rather than re-investigating it.
   */
  linkedin: 'https://www.linkedin.com/in/veljkokne%C5%BEevi%C4%87/',
  linkedinHandle: 'linkedin.com/in/veljkoknežević',
  siteUrl: 'https://knez4.github.io',

  role: {
    en: 'Final-Year IT Student',
    sr: 'Student završne godine ISiT',
  } as L,

  tagline: {
    en: 'Final-year Information Systems and Technologies student at the University of Belgrade',
    sr: 'Student završne godine Informacionih sistema i tehnologija, Univerzitet u Beogradu',
  } as L,

  status: {
    en: 'Looking for an internship or junior role in Belgrade',
    sr: 'Tražim stručnu praksu ili junior poziciju u Beogradu',
  } as L,

  /**
   * The CV summary. General on purpose: applying to a range of IT internships
   * rather than one specialization, so it names the breadth of what got built
   * (full web app, team API, desktop app) instead of leading with one layer
   * of the stack.
   */
  summary: {
    en:
      'Fourth-year Information Systems and Technologies student at the University of Belgrade. Built a ' +
      'full-stack web application end to end, from the database to the interface, a Laravel REST API with ' +
      'two teammates, and a layered Java desktop application. Comfortable across the stack, from SQL to ' +
      'React. Available full time in Belgrade.',
    sr:
      'Student četvrte godine Informacionih sistema i tehnologija na Univerzitetu u Beogradu. Napravio ' +
      'kompletnu veb aplikaciju od baze do korisničkog interfejsa, Laravel REST API sa dvoje kolega, i ' +
      'slojevitu Java desktop aplikaciju. Snalazim se kroz ceo stek, od SQL-a do React-a. Dostupan puno ' +
      'radno vreme u Beogradu.',
  } as L,

  /** Short pitch for the contact section and for copy-to-clipboard. */
  pitch: {
    en:
      'I am a final-year FON student who has built a full-stack booking web app (PostgreSQL, Laravel, ' +
      'React), a REST API with a team, and a layered Java desktop application. Comfortable across the ' +
      'stack — databases, backend APIs and frontend. Looking for an internship in Belgrade where I can ' +
      'keep building and learning.',
    sr:
      'Student sam završne godine FON-a i napravio sam kompletnu veb aplikaciju za zakazivanje ' +
      '(PostgreSQL, Laravel, React), REST API sa timom, i slojevitu Java desktop aplikaciju. Snalazim se ' +
      'kroz ceo stek — baze, backend API-je i frontend. Tražim praksu u Beogradu gde bih nastavio da ' +
      'gradim i učim.',
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
