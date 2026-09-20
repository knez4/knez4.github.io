export type Lang = 'en' | 'sr';

export const LANGS: Lang[] = ['en', 'sr'];

/** UI chrome only. Content lives in src/data and carries its own translations. */
export const ui = {
  'nav.projects': { en: 'Projects', sr: 'Projekti' },
  'nav.schema': { en: 'Data model', sr: 'Model podataka' },
  'nav.skills': { en: 'Skills', sr: 'Veštine' },
  'nav.experience': { en: 'Experience', sr: 'Iskustvo' },
  'nav.education': { en: 'Education', sr: 'Obrazovanje' },
  'nav.contact': { en: 'Contact', sr: 'Kontakt' },
  'nav.cv': { en: 'CV', sr: 'CV' },
  'nav.menu': { en: 'Menu', sr: 'Meni' },
  'nav.skipToContent': { en: 'Skip to content', sr: 'Preskoči na sadržaj' },
  'nav.home': { en: 'Home', sr: 'Početna' },

  'theme.toggle': { en: 'Switch theme', sr: 'Promeni temu' },
  'lang.toggle': { en: 'Switch language', sr: 'Promeni jezik' },
  'lang.en': { en: 'English', sr: 'Engleski' },
  'lang.sr': { en: 'Serbian', sr: 'Srpski' },

  'hero.viewProjects': { en: 'See the work', sr: 'Pogledaj radove' },
  'hero.downloadCv': { en: 'Download CV', sr: 'Preuzmi CV' },
  'hero.emailMe': { en: 'Send an email', sr: 'Pošalji mejl' },

  'projects.title': { en: 'Selected work', sr: 'Izabrani radovi' },
  'projects.eyebrow': { en: 'Projects', sr: 'Projekti' },
  'projects.readCase': { en: 'Read the case study', sr: 'Pročitaj studiju slučaja' },
  'projects.viewRepo': { en: 'Source code', sr: 'Izvorni kod' },
  'projects.viewLive': { en: 'Live site', sr: 'Sajt uživo' },
  'projects.back': { en: 'Back to all projects', sr: 'Nazad na sve projekte' },
  'projects.notFound': { en: 'That project does not exist.', sr: 'Taj projekat ne postoji.' },

  'status.prototype': { en: 'Working prototype', sr: 'Funkcionalan prototip' },
  'status.delivered': { en: 'Delivered to client', sr: 'Isporučeno klijentu' },
  'status.coursework': { en: 'University coursework', sr: 'Fakultetski rad' },
  'status.maintained': { en: 'Maintained', sr: 'Održava se' },

  'case.problem': { en: 'The problem', sr: 'Problem' },
  'case.approach': { en: 'How it works', sr: 'Kako radi' },
  'case.decisions': { en: 'Trade-offs', sr: 'Kompromisi' },
  'case.limits': { en: 'What this is not', sr: 'Šta ovo nije' },
  'case.stack': { en: 'Stack', sr: 'Tehnologije' },

  'schema.eyebrow': { en: 'Data model', sr: 'Model podataka' },
  'schema.title': { en: 'The booking schema, up close', sr: 'Šema zakazivanja, izbliza' },
  'schema.lead': {
    en: 'Nine tables, and one function that is allowed to write an appointment. Select a table to see what it holds and who is allowed to read it.',
    sr: 'Devet tabela i jedna funkcija koja sme da upiše termin. Izaberi tabelu da vidiš šta sadrži i ko sme da je čita.',
  },
  'schema.columns': { en: 'Columns', sr: 'Kolone' },
  'schema.rls': { en: 'Row Level Security', sr: 'Row Level Security' },
  'schema.purpose': { en: 'Purpose', sr: 'Uloga' },
  'schema.pk': { en: 'primary key', sr: 'primarni ključ' },
  'schema.fk': { en: 'references', sr: 'referiše' },
  'schema.selectHint': { en: 'Select a table', sr: 'Izaberi tabelu' },
  'schema.functionTitle': { en: 'What happens when someone books', sr: 'Šta se dešava kada neko zakaže' },

  'skills.eyebrow': { en: 'Skills', sr: 'Veštine' },
  'skills.title': { en: 'What I can be asked to show', sr: 'Ono što mogu da pokažem' },
  'skills.appliedNote': {
    en: 'Everything above this line was used to build something that exists. Below it is coursework: studied, but with no artifact to show.',
    sr: 'Sve iznad ove linije korišćeno je da se napravi nešto što postoji. Ispod je gradivo sa fakulteta: učeno, ali bez artefakta koji mogu da pokažem.',
  },

  'experience.eyebrow': { en: 'Experience', sr: 'Iskustvo' },
  'experience.title': { en: 'Where I have worked', sr: 'Gde sam radio' },

  'education.eyebrow': { en: 'Education', sr: 'Obrazovanje' },
  'education.title': { en: 'Studies', sr: 'Studije' },
  'education.coursework': { en: 'Relevant coursework', sr: 'Relevantni predmeti' },
  'education.selfDirected': { en: 'On my own', sr: 'Samostalno' },
  'education.languages': { en: 'Languages', sr: 'Jezici' },

  'contact.eyebrow': { en: 'Contact', sr: 'Kontakt' },
  'contact.title': { en: 'Get in touch', sr: 'Javi se' },
  'contact.copyPitch': { en: 'Copy short intro', sr: 'Kopiraj kratak opis' },
  'contact.copied': { en: 'Copied', sr: 'Kopirano' },

  'cv.title': { en: 'Curriculum vitae', sr: 'Biografija' },
  'cv.print': { en: 'Print or save as PDF', sr: 'Odštampaj ili sačuvaj kao PDF' },
  'cv.summary': { en: 'Summary', sr: 'Rezime' },
  'cv.skills': { en: 'Technical skills', sr: 'Tehničke veštine' },
  'cv.projects': { en: 'Projects', sr: 'Projekti' },
  'cv.experience': { en: 'Experience', sr: 'Iskustvo' },
  'cv.education': { en: 'Education', sr: 'Obrazovanje' },
  'cv.languages': { en: 'Languages', sr: 'Jezici' },
  'cv.coursework': { en: 'Relevant coursework', sr: 'Relevantni predmeti' },

  'footer.builtWith': {
    en: 'Built with React, TypeScript and Tailwind. Source on GitHub.',
    sr: 'Napravljeno u React-u, TypeScript-u i Tailwind-u. Izvorni kod na GitHub-u.',
  },
  'footer.lastUpdated': { en: 'Last updated', sr: 'Poslednja izmena' },

  'notFound.title': { en: 'Page not found', sr: 'Stranica nije pronađena' },
  'notFound.back': { en: 'Go to the home page', sr: 'Idi na početnu' },
} as const;

export type UiKey = keyof typeof ui;

export function t(key: UiKey, lang: Lang): string {
  return ui[key][lang];
}
