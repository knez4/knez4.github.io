import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { education } from '../data/education';
import { useLang } from '../lib/useLang';
import { ArrowRight, Download, Mail } from './icons';

export function Hero() {
  const { t, pick } = useLang();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-texture" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full
                   bg-accent/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative py-20 sm:py-28">
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70
                      px-3 py-1 font-mono text-[11px] text-muted backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          {pick(profile.status)}
        </p>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">{profile.name}</h1>

        <p className="mt-3 max-w-2xl text-lg text-accent sm:text-xl">{pick(profile.role)}</p>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{pick(profile.tagline)}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#projects" className="btn btn-primary">
            {t('hero.viewProjects')}
            <ArrowRight />
          </a>
          <Link to="/cv" className="btn btn-ghost">
            <Download />
            {t('hero.downloadCv')}
          </Link>
          <a href={`mailto:${profile.email}`} className="btn btn-ghost">
            <Mail />
            {t('hero.emailMe')}
          </a>
        </div>

        <dl className="mt-12 grid max-w-3xl grid-cols-1 gap-x-8 gap-y-4 border-t border-line pt-8
                       font-mono text-[12px] sm:grid-cols-3">
          <div>
            <dt className="text-subtle">{t('nav.education')}</dt>
            <dd className="mt-1 text-fg">{pick(education.period)}</dd>
          </div>
          <div>
            <dt className="text-subtle">Location</dt>
            <dd className="mt-1 text-fg">{pick(profile.location)}</dd>
          </div>
          <div>
            <dt className="text-subtle">GitHub</dt>
            <dd className="mt-1">
              <a href={profile.github} target="_blank" rel="noreferrer noopener" className="link-underline">
                {profile.githubHandle}
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
