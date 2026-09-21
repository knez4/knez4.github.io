import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, GitHub } from '../components/icons';
import { projectById } from '../data/projects';
import { profile } from '../data/profile';
import { useHead } from '../lib/useHead';
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
    <article className="container-page py-12 sm:py-16">
      <Link to="/#projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
        <ArrowLeft className="h-3.5 w-3.5" />
        {t('projects.back')}
      </Link>

      <header className="mt-8 border-b border-line pb-8">
        <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-subtle">
          <span>{project.year}</span>
          <span aria-hidden="true">&middot;</span>
          <span>{t(statusKey[project.status])}</span>
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{pick(project.title)}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">{pick(project.subtitle)}</p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">{pick(project.context)}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
          {project.repoUrl ? (
            <a href={project.repoUrl} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">
              <GitHub className="h-3.5 w-3.5" />
              {t('projects.viewRepo')}
            </a>
          ) : null}
          {project.repos?.map((repo) => (
            <a key={repo.url} href={repo.url} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">
              <GitHub className="h-3.5 w-3.5" />
              {repo.label}
            </a>
          ))}
          {project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noreferrer noopener" className="btn btn-ghost">
              {t('projects.viewLive')}
            </a>
          ) : null}
        </div>
      </header>

      {project.media.map((m) => (
        <figure key={m.src} className="mt-10">
          <img
            src={m.src}
            alt={pick(m.alt)}
            width={1200}
            height={675}
            loading="lazy"
            decoding="async"
            className="w-full rounded-xl border border-line bg-surface-2"
          />
          {m.caption ? (
            <figcaption className="mt-2 text-[12px] text-subtle">{pick(m.caption)}</figcaption>
          ) : null}
        </figure>
      ))}

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
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

              <section className="rounded-xl border border-line bg-surface-2 p-5">
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

        <aside className="h-fit lg:sticky lg:top-24">
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
