import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { projectsByRank } from '../data/projects';
import type { Project } from '../data/types';
import { gsap, motionOK } from '../lib/motion';
import { useLang } from '../lib/useLang';
import { ArrowRight, Download, GitHub, Mail } from './icons';
import { Projects, statusKey } from './Projects';
import { Reveal, useInView } from './Reveal';
import { SchemaDiagram } from './SchemaDiagram';
import { Education, Experience, mailto, SitesVisual, Skills } from './Sections';

/*
 * The plain-language home page, written for visitors outside IT (20 October 2026).
 * Clients first, one action ("Javi se"), and every technical piece moved into the
 * collapsed TechDetails at the end, on the same page, for whoever wants it.
 */

/** The one action on the page. Every "Javi se" opens the same prefilled email. */
export function TalkButton({ className = '' }: { className?: string }) {
  const { t } = useLang();
  return (
    <a href={mailto(t('freelance.mailSubject'), t('freelance.mailBody'))} className={'btn-pill btn-pill--solid ' + className} data-magnetic>
      <Mail />
      {t('cta.talk')}
    </a>
  );
}

/* ------------------------------------------------------------------ services */

/**
 * The signature move: drag the divider and six hours of manual work become three
 * seconds. It nudges itself once when it scrolls into view so it reads as
 * draggable; a real range input underneath keeps it usable by keyboard and touch.
 */
/**
 * What fills the half of each layer that the divider usually hides, so dragging all
 * the way shows a picture of the work instead of an empty panel. Illustrations with
 * made-up numbers: the real reports are confidential.
 */
function SpreadsheetMess() {
  const cols = ['A', 'B', 'C', 'D', 'E'];
  const rows = [
    ['Lokal', 'Jan', 'Feb', 'Mar', 'Σ'],
    ['Centar', '84', '79', '91', '254'],
    ['Novi Bgd', '72', '88', '?', '160'],
    ['Zemun', '95', '93', '90', '278'],
    ['Vračar', '61', '70', '68', '199'],
    ['Čukarica', '88', '#REF!', '85', '173'],
    ['Zvezdara', '77', '81', '79', '237'],
  ];
  return (
    <div className="absolute bottom-[6cqw] left-[53%] right-[5cqw] top-[6cqw] rotate-[2deg] overflow-hidden rounded-[1.2cqw] border border-white/10 bg-[#1c1a22] text-[clamp(7px,1.8cqw,11px)] text-[#c9c6d4] shadow-[0_2cqw_5cqw_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-[1cqw] border-b border-white/10 bg-[#1f6b3a] px-[1.5cqw] py-[0.8cqw] text-white/90">
        <span className="font-semibold">X</span>
        <span className="truncate">tabela_mart.xlsx</span>
      </div>
      <div className="grid grid-cols-[1.6fr_repeat(4,1fr)]">
        {cols.map((c) => (
          <span key={c} className="border-b border-r border-white/10 bg-white/[0.04] py-[0.4cqw] text-center text-white/40">
            {c}
          </span>
        ))}
        {rows.flatMap((r, i) =>
          r.map((cell, j) => (
            <span
              key={`${i}-${j}`}
              className={
                'truncate border-b border-r border-white/10 px-[0.8cqw] py-[0.55cqw] ' +
                (i === 0 ? 'font-semibold text-white/80 ' : '') +
                (cell === '#REF!' || cell === '?' ? 'bg-[#ff8a8a]/20 text-[#ff8a8a] ' : '') +
                (i === 3 && j === 2 ? 'bg-[#f5d76e]/25 outline outline-1 outline-[#f5d76e] ' : '') +
                (j > 0 ? 'text-right' : '')
              }
            >
              {cell}
            </span>
          )),
        )}
      </div>
    </div>
  );
}

