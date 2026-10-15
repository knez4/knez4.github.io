import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { skillGroups } from '../data/skills';
import type { L } from '../data/types';
import { motionOK } from '../lib/motion';
import { playShot } from '../lib/shot';
import { useLang } from '../lib/useLang';
import { Ball } from './Logo';

/**
 * A pretend psql session over the site's own data. Nothing here touches a real
 * database: queries are matched against a small fixed set and answered from
 * src/data, so every row it prints is the same fact the rest of the site states.
 */

type Table = { cols: string[]; rows: (string | ReactNode)[][] };
type Entry =
  | { kind: 'query'; text: string }
  | { kind: 'table'; table: Table }
  | { kind: 'text'; text: string; tone?: 'error' | 'ok' | 'muted' };

const s = (en: string, sr: string): L => ({ en, sr });

const COPY = {
  title: s('psql: veljko@portfolio', 'psql: veljko@portfolio'),
  inputLabel: s('Type an SQL query', 'Ukucaj SQL upit'),
  try: s('Try', 'Probaj'),
  rows: s('rows', 'redova'),
  row: s('row', 'red'),
  help: s(
    'Tables: me, projects, skills, hobbies, contact. Commands: \\dt, \\shoot, clear.',
    'Tabele: me, projects, skills, hobbies, contact. Komande: \\dt, \\shoot, clear.',
  ),
  denied: s(
    'ERROR: permission denied. Row Level Security is on, and so am I.',
    'ERROR: permission denied. Row Level Security je uključen, a i ja sam.',
  ),
  unknown: s('ERROR: relation "{x}" does not exist. Type \\? for help.', 'ERROR: relation "{x}" does not exist. Ukucaj \\? za pomoć.'),
  swish: s('Swish. +2', 'Koš! +2'),
  miss: s('Off the rim. Try again.', 'Obruč... probaj ponovo.'),
  score: s('score {p} ({m}/{a})', 'rezultat {p} ({m}/{a})'),
  shooting: s('Shooting from the terminal…', 'Šutiram iz terminala…'),
};

const SUGGESTIONS = ['SELECT * FROM me;', 'SELECT * FROM projects;', 'SELECT * FROM hobbies;', '\\shoot'];

