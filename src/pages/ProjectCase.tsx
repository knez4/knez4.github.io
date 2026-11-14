import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, GitHub } from '../components/icons';
import { Reveal, SplitText } from '../components/Reveal';
import { projectById } from '../data/projects';
import type { MediaItem, Project } from '../data/types';
import { profile } from '../data/profile';
import { useHead } from '../lib/useHead';
import { isDiagram, srcSetFor } from '../lib/images';
import { useLang } from '../lib/useLang';
import NotFound from './NotFound';

const statusKey = {
  prototype: 'status.prototype',
  delivered: 'status.delivered',
  coursework: 'status.coursework',
  maintained: 'status.maintained',
  unfinished: 'status.unfinished',
} as const;

/** A screenshot inside a plain browser window, with the site's address in the bar. */
function BrowserShot({ shot, site, sizes, eager = false }: { shot: MediaItem; site: string; sizes: string; eager?: boolean }) {
  const { pick } = useLang();
  return (
    <div className="overflow-hidden rounded-xl border border-fg/10 bg-[#0f0c18] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)] sm:rounded-2xl">
      <div className="flex items-center gap-1.5 border-b border-fg/10 px-3 py-2 sm:px-4 sm:py-2.5" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-fg/20" />
        <span className="h-2 w-2 rounded-full bg-fg/20" />
        <span className="h-2 w-2 rounded-full bg-fg/20" />
        <span className="ml-3 truncate rounded-full bg-fg/[0.06] px-3 py-0.5 text-[11px] text-subtle">{site}</span>
      </div>
      <img
        src={shot.src}
        srcSet={srcSetFor(shot.src)}
        sizes={sizes}
        alt={pick(shot.alt)}
        width={1440}
        height={900}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="block aspect-[16/10] w-full object-cover object-top"
      />
    </div>
  );
}

/**
 * The live site, shown the way a visitor meets it: the first screen large, the same
 * site on four phones, then three parts of the page with a line on what each does.
 * All of it is screenshots of the real site, none of it mock-up.
 */