function ReportStack() {
  const page = (rot: string, extra = '') => (
    <div
      className={
        'absolute left-0 top-0 aspect-[1/1.414] w-[62%] overflow-hidden rounded-[0.8cqw] bg-white p-[1.6cqw] shadow-[0_2cqw_4cqw_rgba(0,0,0,0.45)] ' +
        rot +
        ' ' +
        extra
      }
    >
      <div className="h-[1.2cqw] w-[45%] rounded-sm bg-[#7c4dff]" />
      <div className="mt-[1cqw] h-[0.7cqw] w-[70%] rounded-sm bg-[#d9d6e3]" />
      <div className="mt-[0.6cqw] h-[0.7cqw] w-[55%] rounded-sm bg-[#d9d6e3]" />
      <div className="mt-[2cqw] flex h-[34%] items-end gap-[1cqw]">
        {[62, 85, 48, 92, 74].map((h, i) => (
          <span key={i} className="flex-1 rounded-t-sm bg-[#7c4dff]" style={{ height: `${h}%`, opacity: 0.45 + i * 0.1 }} />
        ))}
      </div>
      <div className="mt-[2cqw] space-y-[0.7cqw]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-[1cqw]">
            <span className="h-[0.7cqw] flex-1 rounded-sm bg-[#e6e3ee]" />
            <span className="h-[0.7cqw] w-[20%] rounded-sm bg-[#cfc9e0]" />
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div className="absolute bottom-[6cqw] left-[6cqw] right-[53%] top-[8cqw]">
      {page('translate-x-[6%] translate-y-[8%] rotate-[-9deg]', 'opacity-70')}
      {page('translate-x-[22%] translate-y-[4%] rotate-[-3deg]', 'opacity-85')}
      {page('translate-x-[40%] rotate-[4deg]')}
      <span className="absolute bottom-[2%] left-[4%] rounded-full bg-[#7ee2a8] px-[1.4cqw] py-[0.4cqw] text-[clamp(8px,1.8cqw,12px)] font-semibold text-[#0d2a19]">
        9 × PDF
      </span>
    </div>
  );
}

function BeforeAfter() {
  const { t } = useLang();
  const [pos, setPos] = useState(50);
  const [ref, shown] = useInView<HTMLDivElement>();
  const nudged = useRef(false);

  useEffect(() => {
    if (!shown || nudged.current || !motionOK()) return;
    nudged.current = true;
    // Sweep right then settle in the middle, so it reads as something you can drag.
    const v = { p: 50 };
    gsap.timeline({ delay: 0.4 })
      .to(v, { p: 80, duration: 0.9, ease: 'power3.inOut', onUpdate: () => setPos(v.p) })
      .to(v, { p: 22, duration: 1.1, ease: 'power3.inOut', onUpdate: () => setPos(v.p) })
      .to(v, { p: 50, duration: 0.8, ease: 'power3.out', onUpdate: () => setPos(v.p) });
  }, [shown]);

  // sized off the slider's own width (container units), so it reads the same on any screen
  // Both lists mirror each other: every row is two lines tall whatever its text, and the
  // cross and the tick are the same drawn icon size, one on the outer left, one on the outer right.
  const row = 'flex min-h-[2.75em] items-start gap-[1.4cqw] text-[clamp(11px,3cqw,15px)] leading-snug';
  const icon = 'mt-[0.15em] h-[1.05em] w-[1.05em] shrink-0';
  return (
    <figure>
      <div ref={ref} className="relative aspect-[4/3] select-none overflow-hidden rounded-2xl border border-fg/10 [container-type:inline-size] sm:aspect-[16/10]">
        {/* After: the whole card. Mirrors the "before" half exactly: same padding, same rows. */}
        <div className="absolute inset-0 grid grid-rows-[auto_auto_1fr] justify-items-end bg-[#291b52] p-[6cqw] text-right">
          <ReportStack />
          <p className="text-[clamp(11px,2.6cqw,14px)] text-accent">{t('ba.after')}</p>
          <p className="font-display mt-[3cqw] whitespace-nowrap text-[15cqw] leading-none text-fg">3 s</p>
          <ul className="mt-[4cqw] w-[44%] space-y-[1.2cqw] self-start text-fg/85">
            {['ba.a1', 'ba.a2', 'ba.a3'].map((k) => (
              <li key={k} className={row + ' justify-end'}>
                {t(k as 'ba.a1')}
                <svg viewBox="0 0 16 16" className={icon + ' text-[#7ee2a8]'} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 8.5l3.2 3.2L13 4.8" />
                </svg>
              </li>
            ))}
          </ul>
        </div>
        {/* Before: clipped to the left of the divider */}
        <div
          className="absolute inset-0 grid grid-rows-[auto_auto_1fr] justify-items-start bg-[#14101f] p-[6cqw]"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden="true"
        >
          <SpreadsheetMess />
          <p className="text-[clamp(11px,2.6cqw,14px)] text-subtle">{t('ba.before')}</p>
          <p className="font-display mt-[3cqw] whitespace-nowrap text-[15cqw] leading-none text-fg/40">~6 h</p>
          <ul className="mt-[4cqw] w-[44%] space-y-[1.2cqw] self-start text-muted">
            {['ba.b1', 'ba.b2', 'ba.b3'].map((k) => (
              <li key={k} className={row}>
                <svg viewBox="0 0 16 16" className={icon + ' text-[#ff8a8a]'} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
                {t(k as 'ba.b1')}
              </li>
            ))}
          </ul>
        </div>
        {/* Divider and handle */}
        <div className="pointer-events-none absolute inset-y-0 w-px bg-white/80" style={{ left: `${pos}%` }} aria-hidden="true">
          <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#12091f] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <span className="text-[13px] font-semibold">⟷</span>
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={t('ba.label')}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4 text-[13px] text-subtle">
        <span>{t('ba.caption')}</span>
        <span className="shrink-0 whitespace-nowrap text-accent">← {t('ba.drag')} →</span>
      </figcaption>
    </figure>
  );
}

