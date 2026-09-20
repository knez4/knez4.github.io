import { useState } from 'react';
import { education } from '../data/education';
import { experience } from '../data/experience';
import { languages, profile } from '../data/profile';
import { pickItem, skillGroups } from '../data/skills';
import { useLang } from '../lib/useLang';
import { Check, GitHub, LinkedIn, Mail } from './icons';
import { Reveal } from './Reveal';

export function Skills() {
  const { t, pick, lang } = useLang();
  const applied = skillGroups.filter((g) => g.kind === 'applied');
  const academic = skillGroups.filter((g) => g.kind === 'academic');

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {applied.map((g, i) => (
          <Reveal key={g.label.en} delay={i * 50}>
            <div className="card h-full p-5">
              <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
                {pick(g.label)}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {g.items.map((item) => (
                  <li key={pickItem(item, 'en')} className="chip">
                    {pickItem(item, lang)}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 border-t border-line pt-6">
        <p className="max-w-3xl text-sm leading-relaxed text-subtle">{t('skills.appliedNote')}</p>
        {academic.map((g) => (
          <div key={g.label.en} className="mt-4">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-subtle">
              {pick(g.label)}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {g.items.map((item) => (
                <li key={pickItem(item, 'en')} className="chip opacity-80">
                  {pickItem(item, lang)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Experience() {
  const { pick } = useLang();
  return (
    <ol className="relative space-y-8 border-l border-line pl-6">
      {experience.map((role, i) => (
        <Reveal key={`${role.title.en}-${i}`} delay={i * 60}>
          <li className="relative">
            <span
              className="absolute -left-[1.6rem] top-2 h-2.5 w-2.5 rounded-full border-2 border-bg bg-accent"
              aria-hidden="true"
            />
            <p className="font-mono text-[11px] text-subtle">{pick(role.period)}</p>
            <h3 className="mt-1 text-base font-semibold">{pick(role.title)}</h3>
            <p className="text-sm text-muted">
              {pick(role.org)} &middot; {pick(role.location)}
            </p>
            <ul className="mt-3 space-y-1.5">
              {pick(role.points).map((point) => (
                <li key={point} className="flex gap-2 text-sm leading-relaxed text-muted">
                  <span className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-subtle" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

export function Education() {
  const { t, pick } = useLang();
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="card p-5 lg:col-span-2">
        <p className="font-mono text-[11px] text-subtle">{pick(education.period)}</p>
        <h3 className="mt-1 text-base font-semibold">{pick(education.institution)}</h3>
        <p className="mt-1 text-sm text-muted">{pick(education.degree)}</p>

        <h4 className="mt-5 font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
          {t('education.coursework')}
        </h4>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {pick(education.coursework).map((c) => (
            <li key={c} className="chip">
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="card h-fit p-5">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.15em] text-accent">
          {t('education.languages')}
        </h3>
        <dl className="mt-3 space-y-3">
          {languages.map((l) => (
            <div key={l.name.en}>
              <dt className="text-sm font-medium">{pick(l.name)}</dt>
              <dd className="text-sm leading-relaxed text-muted">{pick(l.level)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export function Contact() {
  const { t, pick } = useLang();
  const [copied, setCopied] = useState(false);

  const copyPitch = async () => {
    try {
      await navigator.clipboard.writeText(pick(profile.pitch));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the email link below still works.
    }
  };

  return (
    <div className="card relative overflow-hidden p-8 sm:p-10">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t('contact.title')}</h2>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{pick(profile.status)}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a href={`mailto:${profile.email}`} className="btn btn-primary">
            <Mail />
            {profile.email}
          </a>
          <button type="button" onClick={copyPitch} className="btn btn-ghost">
            {copied ? <Check /> : null}
            {copied ? t('contact.copied') : t('contact.copyPitch')}
          </button>
        </div>

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] text-muted">
          <li>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 hover:text-fg"
            >
              <GitHub className="h-3.5 w-3.5" />
              {profile.githubHandle}
            </a>
          </li>
          <li>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 hover:text-fg"
            >
              <LinkedIn className="h-3.5 w-3.5" />
              {profile.linkedinHandle}
            </a>
          </li>
          <li>{pick(profile.location)}</li>
        </ul>
      </div>
    </div>
  );
}
