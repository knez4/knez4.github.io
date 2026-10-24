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

  /*
   * Plain-language home page (20 October 2026). Written for someone outside IT:
   * what he does, for whom, how working with him goes. Technical copy lives in
   * the collapsed section further down.
   */
  /** Search title and description for the home page. Under 60 and 160 characters. */
  'seo.title': { en: 'Veljko Knežević · Websites and automation, Belgrade', sr: 'Veljko Knežević · Izrada sajtova i automatizacija, Beograd' },
  'seo.description': {
    en: 'Veljko Knežević builds websites, automates repetitive work and works with databases. Final-year student at FON in Belgrade. Example: flekoutclean.com.',
    sr: 'Veljko Knežević pravi sajtove, automatizuje posao koji se ponavlja i radi sa bazama podataka. Student završne godine FON-a, Beograd. Primer: flekoutclean.com.',
  },
  'hero.plainRole': {
    en: 'I build websites and automate the work that keeps repeating.',
    sr: 'Pravim sajtove i automatizujem posao koji se stalno ponavlja.',
  },
  'hero.plainSub': { en: 'Final-year student at FON · Belgrade', sr: 'Student završne godine FON-a · Beograd' },
  'hero.available': { en: 'Available for new projects and internships', sr: 'Dostupan za nove projekte i praksu' },
  'cta.talk': { en: 'Get in touch', sr: 'Javi se' },

  'nav.services': { en: 'Services', sr: 'Usluge' },
  'nav.process': { en: 'How I work', sr: 'Kako radim' },
  'nav.about': { en: 'About', sr: 'O meni' },
  'nav.work': { en: 'Work', sr: 'Radovi' },
  'nav.tech': { en: 'For professionals', sr: 'Za stručnjake' },

  'services.eyebrow': { en: 'Services', sr: 'Usluge' },
  'services.title': { en: 'What I can do for you', sr: 'Šta mogu da uradim za tebe' },
  'services.sites': { en: 'Websites', sr: 'Sajtovi' },
  'services.sitesBody': {
    en: 'A site that looks like your business and works as well on a phone as on a laptop. From the first sketch to launch.',
    sr: 'Sajt koji liči na tvoj posao i radi jednako dobro na telefonu kao na računaru. Od prve skice do objave.',
  },
  'services.auto': { en: 'Automation', sr: 'Automatizacija' },
  'services.autoBody': {
    en: 'If you do the same thing by hand every week or every month, a program can do it for you, in seconds.',
    sr: 'Ako isti posao radiš ručno svake nedelje ili svakog meseca, program može da ga uradi umesto tebe, za par sekundi.',
  },
  'services.apps': { en: 'Apps and databases', sr: 'Aplikacije i baze podataka' },
  'services.appsBody': {
    en: 'Apps that keep your data in order, for example online booking where two clients can never take the same slot.',
    sr: 'Aplikacije koje drže tvoje podatke u redu, na primer online zakazivanje u kome dva klijenta nikad ne mogu da dobiju isti termin.',
  },
  'services.example': { en: 'Example', sr: 'Primer' },
  'services.illustration': { en: 'illustration', sr: 'ilustracija' },

  'ba.drag': { en: 'Drag', sr: 'Prevuci' },
  'ba.before': { en: 'Before: by hand', sr: 'Ranije: ručno' },
  'ba.after': { en: 'Now: automatic', sr: 'Sada: automatski' },
  'ba.b1': { en: 'copying from 9 Excel sheets', sr: 'prepisivanje iz 9 Excel tabela' },
  'ba.b2': { en: '9 reports, typeset by hand', sr: '9 izveštaja, ručno slaganje' },
  'ba.b3': { en: 'every month, again', sr: 'svakog meseca, ispočetka' },
  'ba.a1': { en: '9 finished PDF reports', sr: '9 gotovih PDF izveštaja' },
  'ba.a2': { en: 'the same design as before', sr: 'isti dizajn kao ranije' },
  'ba.a3': { en: 'mistakes in the sheets get flagged', sr: 'greške u tabelama se same prijave' },
  'ba.caption': {
    en: 'A real case: monthly reports for a client.',
    sr: 'Stvaran primer: mesečni izveštaji za klijenta.',
  },
  'ba.label': { en: 'Compare before and after', sr: 'Uporedi pre i posle' },

  'process.eyebrow': { en: 'How I work', sr: 'Kako radim' },
  'process.title': { en: 'Working together, in four steps', sr: 'Saradnja u četiri koraka' },
  'process.s1': { en: 'You get in touch', sr: 'Javiš se' },
  'process.s1b': { en: 'Write in a few sentences what you need. No technical words required.', sr: 'Napišeš u par rečenica šta ti treba. Stručne reči nisu potrebne.' },
  'process.s2': { en: 'We talk it through', sr: 'Dogovorimo se' },
  'process.s2b': { en: 'What exactly gets built, how it should look, and by when.', sr: 'Šta tačno pravimo, kako treba da izgleda i do kada.' },
  'process.s3': { en: 'I build and show you', sr: 'Pravim i pokazujem ti' },
  'process.s3b': { en: 'You see progress along the way and say what to change.', sr: 'Usput vidiš kako napreduje i kažeš šta da se promeni.' },
  'process.s4': { en: 'It goes live', sr: 'Puštamo u rad' },
  'process.s4b': { en: 'The site or the tool starts working for you.', sr: 'Sajt ili alat počinje da radi za tebe.' },

  'about.eyebrow': { en: 'About', sr: 'O meni' },
  'about.title': { en: 'Who you would be working with', sr: 'Sa kim bi radio' },
  'about.p1': {
    en: 'I’m Veljko, a final-year student at the Faculty of Organizational Sciences in Belgrade. For three years I have been freelancing: building websites and tools that save people time.',
    sr: 'Ja sam Veljko, student završne godine Fakulteta organizacionih nauka u Beogradu. Već tri godine radim kao frilenser: pravim sajtove i alate koji ljudima štede vreme.',
  },
  'about.p2': {
    en: 'At university I led an IT team and coordinated a project with around 50 people, so I know how to work with others and keep a deadline.',
    sr: 'Na fakultetu sam vodio IT tim i koordinisao projekat sa oko 50 ljudi, pa znam da radim sa drugima i da ispoštujem rok.',
  },
  'about.f1': { en: 'years of freelance work', sr: 'godine frilens rada' },
  'about.f2': { en: 'people on the project I coordinated', sr: 'ljudi na projektu koji sam vodio' },
  'about.f3': { en: 'Belgrade', sr: 'Beograd' },
  'about.f3b': { en: 'where I live and work', sr: 'gde živim i radim' },

  'work.eyebrow': { en: 'Work', sr: 'Radovi' },
  'work.title': { en: 'What I have made', sr: 'Šta sam napravio' },
  'work.details': { en: 'Details', sr: 'Detalji' },
  'work.visit': { en: 'Visit the site', sr: 'Poseti sajt' },

  'tech.eyebrow': { en: 'For professionals', sr: 'Za stručnjake' },
  'tech.title': { en: 'For employers and developers', sr: 'Za poslodavce i programere' },
  'tech.lead': {
    en: 'The technical detail, for whoever wants it. Open only what you need.',
    sr: 'Tehnički detalji, za one koje zanimaju. Otvori samo ono što ti treba.',
  },
  'tech.terminal': { en: 'Ask my database (a live SQL terminal)', sr: 'Pitaj moju bazu (SQL terminal uživo)' },
  'tech.projects': { en: 'Projects in technical detail', sr: 'Projekti, tehnički detaljno' },
  'tech.schema': { en: 'Data model of the booking system', sr: 'Model podataka sistema za zakazivanje' },
  'tech.skills': { en: 'Skills', sr: 'Veštine' },
  'tech.experience': { en: 'Experience', sr: 'Iskustvo' },
  'tech.education': { en: 'Education and languages', sr: 'Obrazovanje i jezici' },
  'tech.cv': { en: 'Download CV (PDF)', sr: 'Preuzmi CV (PDF)' },

  'contact.plainLead': {
    en: 'Have an idea for a site, or work you would like to automate? Write to me.',
    sr: 'Imaš ideju za sajt ili posao koji bi da automatizuješ? Piši mi.',
  },

  'hero.viewProjects': { en: 'See the work', sr: 'Pogledaj radove' },
  'hero.downloadCv': { en: 'Download CV', sr: 'Preuzmi CV' },
  'hero.emailMe': { en: 'Send an email', sr: 'Pošalji mejl' },
  /** The field, not a job title: he has no IT employment yet (see profile.role). */
  'hero.role': { en: 'Web design, automation and databases', sr: 'Web dizajn, automatizacija i baze podataka' },
  'hero.sub': { en: 'Final-year student at FON · Belgrade', sr: 'Student završne godine FON-a · Beograd' },
  'hero.scroll': { en: 'Scroll', sr: 'Skroluj' },
  'hero.terminalHint': { en: 'Ask my database', sr: 'Pitaj moju bazu' },
  'nav.talk': { en: "Let's talk", sr: 'Javi se' },

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
  'status.unfinished': { en: 'Unfinished, never run', sr: 'Nedovršeno, nikad pokrenuto' },

  'case.problem': { en: 'The problem', sr: 'Problem' },
  'case.approach': { en: 'How it works', sr: 'Kako radi' },
  'case.decisions': { en: 'Trade-offs', sr: 'Kompromisi' },
  'case.limits': { en: 'What this is not', sr: 'Šta ovo nije' },
  'case.stack': { en: 'Stack', sr: 'Tehnologije' },

  'schema.eyebrow': { en: 'Data model', sr: 'Model podataka' },
  'schema.title': { en: 'The booking schema, up close', sr: 'Šema zakazivanja, izbliza' },
  'schema.lead': {
    en: 'Eleven tables, and one function that is allowed to write an appointment. Select a table to see what it holds and who is allowed to read it.',
    sr: 'Jedanaest tabela i jedna funkcija koja sme da upiše termin. Izaberi tabelu da vidiš šta sadrži i ko sme da je čita.',
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
  'education.languages': { en: 'Languages', sr: 'Jezici' },

  'freelance.eyebrow': { en: 'For clients', sr: 'Za klijente' },
  'freelance.title': { en: 'Need a site or automation?', sr: 'Treba ti sajt ili automatizacija?' },
  'freelance.lead': {
    en: 'Alongside my studies I build websites and automate work for clients. Tell me what you need and we will find the way.',
    sr: 'Pored studija radim sajtove i automatizaciju za klijente. Napiši šta ti treba i naći ćemo rešenje.',
  },
  'freelance.sites': { en: 'Website development', sr: 'Izrada sajtova' },
  'freelance.automation': { en: 'Automation', sr: 'Automatizacija' },
  /** Offers are open-ended; the examples are only what he has actually shipped. */
  'freelance.sitesBody': {
    en: 'From the first sketch to launch. A site that looks like your brand and works just as well on a phone as on a laptop.',
    sr: 'Od prve skice do objave. Sajt koji liči na tvoj brend i radi jednako dobro na telefonu kao i na računaru.',
  },
  'freelance.automationBody': {
    en: 'If you do something by hand and it keeps repeating (copying between spreadsheets, the same report every month, processing data), a program can do it for you.',
    sr: 'Ako nešto radiš ručno i to se ponavlja (prepisivanje iz tabela, isti izveštaj svakog meseca, obrada podataka), to može da radi program umesto tebe.',
  },
  'freelance.sitesCaption': { en: 'Flekout, a site I built', sr: 'Flekout, sajt koji sam napravio' },
  'freelance.flekoutAlt': { en: 'The Flekout website on a laptop', sr: 'Sajt Flekout na računaru' },
  'freelance.flekoutMobileAlt': { en: 'The Flekout website on a phone', sr: 'Sajt Flekout na telefonu' },
  'freelance.before': { en: 'Before', sr: 'Ranije' },
  'freelance.after': { en: 'Now', sr: 'Sada' },
  /** About six hours by hand for the nine reports, his figure (15 October 2026); it was wrongly ~1 h before. */
  'freelance.beforeVal': { en: '~6 h', sr: '~6 h' },
  'freelance.afterVal': { en: '3 s', sr: '3 s' },
  'freelance.beforeNote': { en: 'of manual work, every month', sr: 'ručnog rada, svakog meseca' },
  'freelance.afterNote': { en: 'and all nine reports are ready', sr: 'i svih devet izveštaja je gotovo' },
  'freelance.mailSubject': { en: 'Project enquiry', sr: 'Upit za saradnju' },
  'freelance.cta': { en: "Have an idea? Let's talk.", sr: 'Imaš ideju? Javi se.' },
  'freelance.direct': { en: 'You work with me directly.', sr: 'Radiš direktno sa mnom.' },
  'freelance.ask': { en: 'Send an enquiry', sr: 'Pošalji upit' },
  'freelance.mailBody': {
    en: 'Hi Veljko,\n\nWhat I need (a website / an automation / something else):\n\nA few words about the business:\n\nDeadline:\n\nThanks!',
    sr: 'Zdravo Veljko,\n\nTreba mi (sajt / automatizacija / nešto treće):\n\nUkratko o poslu:\n\nRok:\n\nHvala!',
  },
  'freelance.autoCaption': {
    en: 'A real case: monthly client reports, nine spreadsheets into nine finished PDFs',
    sr: 'Stvaran primer: mesečni izveštaji za klijenta, devet tabela u devet gotovih PDF-ova',
  },
  'nav.freelance': { en: 'For clients', sr: 'Za klijente' },

  'contact.eyebrow': { en: 'Contact', sr: 'Kontakt' },
  'contact.title': { en: 'Get in touch', sr: 'Javi se' },
  'contact.big': { en: 'Pass me the ball.', sr: 'Dodaj loptu.' },
  /** He agreed to promise a 24-hour reply (15 October 2026). Keep it only while that holds. */
  'contact.reply': { en: 'I reply within 24 hours', sr: 'Odgovaram u roku od 24 sata' },
  'contact.invite': { en: 'Invite me to an interview', sr: 'Pozovi me na razgovor' },
  'contact.inviteSubject': { en: 'Interview invitation', sr: 'Poziv na razgovor' },
  'contact.inviteBody': {
    en: 'Hi Veljko,\n\nCompany:\n\nPosition:\n\nWhen would suit you for a conversation?\n\nBest,',
    sr: 'Zdravo Veljko,\n\nFirma:\n\nPozicija:\n\nKada ti odgovara razgovor?\n\nPozdrav,',
  },
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
  'cv.educationAndLanguages': { en: 'Education and languages', sr: 'Obrazovanje i jezici' },
  'cv.studentActivities': { en: 'Student activities', sr: 'Studentske aktivnosti' },
  'cv.studentOrg': { en: 'Student organization', sr: 'Studentska organizacija' },

  'footer.top': { en: 'Back to top', sr: 'Nazad na vrh' },
  'footer.lastUpdated': { en: 'Last updated', sr: 'Poslednja izmena' },

  'notFound.title': { en: 'Page not found', sr: 'Stranica nije pronađena' },
  'notFound.back': { en: 'Go to the home page', sr: 'Idi na početnu' },
  'notFound.lead': {
    en: 'This page does not exist. The shot missed everything: rim, board, and the net.',
    sr: 'Ova stranica ne postoji. Šut je promašio sve: obruč, tablu i mrežicu.',
  },
} as const;

export type UiKey = keyof typeof ui;

export function t(key: UiKey, lang: Lang): string {
  return ui[key][lang];
}