function useQueries() {
  const { lang, t, pick } = useLang();
  const sr = lang === 'sr';

  return useCallback(
    (raw: string): Entry[] => {
      const q = raw.trim().replace(/;+\s*$/, '').replace(/\s+/g, ' ').toLowerCase();
      const from = q.match(/^select .+ from ([a-z_]+)/)?.[1];

      if (q === '' ) return [];
      if (q === '\\?' || q === 'help' || q === '\\h') return [{ kind: 'text', text: pick(COPY.help), tone: 'muted' }];
      if (/^(drop|delete|truncate|update|insert|alter)\b/.test(q)) return [{ kind: 'text', text: pick(COPY.denied), tone: 'error' }];
      if (q === '\\dt') {
        return [
          {
            kind: 'table',
            table: {
              cols: ['schema', 'name', 'type'],
              rows: ['me', 'projects', 'skills', 'hobbies', 'contact'].map((n) => ['public', n, 'table']),
            },
          },
        ];
      }

      switch (from) {
        case 'me':
        case 'veljko':
          return [
            {
              kind: 'table',
              table: {
                cols: sr ? ['polje', 'vrednost'] : ['field', 'value'],
                rows: [
                  [sr ? 'ime' : 'name', profile.name],
                  [sr ? 'grad' : 'city', pick(profile.location)],
                  [sr ? 'studije' : 'studies', sr ? 'FON, završna godina' : 'FON, final year'],
                  [sr ? 'fokus' : 'focus', sr ? 'web dizajn, automatizacija, baze' : 'web design, automation, databases'],
                  [sr ? 'karakter' : 'temper', sr ? 'pozitivan, društven' : 'positive, sociable'],
                  ['status', pick(profile.status)],
                ],
              },
            },
          ];
        case 'projects':
          return [
            {
              kind: 'table',
              table: {
                cols: sr ? ['godina', 'projekat', 'status'] : ['year', 'project', 'status'],
                rows: [...projects]
                  .sort((a, b) => a.rank - b.rank)
                  .map((p) => [p.year, pick(p.title), t(`status.${p.status}` as const)]),
              },
            },
          ];
        case 'skills':
          return [
            {
              kind: 'table',
              table: {
                cols: sr ? ['oblast', 'alati'] : ['area', 'tools'],
                rows: skillGroups
                  .filter((g) => g.kind === 'applied')
                  .map((g) => [pick(g.label), g.items.slice(0, 4).map((i) => (typeof i === 'string' ? i : pick(i))).join(', ')]),
              },
            },
          ];
        case 'hobbies':
          return [
            {
              kind: 'table',
              table: {
                cols: sr ? ['hobi', 'napomena'] : ['hobby', 'note'],
                rows: [
                  [sr ? 'košarka' : 'basketball', sr ? 'najveća ljubav van koda (probaj \\shoot)' : 'my favourite thing away from code (try \\shoot)'],
                  [sr ? 'druženje' : 'people', sr ? 'volim ljude i rado pomažem' : 'I like people and I like to help'],
                  [sr ? 'učenje' : 'learning', sr ? 'svaki dan nešto novo' : 'something new every day'],
                  [sr ? 'podaci' : 'data', sr ? 'najvredniji resurs koji postoji' : 'the most valuable resource there is'],
                ],
              },
            },
          ];
        case 'contact':
          return [
            {
              kind: 'table',
              table: {
                cols: sr ? ['kanal', 'adresa'] : ['channel', 'address'],
                rows: [
                  ['email', <a key="e" href={`mailto:${profile.email}`} className="text-accent underline-offset-2 hover:underline">{profile.email}</a>],
                  ['linkedin', <a key="l" href={profile.linkedin} target="_blank" rel="noreferrer noopener" className="text-accent underline-offset-2 hover:underline">{profile.linkedinHandle}</a>],
                  ['github', <a key="g" href={profile.github} target="_blank" rel="noreferrer noopener" className="text-accent underline-offset-2 hover:underline">{profile.githubHandle}</a>],
                ],
              },
            },
          ];
      }

      const name = from ?? q.split(' ')[0];
      return [{ kind: 'text', text: pick(COPY.unknown).replace('{x}', name), tone: 'error' }];
    },
    [lang, pick, sr, t],
  );
}