/** A week of slots, two already taken: the idea of booking without double-booking. Illustration. */
function AppsVisual() {
  const { t, lang } = useLang();
  const days = lang === 'sr' ? ['Pon', 'Uto', 'Sre', 'Čet', 'Pet'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const times = ['09:00', '10:30', '12:00', '14:30'];
  const taken = new Set(['1-1', '3-2', '0-3']);
  return (
    <figure>
      <div className="rounded-2xl border border-fg/10 bg-[#0f0c18] p-5 sm:p-7">
        <div className="grid grid-cols-5 gap-2">
          {days.map((d) => (
            <span key={d} className="text-center text-[13px] text-subtle">
              {d}
            </span>
          ))}
          {times.map((tm, r) =>
            days.map((_, c) => {
              const busy = taken.has(`${c}-${r}`);
              const picked = c === 2 && r === 1;
              return (
                <span
                  key={`${c}-${r}`}
                  className={
                    'rounded-lg border py-2.5 text-center text-[13px] sm:text-[14px] ' +
                    (picked
                      ? 'border-accent bg-accent-strong text-white'
                      : busy
                        ? 'border-fg/5 bg-fg/[0.03] text-subtle line-through'
                        : 'border-fg/10 text-fg/80')
                  }
                >
                  {tm}
                </span>
              );
            }),
          )}
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] text-subtle">{t('services.illustration')}</figcaption>
    </figure>
  );
}

