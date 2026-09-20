import type { L } from './types';

/**
 * A trimmed, readable version of the booking platform's data model.
 * This drives the interactive diagram on the home page, which is the one thing
 * on this site that shows the actual skill being claimed rather than describing it.
 *
 * Column lists are shortened for legibility: the real schema carries audit
 * columns and a few settings fields that add nothing to the picture.
 */

export type Column = {
  name: string;
  type: string;
  pk?: boolean;
  fk?: string;
  note?: L;
};

export type Table = {
  id: string;
  name: string;
  /** Grid position, in columns/rows of the diagram layout. */
  col: number;
  row: number;
  group: 'tenant' | 'catalog' | 'schedule' | 'booking';
  purpose: L;
  columns: Column[];
  /** Row Level Security summary, in plain language. */
  rls?: L;
};

export const tables: Table[] = [
  {
    id: 'salons',
    name: 'salons',
    col: 0,
    row: 0,
    group: 'tenant',
    purpose: {
      en: 'The tenant. Every other row in the system belongs to exactly one salon.',
      sr: 'Nosilac zakupa. Svaki drugi red u sistemu pripada tačno jednom salonu.',
    },
    columns: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'slug', type: 'text', note: { en: 'public booking URL', sr: 'javni URL za zakazivanje' } },
      { name: 'name', type: 'text' },
      { name: 'booking_enabled', type: 'boolean' },
    ],
    rls: {
      en: 'Readable by anyone for the public booking page; writable only by the owner.',
      sr: 'Čitljiv svima zbog javne stranice za zakazivanje; upis samo vlasniku.',
    },
  },
  {
    id: 'profiles',
    name: 'profiles',
    col: 0,
    row: 1,
    group: 'tenant',
    purpose: {
      en: 'Links an authenticated user to a salon and a role: owner, manager or staff.',
      sr: 'Povezuje prijavljenog korisnika sa salonom i ulogom: vlasnik, menadžer ili zaposleni.',
    },
    columns: [
      { name: 'id', type: 'uuid', pk: true, fk: 'auth.users' },
      { name: 'salon_id', type: 'uuid', fk: 'salons' },
      { name: 'role', type: 'text', note: { en: 'owner | manager | staff', sr: 'owner | manager | staff' } },
    ],
    rls: {
      en: 'A user can read only their own profile row.',
      sr: 'Korisnik može da pročita samo svoj red.',
    },
  },
  {
    id: 'salon_invites',
    name: 'salon_invites',
    col: 0,
    row: 2,
    group: 'tenant',
    purpose: {
      en: 'Pending invitations. An owner invites a manager or a staff member by email before they have an account.',
      sr: 'Poslate pozivnice. Vlasnik poziva menadžera ili zaposlenog mejlom pre nego što imaju nalog.',
    },
    columns: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'salon_id', type: 'uuid', fk: 'salons' },
      { name: 'email', type: 'text' },
      { name: 'role', type: 'text' },
      { name: 'accepted_at', type: 'timestamptz' },
    ],
    rls: {
      en: 'Only the salon owner can create or revoke an invite.',
      sr: 'Samo vlasnik salona može da napravi ili povuče pozivnicu.',
    },
  },
  {
    id: 'services',
    name: 'services',
    col: 1,
    row: 0,
    group: 'catalog',
    purpose: {
      en: 'What the salon offers, and how long each appointment takes.',
      sr: 'Šta salon nudi i koliko svaki termin traje.',
    },
    columns: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'salon_id', type: 'uuid', fk: 'salons' },
      { name: 'name', type: 'text' },
      { name: 'duration_min', type: 'integer', note: { en: 'drives slot width', sr: 'određuje širinu termina' } },
      { name: 'price', type: 'numeric' },
      { name: 'active', type: 'boolean' },
    ],
  },
  {
    id: 'staff',
    name: 'staff',
    col: 1,
    row: 1,
    group: 'catalog',
    purpose: {
      en: 'People who perform services. A staff row may or may not have a login.',
      sr: 'Osobe koje rade usluge. Zaposleni ne mora obavezno da ima nalog.',
    },
    columns: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'salon_id', type: 'uuid', fk: 'salons' },
      { name: 'profile_id', type: 'uuid', fk: 'profiles' },
      { name: 'name', type: 'text' },
      { name: 'active', type: 'boolean' },
    ],
    rls: {
      en: 'Staff accounts see their own row; managers and owners see the whole salon.',
      sr: 'Zaposleni vide svoj red; menadžeri i vlasnici ceo salon.',
    },
  },
  {
    id: 'staff_services',
    name: 'staff_services',
    col: 1,
    row: 2,
    group: 'catalog',
    purpose: {
      en: 'Join table: which staff member can perform which service.',
      sr: 'Vezna tabela: koji zaposleni radi koju uslugu.',
    },
    columns: [
      { name: 'staff_id', type: 'uuid', pk: true, fk: 'staff' },
      { name: 'service_id', type: 'uuid', pk: true, fk: 'services' },
    ],
  },
  {
    id: 'working_hours',
    name: 'working_hours',
    col: 2,
    row: 0,
    group: 'schedule',
    purpose: {
      en: 'Opening hours per weekday, set for the salon and optionally overridden per staff member.',
      sr: 'Radno vreme po danu u nedelji, za salon i po potrebi posebno po zaposlenom.',
    },
    columns: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'salon_id', type: 'uuid', fk: 'salons' },
      { name: 'staff_id', type: 'uuid', fk: 'staff' },
      { name: 'weekday', type: 'smallint' },
      { name: 'opens_at', type: 'time' },
      { name: 'closes_at', type: 'time' },
    ],
  },
  {
    id: 'time_off',
    name: 'time_off',
    col: 2,
    row: 1,
    group: 'schedule',
    purpose: {
      en: 'Holidays and absences that punch holes in the working hours.',
      sr: 'Odsustva i slobodni dani koji prave rupe u radnom vremenu.',
    },
    columns: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'staff_id', type: 'uuid', fk: 'staff' },
      { name: 'starts_at', type: 'timestamptz' },
      { name: 'ends_at', type: 'timestamptz' },
    ],
  },
  {
    id: 'clients',
    name: 'clients',
    col: 3,
    row: 1,
    group: 'booking',
    purpose: {
      en: 'Who booked. Also the basis for the repeat-visit and revenue view.',
      sr: 'Ko je zakazao. Ujedno osnova za pregled ponovljenih poseta i prihoda.',
    },
    columns: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'salon_id', type: 'uuid', fk: 'salons' },
      { name: 'name', type: 'text' },
      { name: 'phone', type: 'text' },
      { name: 'email', type: 'text' },
    ],
    rls: {
      en: 'Never exposed publicly. Only salon accounts can read client rows.',
      sr: 'Nikada nije javno dostupna. Redove klijenata čitaju samo nalozi salona.',
    },
  },
  {
    id: 'appointments',
    name: 'appointments',
    col: 3,
    row: 0,
    group: 'booking',
    purpose: {
      en: 'The booking itself. Written only through create_appointment, never by a direct insert from the client.',
      sr: 'Sam termin. Upisuje se isključivo kroz create_appointment, nikada direktnim insert-om sa klijenta.',
    },
    columns: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'salon_id', type: 'uuid', fk: 'salons' },
      { name: 'staff_id', type: 'uuid', fk: 'staff' },
      { name: 'service_id', type: 'uuid', fk: 'services' },
      { name: 'client_id', type: 'uuid', fk: 'clients' },
      { name: 'starts_at', type: 'timestamptz' },
      { name: 'ends_at', type: 'timestamptz' },
      { name: 'status', type: 'text' },
    ],
    rls: {
      en: 'Staff read only appointments assigned to them. Managers and owners read the salon.',
      sr: 'Zaposleni čitaju samo svoje termine. Menadžeri i vlasnici čitaju ceo salon.',
    },
  },
  {
    id: 'notification_outbox',
    name: 'notification_outbox',
    col: 3,
    row: 2,
    group: 'booking',
    purpose: {
      en: 'Queue of emails to send. An edge function drains it in batches so a failing address cannot block the rest.',
      sr: 'Red mejlova za slanje. Edge funkcija ga prazni u grupama, pa neispravna adresa ne blokira ostale.',
    },
    columns: [
      { name: 'id', type: 'uuid', pk: true },
      { name: 'appointment_id', type: 'uuid', fk: 'appointments' },
      { name: 'channel', type: 'text' },
      { name: 'attempts', type: 'integer' },
      { name: 'sent_at', type: 'timestamptz' },
    ],
  },
];