export function SqlTerminal({ autoplay = true, className = '' }: { autoplay?: boolean; className?: string }) {
  const { lang, pick } = useLang();
  const run = useQueries();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const score = useRef({ made: 0, att: 0 });

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight, behavior: 'smooth' });
  }, [entries]);

  const execute = useCallback(
    async (text: string) => {
      const q = text.trim().toLowerCase().replace(/;+$/, '');
      if (q === 'clear' || q === '\\! clear') {
        setEntries([]);
        return;
      }
      setEntries((e) => [...e, { kind: 'query', text }]);
      if (q === '\\shoot' || q === 'shoot') {
        setBusy(true);
        setEntries((e) => [...e, { kind: 'text', text: pick(COPY.shooting), tone: 'muted' }]);
        const made = await playShot(inputRef.current ?? document.body, lang);
        const sc = score.current;
        sc.att += 1;
        if (made) sc.made += 1;
        const tally = pick(COPY.score)
          .replace('{p}', String(sc.made * 2))
          .replace('{m}', String(sc.made))
          .replace('{a}', String(sc.att));
        setEntries((e) => [
          ...e,
          { kind: 'text', text: `${pick(made ? COPY.swish : COPY.miss)} · ${tally}`, tone: made ? 'ok' : 'error' },
        ]);
        setBusy(false);
        return;
      }
      setEntries((e) => [...e, ...run(text)]);
    },
    [lang, pick, run],
  );

  /** Type a query into the prompt one character at a time, then run it. */
  const typeAndRun = useCallback(
    async (text: string) => {
      if (busy) return;
      setBusy(true);
      if (motionOK()) {
        for (let i = 1; i <= text.length; i++) {
          setInput(text.slice(0, i));
          await new Promise((r) => setTimeout(r, 26 + Math.random() * 30));
        }
        await new Promise((r) => setTimeout(r, 180));
      }
      setInput('');
      await execute(text);
      setBusy(false);
    },
    [busy, execute],
  );

  // Open with one query so the box is never empty, and so the first thing it says is who he is.
  useEffect(() => {
    if (!autoplay || started.current) return;
    started.current = true;
    const id = setTimeout(() => void typeAndRun('SELECT * FROM me;'), motionOK() ? 1900 : 0);
    return () => clearTimeout(id);
  }, [autoplay, typeAndRun]);

  // A language switch re-answers the visible queries in the new language.
  const lastLang = useRef(lang);
  useEffect(() => {
    if (lastLang.current === lang) return;
    lastLang.current = lang;
    setEntries((prev) => {
      const next: Entry[] = [];
      for (const e of prev) if (e.kind === 'query') next.push(e, ...(e.text.includes('shoot') ? [] : run(e.text)));
      return next;
    });
  }, [lang, run]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || busy) return;
    const text = input;
    setInput('');
    void execute(text);
  };

  return (
    <div className={'term overflow-hidden rounded-2xl ' + className}>
      <div className="flex items-center gap-2 border-b border-fg/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11px] text-subtle">{pick(COPY.title)}</span>
        <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-accent">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> live
        </span>
      </div>

      <div
        ref={outRef}
        className="term-scroll h-[260px] overflow-y-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed sm:h-[300px] lg:h-[185px] xl:h-[250px]"
        aria-live="polite"
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
        data-lenis-prevent
      >
        <p className="text-subtle">
          {lang === 'sr' ? 'Dobrodošao. Ukucaj \\? za pomoć.' : 'Welcome. Type \\? for help.'}
        </p>
        {entries.map((e, i) => (
          <TermEntry key={i} entry={e} rowsWord={[pick(COPY.row), pick(COPY.rows)]} />
        ))}

        <form onSubmit={submit} className="mt-1 flex items-center gap-2">
          <label htmlFor="sql-input" className="shrink-0 text-accent">
            veljko=#
          </label>
          <span className="sr-only">{pick(COPY.inputLabel)}</span>
          <div className="relative min-w-0 flex-1">
            <input
              id="sql-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              readOnly={busy}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label={pick(COPY.inputLabel)}
              className="peer w-full bg-transparent text-[16px] text-fg caret-transparent outline-none sm:text-[12.5px]"
            />
            <span
              className="pointer-events-none absolute left-0 top-0 whitespace-pre text-[16px] text-transparent sm:text-[12.5px]"
              aria-hidden="true"
            >
              {input}
              <span className="term-caret" />
            </span>
          </div>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-fg/10 px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-subtle">{pick(COPY.try)}</span>
        {SUGGESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            disabled={busy}
            onClick={() => void typeAndRun(q)}
            className="inline-flex items-center gap-1.5 rounded-full border border-fg/12 bg-fg/[0.03] px-2.5 py-1 font-mono text-[11px]
                       text-muted transition-colors hover:border-accent hover:text-fg disabled:opacity-50"
          >
            {q === '\\shoot' ? <Ball className="h-3.5 w-3.5" /> : null}
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function TermEntry({ entry, rowsWord }: { entry: Entry; rowsWord: [string, string] }) {
  if (entry.kind === 'query') {
    return (
      <p className="mt-3 break-words">
        <span className="text-accent">veljko=# </span>
        <span className="text-fg">{entry.text}</span>
      </p>
    );
  }
  if (entry.kind === 'text') {
    const tone =
      entry.tone === 'error' ? 'text-[#ff8a8a]' : entry.tone === 'ok' ? 'text-[#7ee2a8]' : 'text-subtle';
    return <p className={'mt-1 ' + tone}>{entry.text}</p>;
  }
  const { cols, rows } = entry.table;
  return (
    <div className="mt-1 overflow-x-auto" data-lenis-prevent>
      <table className="min-w-full border-collapse text-left">
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c} className="whitespace-nowrap border-b border-fg/15 py-1 pr-6 font-medium text-accent">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j} className={'py-0.5 pr-6 align-top ' + (j === 0 ? 'whitespace-nowrap text-muted' : 'text-fg')}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-1 text-subtle">
        ({rows.length} {rows.length === 1 ? rowsWord[0] : rowsWord[1]})
      </p>
    </div>
  );
}
