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
        'Led the IT team over a two-year term, assigning and reviewing work that produced event visuals, certificates and video content.',
        'Kept the team to the deadlines set by the wider project schedule.',
      ],
      sr: [
        'Vodio IT tim tokom dvogodišnjeg mandata, raspoređujući i pregledajući zadatke izrade vizuala, sertifikata i video sadržaja.',
        'Držao tim u rokovima koje je postavljao širi plan projekta, u svakom ciklusu DigiCon-a.',
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
        'Turn monthly Excel scorecards into per-manager HTML and JSON reports with a Python pipeline (pandas, openpyxl), replacing a manual copy-and-paste step.',
        'Produce monthly mystery-shopping reports in Adobe Illustrator, a three-year agency engagement with a betting-industry client.',
        'Build and optimize marketing sites for paying clients, with responsive WebP images and LCP-preload tuning, from written change lists and fixed deadlines.',
      ],
      sr: [
        'Pretvaram klijentove Excel tabele u HTML i JSON izveštaje po menadžeru pomoću Python pipeline-a (pandas, openpyxl), čime je zamenjen ručni prepis.',
        'Pripremam mesečne mystery shopping izveštaje u Adobe Illustrator-u, u okviru trogodišnje saradnje sa klijentom iz kladioničarske industrije, preko agencije.',
        'Pravim i optimizujem sajtove za klijente koji plaćaju, uključujući responzivnu WebP isporuku slika i podešavanje LCP preload-a, radeći po pisanim listama izmena i fiksnim rokovima.',
      ],
    },
  },
];
