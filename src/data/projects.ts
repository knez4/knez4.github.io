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
        'Built a full-stack appointment booking web app covering four areas end to end: public booking page, staff scheduling, client management and an admin dashboard.',
        'Designed a multi-tenant PostgreSQL database and wrote the booking logic so two people can never book the same time slot.',
        'Added role-based access for owners, managers and staff, so everyone sees only what their role needs.',
        'Automated email confirmations for new appointments through a background job queue.',
      ],
      sr: [
        'Napravio kompletnu veb aplikaciju za zakazivanje termina u četiri oblasti: javna stranica za zakazivanje, raspored zaposlenih, upravljanje klijentima i admin panel.',
        'Projektovao multi-tenant PostgreSQL bazu i napisao logiku zakazivanja tako da dvoje ljudi nikad ne mogu da zauzmu isti termin.',
        'Dodao pristup po ulogama za vlasnike, menadžere i zaposlene, tako da svako vidi samo ono što mu je potrebno.',
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
          'Subscription plans are modelled in SQL but enforcement is switched off by a later migration. There is no payment provider connected, and the app does not bill anyone.',
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
    id: 'three-tier-java',
    rank: 2,
    year: '2025',
    status: 'coursework',
    title: {
      en: 'Three-tier business application',
      sr: 'Poslovna aplikacija u troslojnoj arhitekturi',
    },
    subtitle: {
      en: 'Java desktop client over JDBC, built to a layered specification',
      sr: 'Java desktop klijent nad JDBC-om, po zadatoj slojevitoj specifikaciji',
    },
    context: {
      en: 'Coursework for Software Design at FON, extended past the required scope.',
      sr: 'Rad za predmet Projektovanje softvera na FON-u, proširen preko zadatog obima.',
    },
    highlights: {
      en: [
        'Separated domain, controller, database broker and forms so that no SQL reaches the user interface.',
        'Implemented login against the database, CRUD over the Person entity, and a custom JTable model.',
        'Translated JDBC exceptions into messages a user can act on instead of stack traces.',
      ],
      sr: [
        'Razdvojio domen, kontroler, database broker i forme tako da SQL ne dolazi do korisničkog interfejsa.',
        'Implementirao prijavu nad bazom, CRUD nad entitetom Person i sopstveni JTable model.',
        'JDBC izuzetke preveo u poruke sa kojima korisnik može nešto da uradi umesto u stack trace.',
      ],
    },
    tech: ['Java', 'Swing', 'JDBC', 'MySQL', 'NetBeans', 'UML', 'OCL'],
    repoUrl: 'https://github.com/knez4/three-tier-java',
    media: [
      {
        src: '/screenshots/three-tier-layers.svg',
        alt: {
          en: 'Diagram of the four application layers and the direction of calls between them',
          sr: 'Dijagram četiri sloja aplikacije i smera poziva između njih',
        },
        caption: {
          en: 'Calls travel one way only: forms ask the controller, the controller asks the broker.',
          sr: 'Pozivi idu samo u jednom smeru: forme traže od kontrolera, kontroler od brokera.',
        },
      },
    ],
    caseStudy: {
      problem: {
        en:
          'The assignment gives a skeleton and a set of use-case specification templates. The point is not to ' +
          'make the window work, it is to keep database access out of the user interface so that either side ' +
          'can change without touching the other.',
        sr:
          'Zadatak daje skelet i šablone za specifikaciju slučajeva korišćenja. Poenta nije da prozor radi, nego ' +
          'da pristup bazi ostane van korisničkog interfejsa, tako da se svaka strana može menjati bez diranja druge.',
      },
      approach: {
        en: [
          'Domain classes hold no persistence logic; they are plain objects the broker maps to and from rows.',
          'DatabaseBroker owns every statement and the connection itself. The controller coordinates operations and never builds SQL.',
          'Forms talk only to the controller. Swapping MySQL for another database would touch one class.',
          'A custom table model keeps display formatting out of the domain objects.',
        ],
        sr: [
          'Domenske klase nemaju logiku perzistencije; to su obični objekti koje broker mapira iz i u redove.',
          'DatabaseBroker drži sve upite i samu konekciju. Kontroler koordinira operacije i nikada ne sastavlja SQL.',
          'Forme razgovaraju samo sa kontrolerom. Zamena MySQL-a drugom bazom dotakla bi jednu klasu.',
          'Sopstveni table model drži formatiranje prikaza van domenskih objekata.',
        ],
      },
      limits: {
        en: 'A desktop coursework application, single user, no concurrency handling beyond what JDBC provides.',
        sr: 'Desktop rad sa fakulteta, jedan korisnik, bez obrade konkurentnosti izvan onoga što JDBC daje.',
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
        'Modelled the database and wrote the migrations across five tables, including the relationships between them.',
        'Built statistics endpoints for two dashboards, admin and moderator, aggregating usage data from the knowledge base.',
        'Added CSV export of the knowledge base and caching for the most frequently requested responses.',
        'Wrote factories and seeders so the team could work against realistic data.',
      ],
      sr: [
        'Modelovao bazu i napisao migracije za pet tabela, uključujući veze između njih.',
        'Napravio statističke endpointe za dva panela, admin i moderator, sa agregiranim podacima iz baze znanja.',
        'Dodao CSV izvoz baze znanja i keširanje najčešće traženih odgovora.',
        'Napisao factories i seeders da tim radi nad realističnim podacima.',
      ],
    },
    tech: ['PHP', 'Laravel 9', 'MySQL', 'Laravel Sanctum', 'REST', 'PHPUnit', 'Postman', 'Git'],
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
    id: 'client-web',
    rank: 4,
    year: '2025–2026',
    status: 'delivered',
    title: { en: 'Client websites and reporting tooling', sr: 'Klijentski sajtovi i alat za izveštaje' },
    subtitle: {
      en: 'Delivered work for paying clients, including a load-time rebuild and a Python report generator',
      sr: 'Isporučen rad za klijente koji plaćaju, uključujući ubrzanje sajta i Python generator izveštaja',
    },
    context: {
      en: 'Freelance work taken from written change lists, with fixed monthly deadlines.',
      sr: 'Frilens rad po pisanim listama izmena, sa fiksnim mesečnim rokovima.',
    },
    highlights: {
      en: [
        'Cut load time on a client site with responsive WebP srcset at three widths, an LCP preload hint, and Brotli plus cache headers.',
        'Removed a forced reflow by coalescing a scroll-driven redraw into a single requestAnimationFrame.',
        'Wrote a Python tool with pandas and openpyxl that turns client Excel scorecards into per-manager HTML and JSON reports.',
      ],
      sr: [
        'Skratio vreme učitavanja klijentskog sajta kroz responsive WebP srcset na tri širine, preload za LCP i Brotli sa cache header-ima.',
        'Uklonio forced reflow objedinjavanjem iscrtavanja na skrol u jedan requestAnimationFrame.',
        'Napisao Python alat sa pandas i openpyxl koji klijentove Excel tabele pretvara u HTML i JSON izveštaje po menadžeru.',
      ],
    },
    tech: ['HTML', 'CSS', 'JavaScript', 'WebP', 'Apache', 'Python', 'pandas', 'openpyxl', 'Jinja2'],
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
          'Two separate client asks, both worked from a written change list with a fixed monthly deadline: a ' +
          'marketing site was slow to load on mobile, and a client’s monthly data arrived as one raw Excel ' +
          'workbook that someone then copied by hand into a separate report for each manager.',
        sr:
          'Dva odvojena klijentska zahteva, oba rađena po pisanoj listi izmena sa fiksnim mesečnim rokom: ' +
          'marketinški sajt se sporo učitavao na mobilnom, a klijentovi mesečni podaci su stizali kao jedna ' +
          'sirova Excel radna sveska koju je neko ručno prepisivao u poseban izveštaj za svakog menadžera.',
      },
      approach: {
        en: [
          'Profiled the site and found oversized images were the main cost; added a responsive WebP srcset at three widths with a PNG fallback, plus an LCP preload hint on the hero image.',
          'Traced a layout jank to a scroll handler reading layout properties on every event; coalesced it into a single requestAnimationFrame callback so it reads and writes at most once per frame.',
          'Added Brotli compression and cache-control headers via .htaccess so a repeat visit skips the download.',
          'Wrote a Python script (pandas, openpyxl) that reads the monthly workbook, splits it by manager, and renders each one as an HTML report from a Jinja2 template plus a machine-readable JSON copy.',
        ],
        sr: [
          'Profilisao sajt i utvrdio da su prevelike slike glavni trošak; dodao responsive WebP srcset na tri širine sa PNG fallback-om, i LCP preload za hero sliku.',
          'Pratio uzrok trzaja do scroll handler-a koji je čitao layout svojstva pri svakom događaju; objedinio ga u jedan requestAnimationFrame poziv koji čita i piše najviše jednom po frejmu.',
          'Dodao Brotli kompresiju i cache-control header-e preko .htaccess-a, tako da ponovna poseta preskače preuzimanje.',
          'Napisao Python skriptu (pandas, openpyxl) koja čita mesečnu radnu svesku, deli je po menadžeru, i za svakog generiše HTML izveštaj iz Jinja2 template-a plus mašinski čitljivu JSON kopiju.',
        ],
      },
      limits: {
        en:
          'The site work was scoped to the client’s change list, not a full rebuild, so the freedom to ' +
          'restructure anything beyond that list was limited. The reporting script assumes the source workbook ' +
          'keeps the same layout every month; a structural change there would need a script update, not just new data.',
        sr:
          'Rad na sajtu bio je ograničen na klijentovu listu izmena, ne kompletnu izradu, pa je sloboda za ' +
          'restruktuiranje van te liste bila ograničena. Skripta za izveštaje pretpostavlja da izvorna radna ' +
          'sveska svaki mesec zadržava isti raspored; strukturna izmena bi tražila izmenu skripte, ne samo nove podatke.',
      },
    },
  },
];

export const projectsByRank = [...projects].sort((a, b) => a.rank - b.rank);

/**
 * Projects that appear on the one-page CV. The site shows all four.
 * Two are left off the sheet on purpose:
 *  - client-web: the Freelance role in Experience already describes that work
 *    (the same site-optimization and Python-pipeline bullets), so repeating it
 *    here would just be the same claim twice.
 *  - three-tier-java: a short, self-contained coursework exercise rather than
 *    a built product. The freed space goes to a fourth booking-platform bullet
 *    instead.
 */
export const cvProjects = projectsByRank.filter((p) => p.id !== 'client-web' && p.id !== 'three-tier-java');

export function projectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