function SiteGallery({ gallery }: { gallery: NonNullable<Project['gallery']> }) {
  const { pick } = useLang();
  const [first, ...rest] = gallery.shots;
  return (
    <div className="mt-10 space-y-14 sm:space-y-20">
      <figure>
        <BrowserShot shot={first} site={gallery.site} sizes="(min-width: 1120px) 1056px, 92vw" eager />
        {first.caption ? <figcaption className="mt-3 max-w-[60ch] text-[15px] text-muted">{pick(first.caption)}</figcaption> : null}
      </figure>

      {/* Phones: a row that scrolls sideways on small screens, staggered on wide ones. */}
      <div className="relative -mx-4 overflow-hidden rounded-none border-y border-fg/10 bg-[radial-gradient(60%_80%_at_50%_0%,rgb(124_77_255/0.22),transparent)] px-4 py-10 sm:mx-0 sm:rounded-[1.5rem] sm:border sm:px-10 sm:py-14">
        <ul className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-4 sm:gap-6 sm:overflow-visible sm:pb-0 lg:gap-10">
          {gallery.phones.map((ph, i) => (
            <li key={ph.src} className={'w-[58%] shrink-0 snap-center sm:w-auto ' + (i % 2 === 1 ? 'sm:translate-y-8' : '')}>
              <Reveal delay={i * 90}>
                <div className="overflow-hidden rounded-[1.4rem] border-[3px] border-[#1b1626] bg-[#0f0c18] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.95)] lg:rounded-[1.8rem] lg:border-4">
                  <img
                    src={ph.src}
                    srcSet={srcSetFor(ph.src)}
                    sizes="(min-width: 1120px) 220px, (min-width: 640px) 20vw, 56vw"
                    alt={pick(ph.alt)}
                    width={480}
                    height={1039}
                    loading="lazy"
                    decoding="async"
                    className="block aspect-[480/1039] w-full object-cover"
                  />
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="hidden sm:block sm:h-8" aria-hidden="true" />
      </div>

      {rest.map((shot, i) => (
        <figure key={shot.src} className="grid items-center gap-5 lg:grid-cols-12 lg:gap-12">
          <div className={'lg:col-span-8 ' + (i % 2 === 1 ? 'lg:order-2' : '')}>
            <Reveal>
              <BrowserShot shot={shot} site={gallery.site} sizes="(min-width: 1120px) 690px, 92vw" />
            </Reveal>
          </div>
          {shot.caption ? (
            <figcaption className={'text-[17px] leading-relaxed text-fg/85 sm:text-[19px] lg:col-span-4 ' + (i % 2 === 1 ? 'lg:order-1' : '')}>
              {pick(shot.caption)}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}

export default function ProjectCase() {
  const { id = '' } = useParams();
  const { t, pick } = useLang();
  const project = projectById(id);

  useHead({
    title: project ? `${pick(project.title)} | ${profile.name}` : `${t('notFound.title')} | ${profile.name}`,
    description: project ? pick(project.subtitle) : t('projects.notFound'),
    canonical: `${profile.siteUrl}/projekti/${id}/`,
  });

  if (!project) return <NotFound />;

  const cs = project.caseStudy;

  return (
    <article className="container-page py-14 sm:py-20">
      <Link to="/#projects" className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-fg">
        <ArrowLeft className="h-3.5 w-3.5" />
        {t('projects.back')}
      </Link>

      <header className="mt-10 border-b border-fg/10 pb-12">
        <p className="flex flex-wrap items-center gap-2 text-[13px] text-accent">
          {t(statusKey[project.status])}, {project.year}
        </p>
        <h1 className="font-display mt-6 text-[clamp(3rem,9vw,8rem)] text-fg">
          <SplitText text={pick(project.title)} />
        </h1>
        <p className="mt-8 max-w-3xl text-xl leading-snug text-fg/90 sm:text-2xl">{pick(project.subtitle)}</p>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">{pick(project.context)}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {project.repoUrl ? (
            <a href={project.repoUrl} target="_blank" rel="noreferrer noopener" className="btn-pill btn-pill--ghost">
              <GitHub className="h-3.5 w-3.5" />
              {t('projects.viewRepo')}
            </a>
          ) : null}
          {project.repos?.map((repo) => (
            <a key={repo.url} href={repo.url} target="_blank" rel="noreferrer noopener" className="btn-pill btn-pill--ghost">
              <GitHub className="h-3.5 w-3.5" />
              {repo.label}
            </a>
          ))}
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noreferrer noopener" className="btn-pill btn-pill--ghost">
              {t('projects.viewLive')}
            </a>
          ) : null}
        </div>
      </header>

      {project.gallery ? <SiteGallery gallery={project.gallery} /> : null}

      {(project.gallery ? project.media.filter((m) => isDiagram(m.src)) : project.media).map((m) => (
        <figure key={m.src} className="mt-10">
          <img
            src={m.src}
            srcSet={srcSetFor(m.src)}
            sizes="(min-width: 1120px) 1056px, 92vw"
            alt={pick(m.alt)}
            width={1200}
            height={675}
            loading="lazy"
            decoding="async"
            className="w-full rounded-2xl border border-fg/10 bg-surface"
          />
          {m.caption ? (
            <figcaption className="mt-2 text-[12px] text-subtle">{pick(m.caption)}</figcaption>
          ) : null}
        </figure>
      ))}

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-10">
          {cs ? (
            <>
              <section>
                <h2 className="eyebrow">{t('case.problem')}</h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{pick(cs.problem)}</p>
              </section>

              <section>
                <h2 className="eyebrow">{t('case.approach')}</h2>
                <ul className="mt-4 space-y-3">
                  {pick(cs.approach).map((step) => (
                    <li key={step} className="flex gap-3">
                      <span className="mt-[0.7rem] h-px w-4 shrink-0 bg-accent" aria-hidden="true" />
                      <p className="max-w-2xl text-[15px] leading-relaxed text-muted">{step}</p>
                    </li>
                  ))}
                </ul>
              </section>

              {cs.decisions ? (
                <section>
                  <h2 className="eyebrow">{t('case.decisions')}</h2>
                  <ul className="mt-4 space-y-3">
                    {pick(cs.decisions).map((d) => (
                      <li key={d} className="flex gap-2">
                        <span
                          className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-subtle"
                          aria-hidden="true"
                        />
                        <p className="max-w-2xl text-[15px] leading-relaxed text-muted">{d}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section className="panel p-6 sm:p-7">
                <h2 className="eyebrow">{t('case.limits')}</h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{pick(cs.limits)}</p>
              </section>
            </>
          ) : (
            <section>
              <h2 className="eyebrow">{t('case.approach')}</h2>
              <ul className="mt-4 space-y-3">
                {pick(project.highlights).map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-subtle" aria-hidden="true" />
                    <p className="max-w-2xl text-[15px] leading-relaxed text-muted">{h}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="panel h-fit p-6 lg:sticky lg:top-24">
          <h2 className="eyebrow">{t('case.stack')}</h2>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.tech.map((tech) => (
              <li key={tech} className="chip">
                {tech}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </article>
  );
}
