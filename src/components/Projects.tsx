import { Link } from 'react-router-dom';
import { projectsByRank } from '../data/projects';
import type { Project } from '../data/types';
import { useLang } from '../lib/useLang';
import { ArrowRight, GitHub } from './icons';
import { Reveal } from './Reveal';

const statusKey = {
  prototype: 'status.prototype',
  delivered: 'status.delivered',
  coursework: 'status.coursework',
  maintained: 'status.maintained',
  unfinished: 'status.unfinished',
} as const;

function ProjectCard({ project }: { project: Project }) {
  const { t, pick } = useLang();
  const cover = project.media[0];

  return (
    <article className="card card-hover flex flex-col overflow-hidden">
      <Link
        to={`/projekti/${project.id}`}
        className="block border-b border-line bg-surface-2"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={cover.src}
          alt=""
          width={1200}
          height={675}
          loading="lazy"
          decoding="async"
          className="aspect-[16/9] w-full object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 font-mono text-[11px] text-subtle">
          <span>{project.year}</span>
          <span aria-hidden="true">&middot;</span>
          <span>{t(statusKey[project.status])}</span>
        </div>

        <h3 className="mt-2 text-lg font-semibold tracking-tight">
          <Link to={`/projekti/${project.id}`} className="hover:text-accent">
            {pick(project.title)}
          </Link>
        </h3>

        <p className="mt-1.5 text-sm leading-relaxed text-muted">{pick(project.subtitle)}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={t('case.stack')}>
          {project.tech.slice(0, 6).map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-4 pt-1 text-sm">
          <Link to={`/projekti/${project.id}`} className="link-underline inline-flex items-center gap-1.5">
            {t('projects.readCase')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-muted hover:text-fg"
            >
              <GitHub className="h-3.5 w-3.5" />
              {t('projects.viewRepo')}
            </a>
          ) : null}
          {project.repos?.map((repo) => (
            <a
              key={repo.url}
              href={repo.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-muted hover:text-fg"
            >
              <GitHub className="h-3.5 w-3.5" />
              {repo.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {projectsByRank.map((p, i) => (
        <Reveal key={p.id} delay={i * 60}>
          <ProjectCard project={p} />
        </Reveal>
      ))}
    </div>
  );
}
