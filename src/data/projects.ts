import type { Project } from './types';

/**
 * Ground rules for this file, agreed before it was written:
 *  - Every claim here is backed by a file or a commit in the corresponding repo.
 *  - Nothing is described as live or in production without a URL that resolves.
 *  - Work done by teammates is not claimed. The chatbot entry covers only the
 *    commits authored by Veljko.
 *  - `media` is required. A project with no screenshot fails the test suite.
 */
export const projects: Project[] = [
  {
    id: 'booking-platform',
    rank: 1,
    year: '2026',
    status: 'prototype',
    title: {
      en: 'Appointment booking platform',
      sr: 'Platforma za zakazivanje termina',
    },
    subtitle: {
      en: 'Multi-tenant scheduling on PostgreSQL, with the booking rules inside the database',
      sr: 'Multi-tenant zakazivanje na PostgreSQL-u, sa pravilima rezervacije unutar baze',
    },
    context: {
      en:
        'My mother runs a hair salon and booked every appointment in a paper notebook. ' +
        'I built this to replace it. Sole developer, 43 commits over four weeks.',
      sr:
        'Moja majka ima frizerski salon i termine je vodila u svesci. Ovo sam napravio da je zameni. ' +
        'Radio sam sam, 43 commit-a tokom četiri nedelje.',
    },
    highlights: {
      en: [
        'Designed an 11-table multi-tenant PostgreSQL database and wrote the booking logic so two clients cannot take the same staff member’s slot.',
        'Set up role-based access for owners, managers and staff using Row Level Security policies.',
        'Covered the scheduling rules with SQL tests that assert against a seeded database inside a transaction.',
        'Built a full-stack booking app end to end: public booking page, staff scheduling, client management and an admin dashboard.',
        'Automated email confirmations for new appointments through a background job queue.',
      ],
      sr: [
        'Projektovao multi-tenant PostgreSQL bazu od 11 tabela i napisao logiku zakazivanja tako da dva klijenta ne mogu da zauzmu isti termin kod istog zaposlenog.',
        'Dodao pristup po ulogama za vlasnike, menadžere i zaposlene kroz PostgreSQL Row Level Security.',
        'Pokrio pravila zakazivanja SQL testovima nad pripremljenom bazom, unutar transakcije.',
        'Napravio kompletnu aplikaciju za zakazivanje: javna stranica za zakazivanje, raspored zaposlenih, upravljanje klijentima i admin panel.',
        'Automatizovao potvrde mejlom za nove termine kroz pozadinski red zadataka.',
      ],
    },
    tech: [
      'PostgreSQL',
      'SQL',
      'Supabase',
      'Row Level Security',
      'PL/pgSQL',
      'React',
      'TypeScript',
      'Vite',
      'Deno',
      'Resend',
    ],
    repoUrl: 'https://github.com/knez4/frizerski-salon',
    media: [
      {
        src: '/screenshots/booking-schema.svg',
        alt: {
          en: 'Entity relationship diagram of the eleven booking tables',
          sr: 'Dijagram veza između jedanaest tabela sistema za zakazivanje',
        },
        caption: {
          en: 'The data model: salons own staff, services and working hours; appointments reference all three.',
          sr: 'Model podataka: saloni sadrže zaposlene, usluge i radno vreme; termini referišu sve troje.',
        },
      },
    ],
    caseStudy: {
      problem: {
        en:
          'Appointments were written in a notebook. Double bookings happened, nobody could see the schedule ' +
          'remotely, and there was no record of which client came back. The hard part is not the form, it is ' +
          'making sure two people cannot take the same slot when both submit at the same moment.',
        sr:
          'Termini su se pisali u svesku. Dešavali su se dupli termini, raspored se nije mogao videti sa strane, ' +
          'i nije postojala evidencija koji se klijent vraća. Teško nije napraviti formu, nego obezbediti da dva ' +
          'klijenta ne uzmu isti termin kada oboje pošalju zahtev u istom trenutku.',
      },
      approach: {
        en: [
          'Put the rules in the database, not in the client. Both available-slot computation and appointment creation are PostgreSQL functions called over RPC, so a modified frontend cannot bypass them.',
          'create_appointment takes a row lock and re-reads availability inside the same transaction before inserting.',
          'Row Level Security gives three tiers: public sees only what a booking page needs, staff see their own work, owners and managers see the salon.',
          'Every schema change is a migration file in version control, so the database can be rebuilt from scratch and reviewed in a diff.',
          'Scheduling rules are covered by SQL tests in tests/scheduling_rules.sql.',
        ],
        sr: [
          'Pravila su u bazi, ne u klijentu. I računanje slobodnih termina i kreiranje termina su PostgreSQL funkcije pozvane preko RPC-a, pa izmenjeni frontend ne može da ih zaobiđe.',
          'create_appointment zaključava red i ponovo čita dostupnost unutar iste transakcije pre upisa.',
          'Row Level Security daje tri nivoa: javni pristup vidi samo ono što stranici za zakazivanje treba, zaposleni vide svoj rad, vlasnici i menadžeri ceo salon.',
          'Svaka promena šeme je fajl migracije pod verzionisanjem, pa se baza može ponovo izgraditi od nule i pregledati kroz diff.',
          'Pravila zakazivanja su pokrivena SQL testovima u tests/scheduling_rules.sql.',
        ],
      },
      decisions: {
        en: [
          'Subscription plans are modeled in SQL but enforcement is switched off by a later migration. There is no payment provider connected, and the app does not bill anyone.',
          'The two admin pages grew long and are not split into components yet. That is the first thing I would refactor.',
        ],
        sr: [
          'Pretplatnički planovi su modelovani u SQL-u, ali je provera ograničenja isključena kasnijom migracijom. Nijedan platni provajder nije povezan i aplikacija ne naplaćuje.',
          'Dve admin stranice su narasle i još nisu podeljene na komponente. To bih prvo refaktorisao.',
        ],
      },
      limits: {
        en:
          'This is a working prototype, not a deployed product. It runs locally against a Supabase project; ' +
          'there is no public URL yet and no paying tenant.',
        sr:
          'Ovo je funkcionalan prototip, ne objavljen proizvod. Radi lokalno nad Supabase projektom; ' +
          'javni URL još ne postoji i nema klijenta koji plaća.',
      },
    },
  },

  {
    id: 'chatbot-api',
    rank: 3,
    year: '2026',
    status: 'coursework',
    title: {
      en: 'Knowledge-base chatbot REST API',
      sr: 'REST API chatbot-a nad bazom znanja',
    },
    subtitle: {
      en: 'Laravel service answering student-services questions, built by a team of three',
      sr: 'Laravel servis koji odgovara na pitanja o studentskoj službi, rad tima od troje',
    },
    context: {
      en:
        'Coursework for Server-Side Web Technologies. Team of three working on feature branches with ' +
        'reviewed pull requests. The bullets below cover only my commits.',
      sr:
        'Rad za predmet Serverske veb tehnologije. Tim od troje, rad na feature granama uz pregledane ' +
        'pull request-ove. Stavke ispod pokrivaju samo moje commit-e.',
    },
    highlights: {
      en: [
        'Modeled the database and wrote the migrations for five tables and the relationships between them.',
        'Wrote statistics endpoints for two dashboards, admin and moderator, aggregating usage data from the knowledge base.',
        'Added CSV export of the knowledge base and caching for the most frequently requested responses.',
        'Wrote factories and seeders so the team could work against realistic data.',
      ],
      sr: [
        'Modelovao bazu i napisao migracije za pet tabela, uključujući veze između njih.',
        'Napravio statističke endpointe za admin i moderator panel, sa agregacijom podataka iz baze znanja.',
        'Dodao CSV izvoz baze znanja i keširanje najčešće traženih odgovora.',
        'Napisao factories i seeders da tim radi nad realističnim podacima.',
      ],
    },
    /**
     * No PHPUnit. Laravel installs it into every project whether or not anyone
     * writes a test, and Veljko does not know whether the team wrote any. A
     * dependency in composer.json is not experience with testing.
     */
    tech: ['PHP', 'Laravel 9', 'MySQL', 'Laravel Sanctum', 'REST', 'Postman', 'Git'],
    repoNote: {
      en: 'Private university team repository, available on request',
      sr: 'Privatni timski fakultetski repozitorijum, dostupan na zahtev',
    },
    media: [
      {
        src: '/screenshots/chatbot-erd.svg',
        alt: {
          en: 'Entity relationship diagram of the chatbot knowledge base tables',
          sr: 'Dijagram veza između tabela baze znanja chatbot-a',
        },
        caption: {
          en: 'Keywords link questions to knowledge items; chat messages keep the history per user.',
          sr: 'Ključne reči povezuju pitanja sa stavkama znanja; poruke čuvaju istoriju po korisniku.',
        },
      },
    ],
    caseStudy: {
      problem: {
        en:
          'Students ask the same questions about Moodle, exams, tuition and the timetable. The service ' +
          'scores a question against stored keywords and returns the best matching knowledge item, falling ' +
          'back to an external source when nothing scores high enough.',
        sr:
          'Studenti postavljaju ista pitanja o Moodle-u, ispitima, školarini i rasporedu. Servis boduje pitanje ' +
          'u odnosu na sačuvane ključne reči i vraća najbolju stavku iz baze znanja, a kada ništa nije dovoljno ' +
          'blizu, prelazi na spoljni izvor.',
      },
      approach: {
        en: [
          'The matching is keyword scoring over a tokenized question, not a language model. Below a threshold the request falls through to a Wikipedia lookup.',
          'Roles are enforced by middleware: statistics and export are available to admin and moderator accounts only.',
          'Frequently requested responses are cached, which took repeated category and knowledge-item reads off the database.',
        ],
        sr: [
          'Poklapanje je bodovanje ključnih reči nad tokenizovanim pitanjem, nije jezički model. Ispod praga zahtev prelazi na pretragu Wikipedije.',
          'Uloge se proveravaju kroz middleware: statistika i izvoz dostupni su samo admin i moderator nalozima.',
          'Često traženi odgovori se keširaju, čime su ponovljena čitanja kategorija i stavki znanja skinuta sa baze.',
        ],
      },
      limits: {
        en:
          'Team project. Authentication and the public chatbot endpoints were written by teammates; ' +
          'the data model, statistics, export and caching are mine. No deployment, runs locally.',
        sr:
          'Timski projekat. Autentifikaciju i javne chatbot endpointe su radile kolege; model podataka, ' +
          'statistika, izvoz i keširanje su moji. Nije deployovan, radi lokalno.',
      },
    },
  },

  {
    id: 'client-sites',
    rank: 4,
    year: '2025',
    status: 'delivered',
    title: { en: 'Client websites', sr: 'Klijentski sajtovi' },
    subtitle: {
      en: 'Two sites built from scratch for clients, one of them tuned hard for load time',
      sr: 'Dva kompletno izrađena sajta za klijente, jedan dodatno optimizovan za brzinu učitavanja',
    },
    context: {
      en: 'Freelance web work: two full builds, each from a written change list and a fixed deadline.',
      sr: 'Frilens veb rad: dve kompletne izrade, svaka po pisanoj listi izmena i fiksnom roku.',
    },
    highlights: {
      en: [
        'Built an interactive marketing site from scratch: a scroll-driven video-mask reveal and a service catalog navigated by section, tested down to a 320px screen with reduced-motion and no-JavaScript fallbacks.',
        'Built a second client site from scratch and tuned its load time with responsive WebP images at three widths, an LCP preload hint, and Brotli plus cache headers.',
        'Removed a forced reflow on that site by coalescing a scroll-driven redraw into a single requestAnimationFrame.',
      ],
      sr: [
        'Samostalno izradio interaktivni marketinški sajt: otkrivanje kroz video masku vezano za skrol i katalog usluga po sekcijama, testiran do širine od 320px sa reduced-motion i no-JavaScript fallback-ovima.',
        'Izradio i drugi klijentski sajt u celosti i skratio mu vreme učitavanja kroz responzivne WebP slike na tri širine, preload za LCP i Brotli sa cache header-ima.',
        'Uklonio forced reflow na tom sajtu objedinjavanjem iscrtavanja na skrol u jedan requestAnimationFrame.',
      ],
    },
    tech: ['HTML', 'CSS', 'JavaScript', 'WebP', 'Apache'],
    repos: [
      { label: 'Flekout', url: 'https://github.com/knez4/flekout' },
      { label: 'Mystery M', url: 'https://github.com/knez4/Mystery-M' },
    ],
    media: [
      {
        src: '/screenshots/client-performance.svg',
        alt: {
          en: 'Diagram of the image delivery pipeline and the scroll redraw fix',
          sr: 'Dijagram isporuke slika i ispravke iscrtavanja pri skrolovanju',
        },
        caption: {
          en: 'Three widths, one fallback, and a redraw that runs once per frame instead of once per event.',
          sr: 'Tri širine, jedan fallback, i iscrtavanje koje se izvršava jednom po frejmu umesto po događaju.',
        },
      },
    ],
    caseStudy: {
      problem: {
        en:
          'Two clients, two sites built from nothing. The first was an interactive marketing site. ' +
          'The second had to load fast on a phone, so the image pipeline and the scroll handling were part ' +
          'of the build rather than something bolted on afterwards.',
        sr:
          'Dva klijenta, dva sajta izrađena u celosti. Prvi je bio interaktivni marketinški ' +
          'sajt. Drugi je morao brzo da se učitava na telefonu, pa su isporuka slika i rad sa skrolom bili ' +
          'deo izrade, a ne nešto naknadno dodato.',
      },
      approach: {
        en: [
          'For the new build: a hero section reveals through a video mask tied to scroll position, and a service catalog lets a visitor pick a space and scroll through the matching services in a dark rail.',
          'Checked the new build on desktop, tablet, 390px and 320px, plus reduced-motion and no-JavaScript, so the layout and the reveal both still work without the animation.',
          'On the second build, images were the main cost, so they ship as a responsive WebP srcset at three widths with a PNG fallback, and the hero image carries an LCP preload hint.',
          'A scroll handler on that site was reading layout properties on every event and causing jank; coalesced it into a single requestAnimationFrame callback, and served the site with Brotli compression and cache-control headers via .htaccess.',
        ],
        sr: [
          'Za novu izradu: hero sekcija se otkriva kroz video masku vezanu za poziciju skrola, a katalog usluga omogućava posetiocu da izabere prostor i skroluje kroz odgovarajuće usluge u tamnoj traci.',
          'Proverio novu izradu na desktop, tablet, 390px i 320px ekranima, kao i reduced-motion i no-JavaScript, tako da raspored i otkrivanje sadržaja rade i bez animacije.',
          'Na drugoj izradi slike su bile glavni trošak, pa se isporučuju kao responzivan WebP srcset na tri širine sa PNG fallback-om, a hero slika nosi LCP preload.',
          'Scroll handler na tom sajtu je čitao layout svojstva pri svakom događaju i pravio trzaje; objedinio sam ga u jedan requestAnimationFrame poziv, a sajt se servira uz Brotli kompresiju i cache-control header-e preko .htaccess-a.',
        ],
      },
      limits: {
        en:
          'Both are marketing sites: static pages, with no backend and no data layer behind them. The first ' +
          'build’s services section (services.js) is written but not yet wired into the live page.',
        sr:
          'Oba su marketinški sajtovi: statične stranice, bez backend-a i sloja podataka iza njih. Sekcija ' +
          'usluga prve izrade (services.js) je napisana ali još nije uključena u živu stranicu.',
      },
    },
  },

  {
    id: 'report-automation',
    rank: 5,
    year: '2025–2026',
    status: 'delivered',
    title: { en: 'Client reporting automation', sr: 'Automatizacija klijentskih izveštaja' },
    subtitle: {
      en: 'Turns nine Excel workbooks into nine finished PDF report decks, on the client’s own design',
      sr: 'Pretvara devet Excel svezaka u devet gotovih PDF izveštaja, na klijentovom dizajnu',
    },
    context: {
      en:
        'A separate freelance engagement. Each regional manager’s monthly scores arrive as their own ' +
        'Excel workbook, and the finished report is a seven-page deck that was typeset by hand, one per ' +
        'manager, every month.',
      sr:
        'Zaseban frilens angažman. Mesečne ocene svakog regionalnog menadžera stižu kao zasebna Excel ' +
        'sveska, a gotov izveštaj je deck od sedam strana koji se svakog meseca ručno slagao, jedan po ' +
        'menadžeru.',
    },
    highlights: {
      en: [
        'Built a Python tool that turns nine client workbooks into nine finished PDF decks in three seconds, replacing a step that was done by hand once a month.',
        'Finds each table by its section heading rather than by cell address, because the blocks sit at different rows in every workbook.',
        'Redraws the three data pages of the client’s existing design as PDF, so tables and charts reflow for managers with one branch or with seventeen.',
        'Reports what it finds wrong in the source: workbooks naming the wrong manager, and a month header repeated instead of advanced.',
      ],
      sr: [
        'Napravio sam Python alat koji devet klijentskih svezaka pretvara u devet gotovih PDF izveštaja za tri sekunde, umesto koraka koji se jednom mesečno radio ručno.',
        'Svaku tabelu pronalazi po naslovu sekcije umesto po adresi ćelije, jer blokovi stoje u različitim redovima u svakoj svesci.',
        'Iscrtava tri strane sa podacima na klijentovom postojećem dizajnu, pa se tabele i grafikoni prilagođavaju i menadžeru sa jednim lokalom i onom sa sedamnaest.',
        'Prijavljuje šta u izvoru ne valja: sveske koje nose pogrešno ime menadžera i zaglavlje meseca koje se ponavlja umesto da napreduje.',
      ],
    },
    repoNote: {
      en: 'Private client repository, available on request',
      sr: 'Privatni klijentski repozitorijum, dostupan na zahtev',
    },
    tech: ['Python', 'pandas', 'openpyxl', 'pypdf', 'fontTools', 'Jinja2'],
    media: [
      {
        src: '/screenshots/report-pipeline.svg',
        alt: {
          en: 'Diagram of the Excel-to-report automation pipeline',
          sr: 'Dijagram automatizacije od Excel tabele do izveštaja',
        },
        caption: {
          en: 'One workbook per manager in, one finished seven-page PDF deck out.',
          sr: 'Jedna sveska po menadžeru na ulazu, jedan gotov PDF izveštaj od sedam strana na izlazu.',
        },
      },
    ],
    caseStudy: {
      problem: {
        en:
          'Every regional manager’s monthly scores arrive as a separate Excel workbook, and the report ' +
          'the client expects is a seven-page deck built in Adobe Illustrator. Somebody retyped the ' +
          'numbers into it, once per manager, every month.',
        sr:
          'Mesečne ocene svakog regionalnog menadžera stižu kao zasebna Excel sveska, a izveštaj koji ' +
          'klijent očekuje je deck od sedam strana napravljen u Adobe Illustrator-u. Neko je brojeve ' +
          'prekucavao u njega, jednom po menadžeru, svakog meseca.',
      },
      approach: {
        en: [
          'Parsed the workbooks by searching for the LOKALI and MENADŽERI headings and reading the table under each, because no two workbooks put them in the same rows.',
          'Carried the deck’s photography pages across untouched and redrew only the three pages that hold data, since a manager can have one branch or seventeen and the tables have to reflow.',
          'Took the coordinates for those pages out of the Illustrator file’s own content streams, so a generated page lands where the original did.',
          'Embedded the full typeface rather than reusing the one in the template, whose subset is missing Q, W and X.',
        ],
        sr: [
          'Parsirao sam sveske tražeći naslove LOKALI i MENADŽERI i čitajući tabelu ispod svakog, jer nijedne dve sveske ih ne drže u istim redovima.',
          'Strane sa fotografijama prenose se nepromenjene, a iscrtavaju se samo tri strane sa podacima, jer menadžer može imati jedan lokal ili sedamnaest pa tabele moraju da se prilagode.',
          'Koordinate za te strane sam izvukao iz sadržaja samog Illustrator fajla, pa generisana strana pada na isto mesto gde i originalna.',
          'Ugradio sam pun font umesto onog iz šablona, čiji podskup nema Q, W ni X.',
        ],
      },
      limits: {
        en:
          'It needs the Illustrator deck to draw onto, so a redesign means new coordinates, not just new ' +
          'data. The workbooks carry month names but no year, so the cover is dated with the current one ' +
          'unless it is passed in. And it has only been run against one month’s nine workbooks: the ' +
          'parser survives the mistakes those nine contain, not every mistake a workbook could contain.',
        sr:
          'Potreban mu je Illustrator deck na koji crta, pa redizajn znači nove koordinate, a ne samo nove ' +
          'podatke. Sveske nose imena meseci ali ne i godinu, pa se korica datira tekućom godinom ako se ne ' +
          'prosledi. I pokrenut je samo nad devet svezaka iz jednog meseca: parser preživljava greške koje ' +
          'tih devet sadrži, ne svaku grešku koju sveska može da sadrži.',
      },
    },
  },
];

export const projectsByRank = [...projects].sort((a, b) => a.rank - b.rank);

/**
 * Projects that appear on the one-page CV.
 *
 * client-sites and report-automation are left off the sheet on purpose: the
 * Freelance role in Experience already describes both (the same
 * site-optimization and Python-pipeline bullets), so repeating them here
 * would just be the same claims twice.
 *
 * three-tier-java was removed from the site entirely in September 2026, not
 * merely excluded here. Veljko confirmed the NetBeans project was downloaded
 * coursework, not his own work, so it cannot be presented under his name
 * anywhere. Do not reinstate it.
 */
export const cvProjects = projectsByRank.filter(
  (p) => p.id !== 'client-sites' && p.id !== 'report-automation',
);

export function projectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
