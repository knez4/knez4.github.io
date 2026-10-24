import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsByRank } from '../data/projects';
import type { Project } from '../data/types';
import { finePointer, gsap, motionOK } from '../lib/motion';
import { srcSetFor } from '../lib/images';
import { useLang } from '../lib/useLang';
import { ArrowRight, GitHub, Lock } from './icons';
import { Reveal } from './Reveal';

export const statusKey = {
  prototype: 'status.prototype',
  delivered: 'status.delivered',
  coursework: 'status.coursework',
  maintained: 'status.maintained',
  unfinished: 'status.unfinished',
} as const;

/**
 * Source links under the row's call to action. A private client repo gets its
 * note instead of a link: linking it would show visitors a GitHub 404.
 */
function RepoLinks({ project }: { project: Project }) {
  const { t, pick } = useLang();
  const links = [
    ...(project.repoUrl ? [{ label: t('projects.viewRepo'), url: project.repoUrl }] : []),
    ...(project.repos ?? []),
  ];
  const item = 'inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]';

  if (!links.length) {
    return project.repoNote ? (
      <span className="inline-flex items-start gap-2 text-left text-[13px] leading-snug text-subtle lg:flex-row-reverse lg:text-right">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        {pick(project.repoNote)}
      </span>
    ) : null;
  }
  return (
    <span className="flex flex-wrap gap-x-6 gap-y-2 lg:justify-end">
      {/* A live site outranks the source: it is what a visitor actually wants to open. */}
      {project.liveUrl ? (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={item + ' pointer-events-auto relative z-10 text-accent transition-colors hover:text-fg'}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#7ee2a8]" aria-hidden="true" />
          {project.liveUrl.replace(/^https?:\/\//, '')} ↗
        </a>
      ) : null}
      {links.map((l) => (
        <a
          key={l.url}
          href={l.url}
          target="_blank"
          rel="noreferrer noopener"
          className={item + ' pointer-events-auto relative z-10 text-muted transition-colors hover:text-accent'}
        >
          <GitHub className="h-3.5 w-3.5 shrink-0" />
          {l.label}
        </a>
      ))}
    </span>
  );
}

/**
 * One project per row, the title set large. On a fine pointer the row's cover
 * floats next to the cursor while hovered, so the list stays typographic and
 * the images still get seen. Touch screens get a card with the image inline.
 */
function ProjectRow({ project, index, onHover }: { project: Project; index: number; onHover: (i: number | null) => void }) {
  const { t, pick } = useLang();
  const href = `/projekti/${project.id}`;
  const cover = project.media[0];

  return (
    <article
      className="group relative border-t border-fg/10 py-7 transition-colors duration-500 last:border-b hover:bg-fg/[0.02] sm:py-10"
      onPointerEnter={() => onHover(index)}
      onPointerLeave={() => onHover(null)}
    >
      <Link to={href} className="absolute inset-0 z-0" aria-label={`${pick(project.title)}: ${t('projects.readCase')}`} />

      <div className="pointer-events-none grid gap-4 sm:gap-6 lg:grid-cols-[5rem_minmax(0,1fr)_16rem] lg:items-start">
        <span className="font-mono text-[12px] text-accent">{String(index + 1).padStart(2, '0')}</span>

        <div className="min-w-0">
          {/* Inline cover for touch and narrow screens */}
          <div className="mb-5 overflow-hidden rounded-xl border border-fg/10 bg-surface lg:hidden">
            <img src={cover.src} srcSet={srcSetFor(cover.src)} sizes="92vw" alt="" width={1200} height={675} loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />
          </div>

          <h3
            className="font-display text-[clamp(2rem,6vw,5.25rem)] text-fg transition-[color,transform] duration-500
                       ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3 group-hover:text-accent"
          >
            {pick(project.title)}
          </h3>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted sm:mt-4 sm:text-[15px]">{pick(project.subtitle)}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5 max-sm:[&>li:nth-child(n+5)]:hidden sm:mt-5" aria-label={t('case.stack')}>
            {project.tech.slice(0, 6).map((tech) => (
              <li key={tech} className="chip !rounded-full !border-fg/10 !bg-transparent">
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-start gap-3 sm:gap-4 lg:items-end lg:text-right">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
            {project.year} · {t(statusKey[project.status])}
          </p>
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-fg">
            {t('projects.readCase')}
            <span
              className="grid h-9 w-9 place-items-center rounded-full border border-fg/15 transition-all duration-500
                         group-hover:rotate-[-45deg] group-hover:border-accent-strong group-hover:bg-accent-strong"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </span>
          <div className="max-w-[16rem] lg:text-right">
            <RepoLinks project={project} />
          </div>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const [active, setActive] = useState<number | null>(null);
  const [float] = useState(() => motionOK() && finePointer());
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!float || !box.current) return;
    const el = box.current;
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      x(e.clientX + 28);
      y(e.clientY - 120);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [float]);

  useEffect(() => {
    if (!float || !box.current) return;
    gsap.to(box.current, {
      autoAlpha: active === null ? 0 : 1,
      scale: active === null ? 0.85 : 1,
      rotation: active === null ? -4 : 0,
      duration: 0.45,
      ease: 'power3.out',
    });
  }, [active, float]);

  return (
    <div>
      {projectsByRank.map((p, i) => (
        <Reveal key={p.id} delay={i * 60}>
          <ProjectRow project={p} index={i} onHover={float ? setActive : () => undefined} />
        </Reveal>
      ))}

      {float ? (
        <div
          ref={box}
          className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[420px] overflow-hidden rounded-2xl border border-accent/30
                     bg-surface opacity-0 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85),0_0_80px_-30px_rgba(124,77,255,0.7)] lg:block"
          aria-hidden="true"
        >
          {/* Covers are stacked and cross-faded by opacity, and decoded up front, so
              a hover never waits on an image or changes layout. */}
          <div className="relative aspect-[16/10]">
            {projectsByRank.map((p, i) => (
              <img
                key={p.id}
                src={p.media[0].src}
                srcSet={srcSetFor(p.media[0].src)}
                sizes="420px"
                alt=""
                width={1200}
                height={675}
                decoding="async"
                ref={(el) => void el?.decode?.().catch(() => undefined)}
                className={
                  'absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ' +
                  (active === i ? 'opacity-100' : 'opacity-0')
                }
              />
            ))}
          </div>
          <div className="relative h-[42px] border-t border-fg/10">
            {projectsByRank.map((p, i) => (
              <div
                key={p.id}
                className={
                  'absolute inset-0 flex items-center justify-between gap-4 px-4 transition-opacity duration-300 ' +
                  (active === i ? 'opacity-100' : 'opacity-0')
                }
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                  {String(i + 1).padStart(2, '0')} · {p.year}
                </span>
                <span className="truncate font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                  {p.tech.slice(0, 3).join(' · ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
