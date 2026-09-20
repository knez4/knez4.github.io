import { Download, Printer } from '../components/icons';
import { cvProjects } from '../data/projects';
import { education } from '../data/education';
import { experience } from '../data/experience';
import { languages, profile } from '../data/profile';
import { skillsAsLines } from '../data/skills';
import { useHead } from '../lib/useHead';
import { useLang } from '../lib/useLang';
import { privateContact } from '../lib/privateContact';

/**
 * One page, one column, no tables, no icons, no text boxes.
 *
 * Every one of those is deliberate. Applicant tracking systems scramble
 * multi-column layouts, skip text boxes entirely, and drop anything in a
 * header or footer element, which is why the contact line sits in the body.
 *
 * How many bullets each entry gets is tuned so the sheet stays on one page.
 */
const BULLETS_PER_PROJECT = [3, 3, 2];
const BULLETS_PER_ROLE = 2;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="cv-section mt-2">
      <h2 className="border-b border-line pb-[2px] text-cv-base font-bold uppercase tracking-[0.08em]">
        {title}
      </h2>
      <div className="mt-1.5">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-[3px] space-y-[2px]">
      {items.map((item) => (
        <li key={item} className="flex gap-1.5 text-cv-sm leading-[1.3]">
          <span aria-hidden="true">&bull;</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CvPage() {
  const { t, pick, lang } = useLang();

  useHead({
    title: `${t('cv.title')} — ${profile.name}`,
    description: pick(profile.summary).slice(0, 300),
    canonical: `${profile.siteUrl}/cv/`,
  });

  return (
    <div className="bg-surface-2 py-8 print:bg-white print:py-0">
      <div className="no-print container-page mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">{t('cv.title')}</h1>
        <div className="flex flex-wrap items-center gap-2">
          {/* Rendered by `npm run cv` in the language currently selected. */}
          <a
            href={`/Veljko_Knezevic_CV_${lang.toUpperCase()}.pdf`}
            download
            className="btn btn-primary"
          >
            <Download />
            {t('hero.downloadCv')}
          </a>
          <button type="button" onClick={() => window.print()} className="btn btn-ghost">
            <Printer />
            {t('cv.print')}
          </button>
        </div>
      </div>

      <article
        className="cv-sheet mx-auto w-full max-w-[210mm] rounded-lg border border-line p-5 shadow-sm
                   sm:p-[14mm] print:rounded-none print:border-0 print:p-0 print:shadow-none"
        lang={lang}
      >
        {/* Name and contact sit in the document body, never in a <header> element. */}
        <h1 className="text-[19px] font-bold leading-tight tracking-tight">{profile.name}</h1>
        <p className="mt-0.5 text-cv-base text-muted">{pick(profile.role)}</p>
        <p className="mt-1 text-cv-xs leading-relaxed">
          {[
            pick(profile.location),
            privateContact().phone,
            profile.email,
            profile.linkedin.replace('https://www.', ''),
            'github.com/knez4',
          ]
            .filter(Boolean)
            .join(' | ')}
        </p>

        <Section title={t('cv.summary')}>
          <p className="text-cv-sm leading-[1.3]">{pick(profile.summary)}</p>
        </Section>

        <Section title={t('cv.skills')}>
          <div className="space-y-[2px]">
            {skillsAsLines(lang).map((line) => (
              <p key={line.label} className="text-cv-sm leading-[1.3]">
                <span className="font-semibold">{line.label}:</span> {line.value}
              </p>
            ))}
          </div>
        </Section>

        <Section title={t('cv.projects')}>
          <div className="space-y-1.5">
            {cvProjects.map((p, i) => (
              <div key={p.id} className="cv-entry">
                <p className="text-cv-base font-semibold leading-tight">
                  {pick(p.title)}
                  <span className="font-normal text-muted"> | {p.year}</span>
                </p>
                <p className="text-cv-xs italic text-muted">{p.tech.join(', ')}</p>
                <Bullets items={pick(p.highlights).slice(0, BULLETS_PER_PROJECT[i] ?? 3)} />
              </div>
            ))}
          </div>
        </Section>

        <Section title={t('cv.experience')}>
          <div className="space-y-1.5">
            {experience.map((role, i) => (
              <div key={`${role.title.en}-${i}`} className="cv-entry">
                <p className="text-cv-base font-semibold leading-tight">
                  {pick(role.title)}
                  <span className="font-normal text-muted">
                    {' '}
                    | {pick(role.org)} | {pick(role.location)} | {pick(role.period)}
                  </span>
                </p>
                <Bullets items={pick(role.points).slice(0, BULLETS_PER_ROLE)} />
              </div>
            ))}
          </div>
        </Section>

        <Section title={t('cv.education')}>
          <div className="cv-entry">
            <p className="text-cv-base font-semibold leading-tight">
              {pick(education.institution)}
              <span className="font-normal text-muted">
                {' '}
                | {pick(education.location)} | {pick(education.period)}
              </span>
            </p>
            <p className="text-cv-sm leading-[1.3]">{pick(education.degree)}</p>
            <p className="mt-[3px] text-cv-sm leading-[1.3]">
              <span className="font-semibold">{t('cv.coursework')}:</span>{' '}
              {pick(education.coursework).slice(0, 6).join(', ')}
            </p>
          </div>
        </Section>

        <Section title={t('cv.languages')}>
          <p className="text-cv-sm leading-[1.3]">
            {languages.map((l) => `${pick(l.name)}: ${pick(l.level)}`).join('. ')}.
          </p>
        </Section>
      </article>
    </div>
  );
}
