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
    title: { en: 'Freelance web development and reporting', sr: 'Frilens razvoj sajtova i izveštaja' },
    org: { en: 'Independent, working with agency clients', sr: 'Samostalno, kroz saradnju sa agencijskim klijentima' },
    location: { en: 'Belgrade', sr: 'Beograd' },
    period: { en: '2023 – present', sr: '2023 – danas' },
    repos: [
      { label: 'github.com/knez4/flekout', url: 'https://github.com/knez4/flekout' },
      { label: 'github.com/knez4/Mystery-M', url: 'https://github.com/knez4/Mystery-M' },
    ],
    points: {
      en: [
        'Turn monthly Excel scorecards into HTML and JSON reports for nine managers with a Python pipeline (pandas, openpyxl), replacing a manual copy-and-paste step.',
        'Build marketing sites from scratch for paying clients, with responsive WebP images at three widths and LCP-preload tuning, from written change lists and fixed deadlines.',
        'Produce monthly mystery-shopping reports in Adobe Illustrator, a three-year agency engagement with a betting-industry client.',
      ],
      sr: [
        'Pretvaram klijentove Excel tabele u HTML i JSON izveštaje za devet menadžera pomoću Python pipeline-a (pandas, openpyxl), čime je zamenjen ručni prepis.',
        'Pravim sajtove za klijente koji plaćaju od nule, uključujući responzivnu WebP isporuku slika na tri širine i podešavanje LCP preload-a, radeći po pisanim listama izmena i fiksnim rokovima.',
        'Pripremam mesečne mystery shopping izveštaje u Adobe Illustrator-u, u okviru trogodišnje saradnje sa klijentom iz kladioničarske industrije, preko agencije.',
      ],
    },
  },
  {
    title: { en: 'Project Coordinator, Future Leader', sr: 'Koordinator projekta, Future Leader' },
    org: { en: 'FD Organization (student organization)', sr: 'FD Organization (studentska organizacija)' },
    location: { en: 'Belgrade', sr: 'Beograd' },
    orgPeriod: { en: '2023 – 2025', sr: '2023 – 2025.' },
    period: { en: 'Feb – May 2024', sr: 'feb. – maj 2024.' },
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
    org: { en: 'FD Organization (student organization)', sr: 'FD Organization (studentska organizacija)' },
    location: { en: 'Belgrade', sr: 'Beograd' },
    period: { en: 'Dec 2023 – Mar 2024', sr: 'dec. 2023 – mart 2024.' },
    points: {
      en: [
        'Led the IT team for DigiCon, assigning and reviewing work that produced event visuals, certificates and video content.',
        'Kept the team to the deadlines set by the wider project schedule, through to the conference in March 2024.',
      ],
      sr: [
        'Vodio IT tim za DigiCon, raspoređujući i pregledajući zadatke izrade vizuala, sertifikata i video sadržaja.',
        'Držao tim u rokovima koje je postavljao širi plan projekta, sve do konferencije u martu 2024.',
      ],
    },
  },
];
