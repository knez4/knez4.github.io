import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { projectsByRank } from '../data/projects';
import type { Project } from '../data/types';
import { srcSetFor, isDiagram } from '../lib/images';
import { gsap, motionOK } from '../lib/motion';
import { useLang } from '../lib/useLang';
import { ArrowRight, Download, Mail } from './icons';
import { Projects } from './Projects';
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
  const row = 'flex items-start gap-2 text-[clamp(11px,3cqw,15px)] leading-snug';
  return (
    <figure>
      <div ref={ref} className="relative aspect-[4/3] select-none overflow-hidden rounded-2xl border border-fg/10 [container-type:inline-size] sm:aspect-[16/10]">
        {/* After: the whole card */}
        <div className="absolute inset-0 flex flex-col items-end justify-between bg-accent-strong/25 p-4 text-right sm:p-7">
          <p className="w-1/2 font-mono text-[10px] uppercase tracking-[0.16em] text-accent sm:text-[11px]">{t('ba.after')}</p>
          <div className="w-[42%]">
            <p className="font-display text-[17cqw] text-fg">3 s</p>
            <ul className="mt-3 space-y-1.5 text-fg/85">
              {['ba.a1', 'ba.a2', 'ba.a3'].map((k) => (
                <li key={k} className={row + ' justify-end'}>
                  {t(k as 'ba.a1')}
                  <span className="text-[#7ee2a8]" aria-hidden="true">✓</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Before: clipped to the left of the divider */}
        <div
          className="absolute inset-0 flex flex-col justify-between bg-[#14101f] p-5 sm:p-7"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden="true"
        >
          <p className="w-1/2 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle sm:text-[11px]">{t('ba.before')}</p>
          <div className="w-[42%]">
            <p className="font-display whitespace-nowrap text-[17cqw] text-fg/40">~6 h</p>
            <ul className="mt-3 space-y-1.5 text-muted">
              {['ba.b1', 'ba.b2', 'ba.b3'].map((k) => (
                <li key={k} className={row}>
                  <span className="text-[#ff8a8a]" aria-hidden="true">✕</span>
                  {t(k as 'ba.b1')}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Divider and handle */}
        <div className="pointer-events-none absolute inset-y-0 w-px bg-white/80" style={{ left: `${pos}%` }} aria-hidden="true">
          <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#12091f] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <span className="font-mono text-[11px] font-semibold">⟷</span>
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
      <figcaption className="mt-3 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
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
            <span key={d} className="text-center font-mono text-[11px] uppercase tracking-widest text-subtle">
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
                    'rounded-lg border py-2.5 text-center font-mono text-[11px] sm:text-[12px] ' +
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
      <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{t('services.illustration')}</figcaption>
    </figure>
  );
}

/** Three services as alternating scenes: visual on one side, plain words on the other. */
export function Services() {
  const { t } = useLang();
  const rows: { title: string; body: string; visual: ReactNode; extra?: ReactNode }[] = [
    { title: t('services.sites'), body: t('services.sitesBody'), visual: <SitesVisual /> },
    { title: t('services.auto'), body: t('services.autoBody'), visual: <BeforeAfter /> },
    { title: t('services.apps'), body: t('services.appsBody'), visual: <AppsVisual /> },
  ];
  return (
    <div className="space-y-16 sm:space-y-24">
      {rows.map((r, i) => (
        <Reveal key={r.title}>
          <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            <div className={i % 2 === 1 ? 'lg:order-2' : ''}>{r.visual}</div>
            <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">0{i + 1}</p>
              <h3 className="font-display mt-3 text-[clamp(2.4rem,5vw,4.2rem)] text-fg">{r.title}</h3>
              <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-muted sm:text-[17px]">{r.body}</p>
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
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white">{t('contact.reply')}</p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* ------------------------------------------------------------------- process */

export function Process() {
  const { t } = useLang();
  const steps = [1, 2, 3, 4].map((n) => ({ title: t(`process.s${n}` as 'process.s1'), body: t(`process.s${n}b` as 'process.s1b') }));
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 80} className="panel spot h-full p-6 sm:p-7">
            <span className="font-display text-[3rem] leading-none text-accent">{i + 1}</span>
            <h3 className="mt-5 text-[19px] font-semibold text-fg">{s.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}

/* --------------------------------------------------------------------- about */

export function About() {
  const { t } = useLang();
  const facts = [
    { big: '3', small: t('about.f1') },
    { big: '50', small: t('about.f2') },
    { big: t('about.f3'), small: t('about.f3b') },
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
      <Reveal>
        <div className="space-y-5 text-[17px] leading-relaxed text-fg/85 sm:text-[19px]">
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
        </div>
      </Reveal>
      <Reveal delay={100}>
        <dl className="grid grid-cols-3 gap-3 lg:grid-cols-1">
          {facts.map((f) => (
            <div key={f.small} className="panel p-4 sm:p-6">
              <dt className="font-display whitespace-nowrap text-[clamp(1.1rem,5.2vw,3.4rem)] leading-none text-fg">{f.big}</dt>
              <dd className="mt-2 text-[12px] leading-snug text-muted sm:text-[14px]">{f.small}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}

/* ---------------------------------------------------------------------- work */

/** A cover for projects without a real screenshot: the plain title, set large on the accent. */
function WordCover({ text }: { text: string }) {
  return (
    <div className="flex aspect-[16/10] items-end bg-[linear-gradient(135deg,rgb(124_77_255/0.55),rgb(124_77_255/0.12))] p-5 sm:p-7">
      <span className="font-display text-[clamp(2.6rem,7vw,4.6rem)] text-white">{text}</span>
    </div>
  );
}

/** One or two words for the cover of a project that has no real screenshot. */
const COVER: Record<string, { en: string; sr: string }> = {
  'booking-platform': { en: 'Booking', sr: 'Zakazivanje' },
  'chatbot-api': { en: 'Chatbot', sr: 'Chatbot' },
  'report-automation': { en: '6 h → 3 s', sr: '6 h → 3 s' },
};

function WorkCard({ project }: { project: Project }) {
  const { t, pick } = useLang();
  const plain = project.plain;
  const title = plain ? pick(plain.title) : pick(project.title);
  const cover = project.media[0];
  const photo = cover && !isDiagram(cover.src);
  return (
    <article className="panel spot group flex h-full flex-col overflow-hidden">
      <div className="overflow-hidden border-b border-fg/10">
        {photo ? (
          <img
            src={cover.src}
            srcSet={srcSetFor(cover.src)}
            sizes="(min-width: 640px) 45vw, 92vw"
            alt=""
            width={1200}
            height={750}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <WordCover text={COVER[project.id] ? pick(COVER[project.id]) : title} />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[20px] font-semibold leading-snug text-fg">{title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{plain ? pick(plain.text) : pick(project.subtitle)}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 font-mono text-[11px] uppercase tracking-[0.14em]">
          <Link to={`/projekti/${project.id}`} className="inline-flex items-center gap-2 text-fg transition-colors hover:text-accent">
            {t('work.details')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 text-accent hover:text-fg">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7ee2a8]" aria-hidden="true" />
              {t('work.visit')} ↗
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function Work() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {projectsByRank.map((p, i) => (
        <Reveal key={p.id} delay={(i % 2) * 90}>
          <WorkCard project={p} />
        </Reveal>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- tech, folded */

/**
 * One folded row, closed by default. The content is always in the HTML (search
 * engines and AI crawlers read it, and the prerender captures it); while closed it
 * is collapsed and inert, so it is out of the tab order and the reading flow.
 */
function Fold({ title, children }: { title: string; children: ReactNode }) {
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

export function TechDetails() {
  const { t, pick } = useLang();
  return (
    <div>
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
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
        <Link to="/cv" className="inline-flex items-center gap-2 hover:text-fg">
          <Download className="h-4 w-4" />
          {t('tech.cv')}
        </Link>
        <span className="normal-case tracking-normal">{pick(profile.status)}</span>
      </div>
    </div>
  );
}