export type Relation = { from: string; to: string; label?: string };

export const relations: Relation[] = [
  { from: 'profiles', to: 'salons' },
  { from: 'salon_invites', to: 'salons' },
  { from: 'services', to: 'salons' },
  { from: 'staff', to: 'salons' },
  { from: 'staff', to: 'profiles' },
  { from: 'staff_services', to: 'staff' },
  { from: 'staff_services', to: 'services' },
  { from: 'working_hours', to: 'salons' },
  { from: 'working_hours', to: 'staff' },
  { from: 'time_off', to: 'staff' },
  { from: 'clients', to: 'salons' },
  { from: 'appointments', to: 'salons' },
  { from: 'appointments', to: 'staff' },
  { from: 'appointments', to: 'services' },
  { from: 'appointments', to: 'clients' },
  { from: 'notification_outbox', to: 'appointments' },
];

/** The function that does the work worth talking about. Shown next to the diagram. */
export const bookingFunction = {
  name: 'create_appointment',
  summary: {
    en:
      'Called over RPC. It is the only path that writes an appointment, so the rules hold even if ' +
      'someone calls the API directly.',
    sr:
      'Poziva se preko RPC-a. To je jedini put kojim se termin upisuje, pa pravila važe i kada neko ' +
      'pozove API direktno.',
  } as L,
  steps: {
    en: [
      'Resolve the salon from the public slug and check that online booking is enabled.',
      'Take a row lock so two concurrent requests serialize instead of racing.',
      'Recompute availability inside the transaction: working hours, minus time off, minus existing appointments.',
      'Reject the request if the slot moved while the client was filling the form.',
      'Insert the appointment and queue a confirmation row in the outbox.',
    ],
    sr: [
      'Odredi salon na osnovu javnog slug-a i proveri da je online zakazivanje uključeno.',
      'Zaključaj red da se dva istovremena zahteva serijalizuju umesto da se trkaju.',
      'Ponovo izračunaj dostupnost unutar transakcije: radno vreme, minus odsustva, minus postojeći termini.',
      'Odbij zahtev ako je termin u međuvremenu zauzet dok je klijent popunjavao formu.',
      'Upiši termin i stavi red za potvrdu u outbox.',
    ],
  },
};
