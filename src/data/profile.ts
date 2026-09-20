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
    en: 'Databases and backend web development',
    sr: 'Baze podataka i razvoj veb aplikacija',
  } as L,

  tagline: {
    en: 'Final-year Information Systems and Technologies student at the University of Belgrade',
    sr: 'Student završne godine Informacionih sistema i tehnologija, Univerzitet u Beogradu',
  } as L,

  status: {
    en: 'Looking for an internship or junior role in Belgrade',
    sr: 'Tražim stručnu praksu ili junior poziciju u Beogradu',
  } as L,

  /** The CV summary. Three lines, concrete, no adjectives that cannot be checked. */
  summary: {
    en:
      'Fourth-year Information Systems and Technologies student at the University of Belgrade, on the ' +
      'E-Business Technologies module. Work sits close to the database: a multi-tenant PostgreSQL schema with ' +
      'row-level security and server-side scheduling functions, a Laravel REST API built with two teammates, ' +
      'and a layered Java application over JDBC. Available full time in Belgrade.',
    sr:
      'Student četvrte godine Informacionih sistema i tehnologija na Univerzitetu u Beogradu, modul ' +
      'Tehnologije elektronskog poslovanja. Rad mi je blizu baze: multi-tenant PostgreSQL šema sa row-level ' +
      'security politikama i funkcijama za zakazivanje, Laravel REST API rađen sa dvoje kolega, i slojevita ' +
      'Java aplikacija nad JDBC-om. Dostupan puno radno vreme u Beogradu.',
  } as L,

  /** Short pitch for the contact section and for copy-to-clipboard. */
  pitch: {
    en:
      'I am a final-year FON student working mainly with relational databases and backend web development. ' +
      'I designed a multi-tenant PostgreSQL schema with row-level security and booking functions that prevent ' +
      'double bookings, and I built the data model and statistics endpoints for a Laravel REST API. ' +
      'I am looking for an internship in Belgrade where I can keep working on data models and APIs.',
    sr:
      'Student sam završne godine FON-a i radim uglavnom sa relacionim bazama i backend razvojem. ' +
      'Projektovao sam multi-tenant PostgreSQL šemu sa row-level security politikama i funkcijama za ' +
      'zakazivanje koje sprečavaju duple termine, a na Laravel REST API-ju sam radio model podataka i ' +
      'statističke endpointe. Tražim praksu u Beogradu gde bih nastavio da radim na modelima podataka i API-jima.',
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
      en: 'Working level in reading and writing, conversational speaking',
      sr: 'Radni nivo u čitanju i pisanju, govor konverzacijski',
    },
  },
];