/** Three services as alternating scenes: visual on one side, plain words on the other. */
export function Services() {
  const { t } = useLang();
  // Each service points at the project that proves it.
  const rows: { title: string; body: string; visual: ReactNode; to: string }[] = [
    { title: t('services.sites'), body: t('services.sitesBody'), visual: <SitesVisual />, to: 'client-sites' },
    { title: t('services.auto'), body: t('services.autoBody'), visual: <BeforeAfter />, to: 'report-automation' },
    { title: t('services.apps'), body: t('services.appsBody'), visual: <AppsVisual />, to: 'booking-platform' },
  ];
  return (
    <div className="space-y-16 sm:space-y-24">
      {rows.map((r, i) => (
        <Reveal key={r.title}>
          <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className={i % 2 === 1 ? 'lg:order-2' : ''}>{r.visual}</div>
            <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
              <h3 className="font-display text-[clamp(2.2rem,4.4vw,3.6rem)] text-fg">{r.title}</h3>
              <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-muted sm:text-[17px]">{r.body}</p>
              <Link
                to={`/projekti/${r.to}`}
                className="draw-line mt-5 inline-flex items-center gap-2 pb-1 text-[15px] font-medium text-fg transition-colors hover:text-accent"
              >
                {t('services.how')}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        </Reveal>
      ))}
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-5 rounded-[1.25rem] bg-accent-strong p-6 sm:flex-row sm:items-center sm:p-9">
          <p className="font-display text-[clamp(1.7rem,3.4vw,2.8rem)] text-white">{t('freelance.cta')}</p>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <a
              href={mailto(t('freelance.mailSubject'), t('freelance.mailBody'))}
              className="btn-pill shrink-0 bg-white text-[#12091f] before:bg-[#12091f] hover:text-white"
              data-magnetic
            >
              <Mail />
              {t('cta.talk')}
            </a>
            <p className="text-[13px] text-white">{t('contact.reply')}</p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* --------------------------------------------------------------------- about */

export function About() {
  const { t } = useLang();
  // Plain facts a client or an employer asks first, as a list rather than big-number tiles.
  const facts = [1, 2, 3, 4, 5].map((n) => ({ k: t(`about.k${n}` as 'about.k1'), v: t(`about.v${n}` as 'about.v1') }));
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
      <Reveal>
        <div className="max-w-[62ch] space-y-5 text-[17px] leading-relaxed text-fg/85 sm:text-[19px]">
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
          <p>{t('about.p3')}</p>
        </div>
      </Reveal>
      <Reveal delay={100}>
        <dl className="border-t border-fg/10">
          {facts.map((f) => (
            <div key={f.k} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-b border-fg/10 py-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <dt className="pt-0.5 text-[13px] text-subtle sm:text-[14px]">{f.k}</dt>
              <dd className="text-[15px] leading-snug text-fg sm:text-[16px]">{f.v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}

/* ---------------------------------------------------------------------- work */

/**
 * The work as an index: one row per project, the result in the title, what kind of
 * work it was and when on the right. The pictures live in the services above (the
 * live site, the before/after, the booking week), so this list does not repeat them.
 */
function WorkRow({ project }: { project: Project }) {
  const { t, pick } = useLang();
  const plain = project.plain;
  const title = plain ? pick(plain.title) : pick(project.title);
  return (
    <li className="group relative border-t border-fg/10 last:border-b">
      <Link to={`/projekti/${project.id}`} className="absolute inset-0 z-0" aria-label={`${title}: ${t('work.details')}`} />
      <div className="pointer-events-none grid gap-3 py-7 sm:py-9 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start lg:gap-12">
        <div className="min-w-0">
          <h3
            className="font-display text-balance text-[clamp(1.75rem,3.6vw,3rem)] text-fg transition-[color,transform] duration-500
                       ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-hover:text-accent"
          >
            {title}
          </h3>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-muted sm:text-[16px]">
            {plain ? pick(plain.text) : pick(project.subtitle)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] lg:flex-col lg:items-end lg:gap-2 lg:pt-2 lg:text-right">
          <p className="text-subtle">
            {t(statusKey[project.status])}, {project.year}
          </p>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="pointer-events-auto relative z-10 inline-flex items-center gap-2 text-accent transition-colors hover:text-fg"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#7ee2a8]" aria-hidden="true" />
              {project.liveUrl.replace(/^https?:\/\//, '')}
            </a>
          ) : null}
          <span className="inline-flex items-center gap-2 text-fg">
            {t('work.details')}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </li>
  );
}

/**
 * Home-page order, which is not the CV's: what a client can check comes first (the
 * live site, the delivered tool), then the prototype, then the university project.
 */
const HOME_ORDER = ['client-sites', 'report-automation', 'booking-platform', 'chatbot-api'];

export function Work() {
  const ordered = [...projectsByRank].sort((a, b) => HOME_ORDER.indexOf(a.id) - HOME_ORDER.indexOf(b.id));
  return (
    <ul>
      {ordered.map((p) => (
        <WorkRow key={p.id} project={p} />
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- tech, folded */

/**
 * One folded row, closed by default. The content is always in the HTML (search
 * engines and AI crawlers read it, and the prerender captures it); while closed it
 * is collapsed and inert, so it is out of the tab order and the reading flow.
 */
export function Fold({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const body = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen((o) => !o);

  useEffect(() => {
    const el = body.current;
    if (!el) return;
    if (!motionOK()) {
      el.style.height = open ? 'auto' : '0px';
      return;
    }
    if (open) {
      gsap.fromTo(el, { height: 0 }, { height: 'auto', duration: 0.6, ease: 'power3.inOut' });
    } else {
      gsap.to(el, { height: 0, duration: 0.5, ease: 'power3.inOut' });
    }
  }, [open]);

  return (
    <div className="border-t border-fg/10 last:border-b">
      <h3>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={id}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="text-[17px] font-semibold text-fg transition-colors group-hover:text-accent sm:text-[20px]">{title}</span>
          <span
            className={
              'grid h-10 w-10 shrink-0 place-items-center rounded-full border border-fg/15 text-[20px] text-fg transition-transform duration-500 ' +
              (open ? 'rotate-45 border-accent-strong bg-accent-strong' : '')
            }
            aria-hidden="true"
          >
            +
          </span>
        </button>
      </h3>
      <div id={id} ref={body} className="h-0 overflow-hidden" role="region" {...(open ? {} : { inert: '' })}>
        <div className="pb-10">{children}</div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- faq */

/** The questions people ask before they write. Every answer is something he has confirmed. */
export function Faq() {
  const { t } = useLang();
  return (
    <div className="max-w-4xl">
      {[1, 2, 3, 4].map((n) => (
        <Fold key={n} title={t(`faq.q${n}` as 'faq.q1')}>
          <p className="max-w-[62ch] text-[16px] leading-relaxed text-muted sm:text-[17px]">{t(`faq.a${n}` as 'faq.a1')}</p>
        </Fold>
      ))}
    </div>
  );
}

/* --------------------------------------------------------------------- tech */

/** The stack he has shipped real work with, shown before anything is unfolded. */
const CORE_STACK = ['SQL', 'PostgreSQL', 'Python', 'pandas', 'React', 'TypeScript', 'PHP', 'Laravel'];

export function TechDetails() {
  const { t } = useLang();
  return (
    <div>
      {/* What a recruiter needs in ten seconds: what he wants, what he works in, and the CV. */}
      <Reveal>
        <div className="panel mb-10 grid gap-7 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
          <div>
            <p className="max-w-[58ch] text-[17px] leading-relaxed text-fg sm:text-[19px]">{t('tech.status')}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={t('case.stack')}>
              {CORE_STACK.map((s) => (
                <li key={s} className="rounded-full border border-fg/15 px-3 py-1 text-[13px] text-fg/90">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:flex-col lg:items-stretch">
            <Link to="/cv" className="btn-pill btn-pill--ghost" data-magnetic>
              <Download className="h-4 w-4" />
              {t('tech.cv')}
            </Link>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center gap-2 text-[14px] text-muted transition-colors hover:text-fg"
            >
              <GitHub className="h-4 w-4" />
              {profile.githubHandle}
            </a>
          </div>
        </div>
      </Reveal>
      <Fold title={t('tech.projects')}>
        <Projects />
      </Fold>
      <Fold title={t('tech.schema')}>
        <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-muted">{t('schema.lead')}</p>
        <SchemaDiagram />
      </Fold>
      <Fold title={t('tech.skills')}>
        <Skills />
      </Fold>
      <Fold title={t('tech.experience')}>
        <Experience />
      </Fold>
      <Fold title={t('tech.education')}>
        <Education />
      </Fold>
    </div>
  );
}
