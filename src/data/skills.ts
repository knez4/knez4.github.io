import type { L } from './types';

/** A skill entry: a bare string for product/technology names kept the same in
 * both languages (SQL, PostgreSQL, React...), or an {en, sr} pair for a
 * descriptive phrase that has a standard Serbian term (Normalization, Code
 * review, ...). Mixing untranslated product names into an otherwise Serbian
 * CV is normal in the local job market; leaving process/concept phrases in
 * English is not, and reads as an unfinished translation. */
export type SkillItem = string | L;

export type SkillGroup = {
  label: L;
  items: SkillItem[];
  /**
   * 'applied'  = used to build something that exists on disk
   * 'academic' = studied in a course, no artifact to show
   * Keeping these apart is deliberate: anything marked 'applied' has to survive
   * a "show me" question in an interview.
   */
  kind: 'applied' | 'academic';
};

export const skillGroups: SkillGroup[] = [
  {
    label: { en: 'Databases', sr: 'Baze podataka' },
    kind: 'applied',
    items: [
      'SQL',
      'PostgreSQL',
      'Oracle SQL',
      'MySQL',
      'Microsoft SQL Server',
      { en: 'Data modelling', sr: 'Modelovanje podataka' },
      { en: 'Normalization', sr: 'Normalizacija' },
      'JDBC',
      'Row Level Security',
    ],
  },
  {
    label: { en: 'Languages', sr: 'Programski jezici' },
    kind: 'applied',
    items: ['Java', 'SQL', 'PHP', 'TypeScript', 'JavaScript', 'Python'],
  },
  {
    label: { en: 'Backend & APIs', sr: 'Backend i API' },
    kind: 'applied',
    items: [
      'Laravel',
      'REST API',
      'JSON',
      'React',
      'Node.js',
      'HTML',
      'CSS',
      'Eloquent ORM',
      'Laravel Sanctum',
    ],
  },
  {
    label: { en: 'Tools', sr: 'Alati' },
    kind: 'applied',
    items: ['Git', 'GitHub', 'Postman', 'Oracle SQL Developer', 'Excel'],
  },
  {
    label: { en: 'Practices', sr: 'Metode rada' },
    kind: 'applied',
    items: [
      { en: 'Object-oriented programming', sr: 'Objektno orijentisano programiranje' },
      { en: 'Three-tier architecture', sr: 'Troslojna arhitektura' },
      { en: 'Database migrations', sr: 'Migracije baze podataka' },
      'UML',
      { en: 'Technical documentation', sr: 'Tehnička dokumentacija' },
    ],
  },
  {
    label: { en: 'Studied in coursework', sr: 'Sa fakulteta' },
    kind: 'academic',
    items: [
      { en: 'Computer networks (TCP/IP, HTTP, DNS, Ethernet, 802.11)', sr: 'Računarske mreže (TCP/IP, HTTP, DNS, Ethernet, 802.11)' },
      { en: 'Operating systems and computer architecture', sr: 'Operativni sistemi i arhitektura računara' },
      { en: 'Data structures and algorithms', sr: 'Strukture podataka i algoritmi' },
      { en: 'Artificial intelligence', sr: 'Veštačka inteligencija' },
      { en: 'C# language semantics', sr: 'Osnove C# jezika' },
      'NoSQL (MongoDB, Neo4j)',
      { en: 'SOAP and web services', sr: 'SOAP i veb servisi' },
      { en: 'Cloud infrastructure', sr: 'Cloud infrastruktura' },
    ],
  },
];

export function pickItem(item: SkillItem, lang: 'en' | 'sr'): string {
  return typeof item === 'string' ? item : item[lang];
}

/**
 * Flattened, comma-joined form for the ATS CV. Tables break parsers; a plain line does not.
 * The coursework group is left out here because Education already lists those courses,
 * and repeating them costs a line the one-page sheet does not have.
 */
export function skillsAsLines(lang: 'en' | 'sr'): { label: string; value: string }[] {
  return skillGroups
    .filter((g) => g.kind === 'applied')
    .map((g) => ({ label: g.label[lang], value: g.items.map((item) => pickItem(item, lang)).join(', ') }));
}
