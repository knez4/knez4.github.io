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
    /**
     * Ordered by how deep the evidence goes, not alphabetically: PostgreSQL and
     * Row Level Security are the parts no other student CV has, so they sit
     * where a six-second scan lands instead of at the end of the line.
     *
     * Microsoft SQL Server is out. It was faculty exposure with nothing on disk,
     * and listing five engines invited "which one do you actually know?" while
     * diluting the one answer worth giving.
     */
    items: [
      'SQL',
      'PostgreSQL',
      'PL/pgSQL',
      'Row Level Security',
      { en: 'Relational data modeling', sr: 'Modelovanje relacionih baza' },
      { en: 'Normalization', sr: 'Normalizacija' },
      'Oracle SQL',
      'MySQL',
    ],
  },
  {
    label: { en: 'Languages', sr: 'Programski jezici' },
    kind: 'applied',
    /**
     * No SQL here: it leads the Databases line, and repeating it read as padding.
     *
     * Ordered by what there is to show. Python moved up when the reporting tool
     * started generating all nine decks; C# moved to the end, where a language
     * with coursework behind it and no file on disk belongs.
     */
    items: ['PHP', 'Python', 'TypeScript', 'JavaScript', 'Java', 'C#'],
  },
  {
    label: { en: 'Backend & APIs', sr: 'Backend i API' },
    kind: 'applied',
    /**
     * No Node.js: it appeared in no project's stack. The Supabase edge function
     * is Deno, the chatbot is PHP, the report pipeline is Python, and the client
     * sites are static. Build tooling alone does not survive "have you written a
     * Node backend?", so it comes off for the same reason Eloquent ORM did.
     *
     * React, HTML and CSS used to sit here too, which is simply wrong and the
     * kind of error a technical reader notices before anything else. They have
     * their own group now.
     */
    items: ['Laravel', 'Laravel Sanctum', 'REST API', 'JSON'],
  },
  {
    label: { en: 'Frontend', sr: 'Frontend' },
    kind: 'applied',
    items: ['React', 'HTML', 'CSS'],
  },
  {
    label: { en: 'Tools', sr: 'Alati' },
    kind: 'applied',
    /**
     * No Excel. The reporting work already describes it in Experience, and on a
     * line next to Git, Postman and Oracle SQL Developer it read as filler.
     */
    items: ['Git', 'GitHub', 'Postman', 'Oracle SQL Developer'],
  },
  {
    label: { en: 'Practices', sr: 'Metode rada' },
    kind: 'applied',
    /**
     * 'Data structures and algorithms' sits here rather than under coursework
     * because of ~/eclipse-workspace: 64 hand-written files implementing doubly
     * linked lists, circular lists and binary trees against the faculty's LABIS
     * abstract classes. The framework was provided; the method bodies are his.
     *
     * No 'Three-tier architecture'. It was here for the Software Design NetBeans
     * exercise, which turned out to be downloaded. Reattaching it to the booking
     * platform was a retrofit: Veljko never designed that app in those terms, so
     * the phrase would have been one he defended with an argument I made for him.
     * Do not add it back on the strength of the salon.
     */
    items: [
      { en: 'Object-oriented programming', sr: 'Objektno orijentisano programiranje' },
      { en: 'Data structures and algorithms', sr: 'Strukture podataka i algoritmi' },
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
      { en: 'Artificial intelligence', sr: 'Veštačka inteligencija' },
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
 * The coursework group is left out: it's studied, not built, so it stays under
 * 'academic' on the site and out of the CV's skills block entirely.
 */
export function skillsAsLines(lang: 'en' | 'sr'): { label: string; value: string }[] {
  return skillGroups
    .filter((g) => g.kind === 'applied')
    .map((g) => ({ label: g.label[lang], value: g.items.map((item) => pickItem(item, lang)).join(', ') }));
}
