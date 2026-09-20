import type { L } from './types';

export type SkillGroup = {
  label: L;
  items: string[];
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
      'Data modelling',
      'Normalization',
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
    label: { en: 'Backend and web', sr: 'Backend i veb' },
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
      'Token authentication',
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
      'Object-oriented programming',
      'Three-tier architecture',
      'Database migrations',
      'Code review',
      'UML',
      'Technical documentation',
    ],
  },
  {
    label: { en: 'Studied in coursework', sr: 'Sa fakulteta' },
    kind: 'academic',
    items: [
      'Computer networks (TCP/IP, HTTP, DNS, Ethernet, 802.11)',
      'Operating systems and computer architecture',
      'Data structures and algorithms',
      'Artificial intelligence',
      'C# language semantics',
      'NoSQL (MongoDB, Neo4j)',
      'SOAP and web services',
      'Cloud infrastructure',
    ],
  },
];

/**
 * Flattened, comma-joined form for the ATS CV. Tables break parsers; a plain line does not.
 * The coursework group is left out here because Education already lists those courses,
 * and repeating them costs a line the one-page sheet does not have.
 */
export function skillsAsLines(lang: 'en' | 'sr'): { label: string; value: string }[] {
  return skillGroups
    .filter((g) => g.kind === 'applied')
    .map((g) => ({ label: g.label[lang], value: g.items.join(', ') }));
}
