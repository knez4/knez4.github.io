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
/** The separator he uses throughout, instead of a pipe. */
const DOT = '·';

const BULLETS_PER_PROJECT = [4, 3];
/**
 * Per role, in the order of `experience`. Freelance shows two: the client sites
 * and the reporting tool, which are the paid technical work and carry the page.
 * DigiCon keeps its one bullet. It was dropped for a while to buy space, which
 * left "IT Team Lead, DigiCon" standing alone: a title that reads like he led
 * software development, with nothing under it to say he did not. A misleading
 * line costs more than the space it saves.
 * Its third bullet, the Illustrator reporting engagement, is real and paid but
 * it is design work on a technical CV, and the tool that replaced it says more.
 * It still appears on the site, where there is room for it.
 *
 * A third Projects entry for the reporting tool was measured and does not fit:
 * the block costs 88px against a 21px margin, which is five bullets from the
 * rest of the sheet. One line in Experience is the same claim for a fifth of
 * the space, and Experience is where delivered client work belongs anyway.
 */
const BULLETS_PER_ROLE = [2, 1, 1];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="cv-section mt-[10px]">
      <h2 className="border-b border-line pb-[2px] text-cv-base font-bold uppercase tracking-[0.13em] text-accent">
        {title}
      </h2>
      <div className="mt-[1px]">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-[2px] space-y-[1px]">
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
                   sm:p-[12mm] print:rounded-none print:border-0 print:p-0 print:shadow-none"
        lang={lang}
      >
        {/* Name and contact sit in the document body, never in a <header> element. */}
        {/*
          The portrait sits beside the header rather than above it, so the text
          still runs top to bottom in one column for anything reading the text
          layer. 89x115px is 23.5 x 30.5 mm at print scale, in the 35:45 ratio a
          CV photo conventionally uses. It is short of the 35 x 45 mm standard,
          which is a passport convention carried into Europass rather than a
          hiring rule; the full size would cost two or three lines of content and
          buys nothing a reader can use. It runs about 28px past the header, which
          the sheet has room for. Serbian employers expect a photo; international
          ones often ask for none, which is the one reason to take it back out.
        */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
        <h1 className="text-[26.5px] font-bold leading-tight tracking-tight">{profile.name}</h1>
        <p className="mt-0.5 text-cv-base text-muted">{pick(profile.role)}</p>
        {/*
          Two deliberate lines: how to reach him, then where to read his code.
          As one run it wrapped anyway and orphaned the last item on a line of
          its own, behind a leading pipe, which reads as a broken document and
          gives a parser a fragment it can misattribute. Same height, on purpose.
        */}
        {(() => {
          const phone = privateContact().phone;
          const reach: { text: string; href?: string }[] = [
            ...(phone ? [{ text: phone, href: `tel:${phone.replace(/[^\d+]/g, '')}` }] : []),
            { text: profile.email, href: `mailto:${profile.email}` },
            { text: pick(profile.location) },
          ];
          const links: { text: string; href?: string }[] = [
            { text: profile.linkedinHandle, href: profile.linkedin },
            { text: 'github.com/knez4', href: profile.github },
            { text: 'knez4.github.io', href: profile.siteUrl },
          ];
          const render = (items: { text: string; href?: string }[]) =>
            items.map((item, i) => (
              <span key={item.text}>
                {i > 0 && ` ${DOT} `}
                {item.href ? (
                  <a href={item.href} className="underline decoration-dotted underline-offset-2">
                    {item.text}
                  </a>
                ) : (
                  item.text
                )}
              </span>
            ));
          return (
            <>
              <p className="mt-1 text-cv-xs leading-snug">{render(reach)}</p>
              <p className="text-cv-xs leading-snug">{render(links)}</p>
            </>
          );
        })()}
          </div>
          <img
            src="/veljko.jpg"
            alt={profile.name}
            className="h-[170px] w-[132px] shrink-0 rounded-sm object-cover"
          />
        </div>

        <Section title={t('cv.summary')}>
          <p className="text-cv-sm leading-[1.3]">{pick(profile.summary)}</p>
        </Section>

        <Section title={t('cv.skills')}>
          <div className="space-y-[2px]">
            {skillsAsLines(lang).map((line) => (
              <p key={line.label} className="text-cv-sm leading-[1.3]">
                <span className="font-semibold text-accent">{line.label}:</span> {line.value}
              </p>
            ))}
          </div>
        </Section>

        {/*
          Section order is his: paid work before projects, education and
          languages together, the student organization last under its own
          heading so a reader looking for professional experience does not have
          to sort it out of the Experience block.
        */}
        <Section title={t('cv.experience')}>
          <div className="space-y-[3px]">
            {experience
              .filter((role) => role.kind !== 'student')
              .map((role, i) => (
                <div key={i} className="cv-entry">
                  <p className="text-cv-base font-semibold leading-tight">{pick(role.title)}</p>
                  <p className="text-cv-xs text-muted">
                    {pick(role.org)} {DOT} {pick(role.location)} {DOT} {pick(role.period)}
                  </p>
                  <p className="text-cv-xs text-muted">
                    {role.tech ? `${role.tech.join(', ')} ${DOT} ` : ''}
                    {role.repos?.map((repo, j) => (
                      <span key={repo.url}>
                        {j > 0 && ` ${DOT} `}
                        <a href={repo.url} className="underline decoration-dotted underline-offset-2">
                          {repo.label}
                        </a>
                      </span>
                    ))}
                  </p>
                  <Bullets items={pick(role.points).slice(0, BULLETS_PER_ROLE[i] ?? 2)} />
                </div>
              ))}
          </div>
        </Section>

        <Section title={t('cv.projects')}>
          <div className="space-y-[3px]">
            {cvProjects.map((p, i) => (
              <div key={p.id} className="cv-entry">
                <p className="text-cv-base font-semibold leading-tight">
                  {pick(p.title)}
                  <span className="font-normal text-muted"> {DOT} {p.year}</span>
                </p>
                {/* Stack and repo share a line, the way he laid it out. */}
                <p className="text-cv-xs text-muted">
                  {p.tech.slice(0, 7).join(', ')} {DOT}{' '}
                  {p.repoUrl ? (
                    <a href={p.repoUrl} className="underline decoration-dotted underline-offset-2">
                      {p.repoUrl.replace('https://', '')}
                    </a>
                  ) : p.repoNote ? (
                    pick(p.repoNote)
                  ) : null}
                </p>
                <Bullets items={pick(p.highlights).slice(0, BULLETS_PER_PROJECT[i] ?? 3)} />
              </div>
            ))}
          </div>
        </Section>

        <Section title={t('cv.educationAndLanguages')}>
          <div className="cv-entry">
            <p className="text-cv-sm font-semibold leading-[1.3]">
              {pick(education.institution)}
              <span className="font-normal text-muted">
                {' '}
                {DOT} {pick(education.location)} {DOT} {pick(education.period)}
              </span>
            </p>
            <p className="text-cv-sm leading-[1.3]">{pick(education.degree)}</p>
          </div>
          {/* Secondary school gets one line, not the two the degree gets. */}
          <p className="text-cv-sm leading-[1.3]">
            <span className="font-semibold">{pick(education.secondary.institution)}</span>
            <span className="text-muted">
              {' '}
              {DOT} {pick(education.secondary.degree)} {DOT} {pick(education.secondary.location)}{' '}
              {DOT} {pick(education.secondary.period)}
            </span>
          </p>
          <p className="text-cv-sm leading-[1.3]">
            <span className="font-semibold">{t('cv.languages')}</span>
            <span className="text-muted">
              {languages.map((l) => ` ${DOT} ${pick(l.name)} ${pick(l.level)}`).join('')}
            </span>
          </p>
        </Section>

        <Section title={t('cv.studentActivities')}>
          {(() => {
            const student = experience.filter((role) => role.kind === 'student');
            if (student.length === 0) return null;
            return (
              <div className="cv-entry">
                <p className="text-cv-base font-semibold leading-tight">{pick(student[0].org)}</p>
                <p className="text-cv-xs text-muted">
                  {t('cv.studentOrg')} {DOT} {pick(student[0].location)}
                  {student[0].orgPeriod ? ` ${DOT} ${pick(student[0].orgPeriod)}` : ''}
                </p>
                {student.map((role, i) => {
                  // Same rule as everywhere else on the sheet: the thing you
                  // scan for is bold, the rest of the line is grey. Here that
                  // is the programme name and its year.
                  const [anchor, ...rest] = (
                    role.compact ? pick(role.compact) : pick(role.title)
                  ).split(` ${DOT} `);
                  return (
                    <p key={i} className="mt-[2px] text-cv-sm leading-[1.3]">
                      <span className="font-semibold">{anchor}</span>
                      {rest.length > 0 && (
                        <span className="text-muted"> {DOT} {rest.join(` ${DOT} `)}</span>
                      )}
                    </p>
                  );
                })}
              </div>
            );
          })()}
        </Section>
      </article>
    </div>
  );
}
