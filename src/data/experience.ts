import type { L, LL } from './types';

export type Role = {
  title: L;
  org: L;
  location: L;
  period: L;
  points: LL;
  /**
   * Public repos for work described in this role. Freelance claims are the one
   * part of the sheet a reader cannot otherwise check: the projects carry their
   * own links, but "built sites for paying clients" was asking to be taken on
   * faith until these went in.
   */
  repos?: { label: string; url: string }[];
  /**
   * How long he was with the organization, when that outlasts the role itself.
   * The CV groups roles under one org header and shows this there, so two short
   * project roles read as what they were, two posts inside a longer membership,
   * instead of as the whole of his time at FD.
   */
  orgPeriod?: L;
  /**
   * The stack this role was worked in, printed under the org line the way the
   * project entries print theirs. Veljko added it; the list here is the one the
   * repos actually contain.
   */
  tech?: string[];
  /**
   * 'work' prints under EXPERIENCE, 'student' under STUDENT ACTIVITIES. The
   * split is his: a reader looking for professional experience should not have
   * to sort a student organization out of it.
   */
  kind?: 'work' | 'student';
  /**
   * A student activity rendered as one line instead of a heading plus bullets,
   * which is how he laid them out. The structured fields above stay, because
   * the site still renders them in full.
   */
  compact?: L;
};

/**
 * Reverse-chronological, most current first: the freelance role is still
 * ongoing ("present"), so it leads; within FD Organization, Future Leader
 * (ending May 2024) comes before DigiCon (ending March 2024).
 *
 * The FD periods cover the work, not the event days. An earlier version dated
 * Future Leader "19 & 26 May 2024" — the two days the programme ran — which read
 * as a two-day role padded into an entry and undersold four months of partner
 * outreach and planning. The event dates live in the bullets instead.
 *
 * The two FD Organization roles are still listed separately: they carried
 * different responsibilities and a single merged entry read like a four-year
 * internship, which is what the old LinkedIn profile got wrong.
 */
export const experience: Role[] = [
  {
    title: {
      en: 'Freelance developer, websites and reporting tools',
      sr: 'Freelance razvoj sajtova i alata za izveštavanje',
    },
    org: { en: 'Self-employed, for agency clients', sr: 'Samostalno, za agencijske klijente' },
    location: { en: 'Belgrade', sr: 'Beograd' },
    period: { en: 'March 2023 – present', sr: 'mart 2023 – danas' },
    kind: 'work',
    /**
     * No PHP, Laravel or MySQL. Those belong to the chatbot, which is a faculty
     * project, not freelance work. GitHub reports flekout as HTML, Python and
     * JavaScript and Mystery-M as HTML, CSS and JavaScript, and a stack line
     * sitting directly above two links to those repos is checked in one click.
     */
    tech: ['HTML', 'CSS', 'JavaScript', 'Python', 'pandas', 'Git'],
    repos: [
      { label: 'github.com/knez4/flekout', url: 'https://github.com/knez4/flekout' },
      { label: 'github.com/knez4/Mystery-M', url: 'https://github.com/knez4/Mystery-M' },
    ],
    points: {
      /**
       * The reporting tool sits second, not first. It is the stronger line, but
       * the client sites are the longer-running work and the one a reader can
       * check against a public repo, so they lead.
       *
       * It was kept off this list entirely while it was unfinished and had never
       * been run, because it had then replaced nothing and saved no one any time.
       * It now generates all nine decks, so it belongs here.
       */
      en: [
        'Built two client websites from scratch, with responsive WebP images and a tuned LCP preload.',
        'Replaced a manual reporting routine with a Python and pandas tool that turns nine Excel workbooks into nine PDF reports in three seconds instead of about an hour.',
        'Produce monthly mystery-shopping reports in Adobe Illustrator, a three-year agency engagement with a betting-industry client.',
      ],
      sr: [
        'Izradio dva klijentska sajta, sa responzivnim WebP slikama i podešenim LCP preload-om.',
        'Zamenio ručno izveštavanje alatom u Python-u i pandas-u koji devet Excel svezaka pretvara u devet PDF izveštaja za tri sekunde, umesto za oko sat vremena.',
        'Pripremam mesečne mystery shopping izveštaje u Adobe Illustrator-u, u okviru trogodišnje saradnje sa klijentom iz kladioničarske industrije, preko agencije.',
      ],
    },
  },
  {
    title: { en: 'Project Coordinator, Future Leader', sr: 'Koordinator projekta, Future Leader' },
    org: { en: 'FON Digital Organization', sr: 'FON Digital Organization' },
    location: { en: 'Belgrade', sr: 'Beograd' },
    orgPeriod: { en: '2023 – 2025', sr: '2023 – 2025' },
    period: { en: 'Feb – May 2024', sr: 'feb. – maj 2024.' },
    kind: 'student',
    compact: {
      en: 'Future Leader (2024) · Project coordinator · coordinated around 50 members across four teams.',
      sr: 'Future Leader (2024) · Koordinator projekta · koordinisao oko 50 članova u četiri tima.',
    },
    points: {
      en: [
        'Coordinated around 50 members across the corporate relations, HR, PR and IT teams.',
        'Planned and delivered the project end to end over four months, from partner outreach to the two programme days in May 2024.',
        'Ran the programme around a case study prepared with Tehnomedija, one of the general partners.',
      ],
      sr: [
        'Koordinirao oko 50 članova kroz timove korporativne saradnje, HR, PR i IT.',
        'Vodio projekat od početka do realizacije kroz četiri meseca, od traženja partnera do dva dana programa u maju 2024.',
        'Program je bio organizovan oko studije slučaja sa kompanijom Tehnomedija, jednim od generalnih partnera.',
      ],
    },
  },
  {
    title: { en: 'IT Team Lead, DigiCon', sr: 'Vođa IT tima, DigiCon' },
    org: { en: 'FON Digital Organization', sr: 'FON Digital Organization' },
    location: { en: 'Belgrade', sr: 'Beograd' },
    period: { en: 'Dec 2023 – Mar 2024', sr: 'dec. 2023 – mart 2024.' },
    kind: 'student',
    compact: {
      en: 'DigiCon (2023 – 2024) · IT team lead · oversaw production of visuals, certificates and video content.',
      sr: 'DigiCon (2023 – 2024) · Vođa IT tima · vodio izradu vizuala, sertifikata i video sadržaja.',
    },
    points: {
      en: [
        'Led the IT team for DigiCon, assigning and reviewing event visuals, certificates and video content.',
        'Kept the team to the deadlines set by the wider project schedule, through to the conference in March 2024.',
      ],
      sr: [
        'Vodio IT tim za DigiCon, raspoređujući i pregledajući izradu vizuala, sertifikata i video sadržaja.',
        'Držao tim u rokovima koje je postavljao širi plan projekta, sve do konferencije u martu 2024.',
      ],
    },
  },
];
