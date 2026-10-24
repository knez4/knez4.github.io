import { education } from '../data/education';
import { experience } from '../data/experience';
import { languages, profile } from '../data/profile';
import { pickItem, skillGroups } from '../data/skills';
import { useLang } from '../lib/useLang';
import { GitHub, LinkedIn, Mail } from './icons';
import { Ball } from './Logo';
import { Reveal, SplitText } from './Reveal';

/**
 * A mailto link with the subject and a short template already written, so the
 * button leads somewhere specific instead of to an empty message.
 */
export function mailto(subject: string, body: string) {
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function Skills() {
  const { t, pick, lang } = useLang();
  const applied = skillGroups.filter((g) => g.kind === 'applied');
  const academic = skillGroups.filter((g) => g.kind === 'academic');

  return (
    <div>
      {/* Two to a row on phones; the first and last groups are the longest, so they span. */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {applied.map((g, i) => (
          <Reveal
            key={g.label.en}
            delay={i * 70}
            className={
              i === 0
                ? 'col-span-2 lg:col-span-1 lg:row-span-2'
                : i === applied.length - 1
                  ? 'col-span-2 sm:col-span-1'
                  : ''
            }
          >
            <div className="panel spot flex h-full flex-col p-4 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent sm:text-[11px] sm:tracking-[0.2em]">{pick(g.label)}</h3>
                <span className="font-display text-[2rem] leading-none text-fg/10 sm:text-[3.5rem] sm:leading-[0.82]" aria-hidden="true">
                  {String(g.items.length).padStart(2, '0')}
                </span>
              </div>
              <ul className={'mt-auto flex flex-wrap gap-1.5 pt-4 sm:gap-2 sm:pt-6 ' + (i === 0 ? 'lg:gap-2.5' : '')}>
                {g.items.map((item) => (
                  <li
                    key={pickItem(item, 'en')}
                    className={
                      'rounded-full border border-fg/10 px-2.5 py-1 text-fg/90 transition-colors hover:border-accent hover:text-fg sm:px-3 sm:py-1.5 ' +
                      (i === 0 ? 'text-[13px] sm:text-[15px]' : 'text-[12px] sm:text-[13px]')
                    }
                  >
                    {pickItem(item, lang)}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {/* The line between "built with it" and "studied it" is the point of this section. Keep it. */}
      <div className="mt-10 grid gap-6 border-t border-dashed border-fg/15 pt-6 sm:mt-14 sm:gap-8 sm:pt-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <p className="text-sm leading-relaxed text-subtle">{t('skills.appliedNote')}</p>
        <div className="space-y-5">
          {academic.map((g) => (
            <div key={g.label.en}>
              <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">{pick(g.label)}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <li key={pickItem(item, 'en')} className="rounded-full border border-dashed border-fg/15 px-3 py-1 text-[13px] text-muted">
                    {pickItem(item, lang)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Experience() {
  const { pick } = useLang();
  return (
    <ol>
      {experience.map((role, i) => {
        const current = /present|danas/.test(role.period.en + role.period.sr);
        return (
          <Reveal
            as="li"
            key={`${role.title.en}-${i}`}
            delay={i * 60}
            className="group grid gap-3 border-t border-fg/10 py-7 last:border-b sm:gap-4 sm:py-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10"
          >
              <div>
                <p className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-subtle">
                  {current ? (
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                    </span>
                  ) : null}
                  {pick(role.period)}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {pick(role.org)}
                  <br />
                  {pick(role.location)}
                </p>
              </div>
              <div>
                <h3 className="font-display text-[clamp(1.7rem,3.6vw,3.1rem)] text-fg transition-colors duration-500 group-hover:text-accent">
                  {pick(role.title)}
                </h3>
                <ul className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
                  {pick(role.points).map((point) => (
                    <li key={point} className="flex gap-3 text-[14px] leading-relaxed text-muted sm:text-[15px]">
                      <span className="mt-[0.7rem] h-px w-4 shrink-0 bg-accent" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
          </Reveal>
        );
      })}
    </ol>
  );
}

export function Education() {
  const { t, pick } = useLang();
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Reveal className="lg:col-span-2">
        <div className="panel spot h-full p-5 sm:p-9">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent">{pick(education.period)}</p>
          <h3 className="font-display mt-4 text-[clamp(2rem,4vw,3.4rem)] text-fg">{pick(education.institution)}</h3>
          <p className="mt-3 text-[15px] text-muted">{pick(education.degree)}</p>
          <div className="mt-8 border-t border-fg/10 pt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{pick(education.secondary.period)}</p>
            <p className="mt-2 font-semibold text-fg">{pick(education.secondary.institution)}</p>
            <p className="text-sm text-muted">{pick(education.secondary.degree)}</p>
          </div>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <div className="panel spot h-full p-5 sm:p-7">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{t('education.languages')}</h3>
          <dl className="mt-6 space-y-5">
            {languages.map((l) => (
              <div key={l.name.en} className="flex items-baseline justify-between gap-4 border-b border-fg/10 pb-4 last:border-0">
                <dt className="text-[17px] font-medium capitalize text-fg">{pick(l.name)}</dt>
                <dd className="font-display text-[2.4rem] text-fg/80">{pick(l.level)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>
    </div>
  );
}

/**
 * The client-facing offer. No diagrams here, by his call: a client wants to see
 * what a site looks like and what automation saves, not how either works.
 * Real screenshots of his two sites, and the one real before/after he has.
 */
export function SitesVisual() {
  const { t } = useLang();
  return (
    <figure>
      <div className="relative pb-10 pr-10 sm:pb-12 sm:pr-14">
        <div className="overflow-hidden rounded-xl border border-fg/10 bg-[#0f0c18] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-1.5 border-b border-fg/10 px-3 py-2" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-fg/20" />
            <span className="h-2 w-2 rounded-full bg-fg/20" />
            <span className="h-2 w-2 rounded-full bg-fg/20" />
          </div>
          <img
            src="/img/work/flekout-desktop.webp"
            srcSet="/img/work/flekout-desktop-600.webp 600w, /img/work/flekout-desktop.webp 1200w"
            sizes="(min-width: 1024px) 40vw, 85vw"
            alt={t('freelance.flekoutAlt')}
            width={1200}
            height={750}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          />
        </div>
        <div
          className="absolute bottom-0 right-0 w-[30%] min-w-[96px] overflow-hidden rounded-[1.1rem] border-[3px] border-[#1b1626]
                     shadow-[0_24px_50px_-16px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                     group-hover:-translate-y-2 group-hover:rotate-[3deg]"
        >
          <img
            src="/img/work/flekout-mobile.webp"
            srcSet="/img/work/flekout-mobile-200.webp 200w, /img/work/flekout-mobile.webp 390w"
            sizes="(min-width: 1024px) 12vw, 28vw"
            alt={t('freelance.flekoutMobileAlt')}
            width={390}
            height={844}
            loading="lazy"
            decoding="async"
            className="block aspect-[390/844] w-full object-cover"
          />
        </div>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
        {t('freelance.sitesCaption')}
        <a
          href="https://flekoutclean.com"
          target="_blank"
          rel="noreferrer noopener"
          className="relative z-10 inline-flex items-center gap-2 text-accent transition-colors hover:text-fg"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#7ee2a8]" aria-hidden="true" />
          flekoutclean.com ↗
        </a>
      </figcaption>
    </figure>
  );
}

function AutomationVisual() {
  const { t } = useLang();
  return (
    <figure>
      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-3 sm:gap-4">
        <div className="rounded-xl border border-fg/10 bg-fg/[0.02] p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">{t('freelance.before')}</p>
          <p className="font-display mt-4 text-[clamp(2.6rem,6vw,4.6rem)] text-fg/35 line-through decoration-[#ff8a8a]/70 decoration-[3px]">
            {t('freelance.beforeVal')}
          </p>
          <p className="mt-2 text-[13px] leading-snug text-subtle">{t('freelance.beforeNote')}</p>
        </div>
        <span className="self-center font-display text-[2rem] text-accent" aria-hidden="true">
          →
        </span>
        <div className="rounded-xl border border-accent/40 bg-accent-strong/15 p-5 shadow-[0_0_60px_-24px_rgba(124,77,255,0.9)]">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">{t('freelance.after')}</p>
          <p className="font-display mt-4 text-[clamp(2.6rem,6vw,4.6rem)] text-fg">{t('freelance.afterVal')}</p>
          <p className="mt-2 text-[13px] leading-snug text-muted">{t('freelance.afterNote')}</p>
        </div>
      </div>
      <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{t('freelance.autoCaption')}</figcaption>
    </figure>
  );
}

/** The secondary audience: people who need a site or an automation. No prices, by his choice. */
export function Freelance() {
  const { t } = useLang();
  const services = [
    { key: 'sites', title: t('freelance.sites'), body: t('freelance.sitesBody'), visual: <SitesVisual /> },
    { key: 'automation', title: t('freelance.automation'), body: t('freelance.automationBody'), visual: <AutomationVisual /> },
  ];

  return (
    <div>
      {/* Both cards share the parent's two rows (visual, then text) through subgrid,
          so the headings line up however tall either visual is. */}
      <div className="grid gap-4 lg:grid-cols-2 lg:grid-rows-[auto_auto]">
        {services.map((s, i) => (
          <Reveal key={s.key} delay={i * 90} className="lg:row-span-2 lg:grid lg:grid-rows-subgrid">
            <article className="panel spot group flex h-full flex-col gap-7 p-5 sm:gap-10 sm:p-9 lg:row-span-2 lg:grid lg:grid-rows-subgrid lg:gap-10">
              <div className="lg:self-center">{s.visual}</div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">0{i + 1}</p>
                <h3 className="font-display mt-3 text-[clamp(2rem,3.6vw,3rem)] text-fg">{s.title}</h3>
                <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">{s.body}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* A face next to the offer (clients want to know who does the work), and a
          button that says exactly what happens next. */}
      <Reveal>
        <div className="mt-4 flex flex-col items-start justify-between gap-6 rounded-[1.25rem] bg-accent-strong p-6 sm:p-9 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* The full-length cut-out, zoomed to head and shoulders inside the circle. The head
                centre sits at 57% across and 15% down the cut-out, hence the offsets. */}
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white/70 bg-[#12091f] sm:h-20 sm:w-20">
              <img
                src="/img/portrait-480.webp"
                alt=""
                width={480}
                height={769}
                loading="lazy"
                decoding="async"
                className="absolute left-[-46%] top-[1%] w-[181%] max-w-none"
              />
            </span>
            <div>
              <p className="font-display text-[clamp(1.7rem,3.4vw,2.8rem)] text-white">{t('freelance.cta')}</p>
              <p className="mt-1 text-[14px] text-white/80">{t('freelance.direct')}</p>
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 lg:items-end">
            <a
              href={mailto(t('freelance.mailSubject'), t('freelance.mailBody'))}
              className="btn-pill shrink-0 bg-white text-[#12091f] before:bg-[#12091f] hover:text-white"
              data-magnetic
            >
              <Mail />
              {t('freelance.ask')}
            </a>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white">{t('contact.reply')}</p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export function Contact() {
  const { t, pick, lang } = useLang();

  return (
    <div className="relative">
      <p className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-subtle">
        <span className="text-accent">({lang === 'sr' ? 'kraj' : 'end'})</span>
        <span>{t('contact.eyebrow')}</span>
        <span className="h-px flex-1 bg-fg/10" aria-hidden="true" />
      </p>

      <h2 className="font-display mt-10 text-[clamp(3.6rem,15vw,15rem)] text-fg" data-cursor="ball">
        <SplitText text={t('contact.big')} step={90} />
        <Ball className="ml-[0.06em] inline-block h-[0.62em] w-[0.62em] align-baseline" />
      </h2>

      {/* The address never wraps: it is sized to fit on one line at every width, and the
          buttons sit on their own row below rather than squeezing it from the side. */}
      {/* One action, the same one as everywhere else on the page. */}
      <div className="mt-12">
        <p className="max-w-xl text-[17px] leading-relaxed text-muted sm:text-[19px]">{t('contact.plainLead')}</p>
        <a
          href={`mailto:${profile.email}`}
          className="draw-line mt-6 inline-block whitespace-nowrap font-display text-[clamp(1.5rem,7.6vw,6.2rem)] text-accent"
          style={{ textTransform: 'none' }}
        >
          {profile.email}
        </a>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href={mailto(t('freelance.mailSubject'), t('freelance.mailBody'))} className="btn-pill btn-pill--solid" data-magnetic>
            <Mail />
            {t('cta.talk')}
          </a>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">{t('contact.reply')}</p>
        </div>
      </div>

      <ul className="mt-14 flex flex-wrap gap-x-10 gap-y-3 border-t border-fg/10 pt-8 font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
        <li>
          <a href={profile.linkedin} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 hover:text-fg">
            <LinkedIn className="h-4 w-4" /> LinkedIn ↗
          </a>
        </li>
        <li>
          <a href={profile.github} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 hover:text-fg">
            <GitHub className="h-4 w-4" /> GitHub ↗
          </a>
        </li>
        <li className="ml-auto">{pick(profile.location)}</li>
      </ul>
    </div>
  );
}
