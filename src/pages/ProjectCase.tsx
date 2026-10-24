import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, GitHub } from '../components/icons';
import { SplitText } from '../components/Reveal';
import { projectById } from '../data/projects';
import { profile } from '../data/profile';
import { useHead } from '../lib/useHead';
import { srcSetFor } from '../lib/images';
import { useLang } from '../lib/useLang';
import NotFound from './NotFound';

const statusKey = {
  prototype: 'status.prototype',
  delivered: 'status.delivered',
  coursework: 'status.coursework',
  maintained: 'status.maintained',
  unfinished: 'status.unfinished',
} as const;

export default function ProjectCase() {
  const { id = '' } = useParams();
  const { t, pick } = useLang();
  const project = projectById(id);

  useHead({
    title: project ? `${pick(project.title)} — ${profile.name}` : `${t('notFound.title')} — ${profile.name}`,
    description: project ? pick(project.subtitle) : t('projects.notFound'),
    canonical: `${profile.siteUrl}/projekti/${id}/`,
  });

  if (!project) return <NotFound />;

  const cs = project.caseStudy;

  return (
    <article className="container-page py-14 sm:py-20">
      <Link to="/#projects" className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted hover:text-fg">
        <ArrowLeft className="h-3.5 w-3.5" />
        {t('projects.back')}
      </Link>

      <header className="mt-10 border-b border-fg/10 pb-12">
        <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          <span>{project.year}</span>
          <span aria-hidden="true">&middot;</span>
          <span>{t(statusKey[project.status])}</span>
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

      {project.media.map((m) => (
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
                <ol className="mt-4 space-y-3">
                  {pick(cs.approach).map((step, i) => (
                    <li key={step} className="flex gap-3">
                      <span className="mt-0.5 font-mono text-[11px] text-accent">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="max-w-2xl text-[15px] leading-relaxed text-muted">{step}</p>
                    </li>
                  ))}
                </ol>
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
