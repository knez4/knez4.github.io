import type { L, LL } from './types';

export type Role = {
  title: L;
  org: L;
  location: L;
  period: L;
  points: LL;
};

/**
 * Two roles inside one student organization are listed separately: they carried
 * different responsibilities and a single merged entry read like a four-year
 * internship, which is what the old LinkedIn profile got wrong.
 */
export const experience: Role[] = [
  {
    title: { en: 'Project Coordinator, Future Leader', sr: 'Koordinator projekta, Future Leader' },
    org: { en: 'FD Organization (student organization)', sr: 'FD Organization (studentska organizacija)' },
    location: { en: 'Belgrade', sr: 'Beograd' },
    period: { en: '2024', sr: '2024' },
    points: {
      en: [
        'Coordinated around 50 members across the corporate relations, HR, PR and IT teams.',
        'Planned and delivered the project end to end, including partner outreach, workshops and closing presentations.',
        'Ran the programme around a case study prepared with Tehnomedija, one of the general partners.',
      ],
      sr: [
        'Koordinirao oko 50 članova kroz CR, HR, PR i IT timove.',
        'Vodio projekat od početka do realizacije: traženje partnera, radionice i završne prezentacije.',
        'Program je bio organizovan oko studije slučaja sa kompanijom Tehnomedija, jednim od generalnih partnera.',
      ],
    },
  },
  {
    title: { en: 'IT Team Lead, DigiCon', sr: 'Vođa IT tima, DigiCon' },
    org: { en: 'FD Organization', sr: 'FD Organization' },
    location: { en: 'Belgrade', sr: 'Beograd' },
    period: { en: 'May 2023 – May 2025', sr: 'maj 2023 – maj 2025' }, // TODO(veljko): exact DigiCon dates
    points: {
      en: [
        'Assigned and reviewed work for the IT team producing event visuals, certificates and video content.',
        'Kept the team to the deadlines set by the wider project schedule.',
      ],
      sr: [
        'Raspoređivao i pregledao zadatke IT tima koji je radio vizuale, sertifikate i video sadržaj.',
        'Držao tim u rokovima koje je postavljao širi plan projekta.',
      ],
    },
  },
  {
    title: { en: 'Freelance web development and reporting', sr: 'Frilens razvoj sajtova i izveštaja' },
    org: { en: 'Independent, working with agency clients', sr: 'Samostalno, kroz saradnju sa agencijskim klijentima' },
    location: { en: 'Belgrade', sr: 'Beograd' },
    period: { en: '2023 – present', sr: '2023 – danas' }, // TODO(veljko): confirm start year
    points: {
      en: [
        'Built and optimized marketing sites for paying clients, working from written change lists and fixed deadlines.',
        'Produced monthly mystery-shopping reports in Adobe Illustrator for a betting-industry client, working through an agency.',
        'Wrote a Python tool that turns the client Excel scorecards into per-manager HTML and JSON reports, replacing a manual copy-and-paste step.',
      ],
      sr: [
        'Pravio i optimizovao sajtove za klijente koji plaćaju, radeći po pisanim listama izmena i fiksnim rokovima.',
        'Pripremao mesečne mystery shopping izveštaje u Adobe Illustrator-u za klijenta iz kladioničarske industrije, preko agencije.',
        'Napisao Python alat koji klijentove Excel tabele pretvara u HTML i JSON izveštaje po menadžeru, čime je zamenjen ručni prepis.',
      ],
    },
  },
];
