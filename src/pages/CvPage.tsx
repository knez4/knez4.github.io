import { Download, Printer } from '../components/icons';
import { cvProjects } from '../data/projects';
import { education } from '../data/education';
import { experience, type Role } from '../data/experience';
import { languages, profile } from '../data/profile';
import { skillsAsLines } from '../data/skills';
import { useHead } from '../lib/useHead';
import { useLang } from '../lib/useLang';
import { privateContact } from '../lib/privateContact';

/**
 * Consecutive roles that share an org (FD Organization's two roles) print under
 * one header instead of repeating the org name once per role, which is what a
 * recruiter expects from "two roles, one employer" rather than two employers.
 */
function groupByOrg(roles: Role[]) {
  const groups: {
    org: Role['org'];
    location: Role['location'];
    orgPeriod?: Role['orgPeriod'];
    roles: Role[];
  }[] = [];
  for (const role of roles) {
    const last = groups[groups.length - 1];
    if (last && last.org.en === role.org.en) {
      last.roles.push(role);
      last.orgPeriod ??= role.orgPeriod;
    } else {
      groups.push({ org: role.org, location: role.location, orgPeriod: role.orgPeriod, roles: [role] });
    }
  }
  return groups;
}

/**
 * One page, one column, no tables, no icons, no text boxes.
 *
 * Every one of those is deliberate. Applicant tracking systems scramble
 * multi-column layouts, skip text boxes entirely, and drop anything in a
 * header or footer element, which is why the contact line sits in the body.
 *
 * How many bullets each entry gets is tuned so the sheet stays on one page.
 */
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
    <section className="cv-section mt-[7px]">
      <h2 className="border-b border-line pb-[2px] text-cv-base font-bold uppercase tracking-[0.08em]">
        {title}
      </h2>
      <div className="mt-1">{children}</div>
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
                   sm:p-[14mm] print:rounded-none print:border-0 print:p-0 print:shadow-none"
        lang={lang}
      >
        {/* Name and contact sit in the document body, never in a <header> element. */}
        {/*
          The portrait sits beside the header rather than above it, sized to the
          height the name, role and two contact lines already occupy. That way it
          costs no vertical space on a sheet with about one line to spare, and the
          text still runs top to bottom in one column for anything reading the
          text layer. Serbian employers expect a photo; international ones often
          ask for none, which is the one reason to take it back out.
        */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
        <h1 className="text-[22px] font-bold leading-tight tracking-tight">{profile.name}</h1>
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
                {i > 0 && ' | '}
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
            className="h-[84px] w-[84px] shrink-0 rounded-sm object-cover"
          />
        </div>

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
          </div>
          {/* Secondary school gets one line, not the two the degree gets. */}
          <p className="text-cv-sm leading-[1.3]">
            {pick(education.secondary.institution)}, {pick(education.secondary.degree)}
            <span className="text-muted">
              {' '}
              | {pick(education.secondary.location)} | {pick(education.secondary.period)}
            </span>
          </p>
        </Section>

        <Section title={t('cv.projects')}>
          <div className="space-y-[3px]">
            {cvProjects.map((p, i) => (
              <div key={p.id} className="cv-entry">
                <p className="text-cv-base font-semibold leading-tight">
                  {pick(p.title)}
                  <span className="font-normal text-muted"> | {p.year}</span>
                </p>
                <p className="text-cv-xs italic text-muted">{p.tech.slice(0, 7).join(', ')}</p>
                {p.repoUrl ? (
                  <p className="text-cv-xs">
                    <a href={p.repoUrl} className="underline decoration-dotted underline-offset-2">
                      {p.repoUrl.replace('https://', '')}
                    </a>
                  </p>
                ) : p.repoNote ? (
                  <p className="text-cv-xs text-muted">{pick(p.repoNote)}</p>
                ) : null}
                <Bullets items={pick(p.highlights).slice(0, BULLETS_PER_PROJECT[i] ?? 3)} />
              </div>
            ))}
          </div>
        </Section>

        <Section title={t('cv.experience')}>
          <div className="space-y-[3px]">
            {groupByOrg(experience).map((group, gi) =>
              group.roles.length > 1 ? (
                <div key={gi} className="cv-entry">
                  <p className="text-cv-base font-semibold leading-tight">
                    {pick(group.org)}
                    <span className="font-normal text-muted">
                      {' '}
                      | {pick(group.location)}
                      {group.orgPeriod ? ` | ${pick(group.orgPeriod)}` : ''}
                    </span>
                  </p>
                  {group.roles.map((role, i) => (
                    <div key={i} className="mt-0.5">
                      <p className="text-cv-sm font-semibold leading-tight">
                        {pick(role.title)}
                        <span className="font-normal text-muted"> | {pick(role.period)}</span>
                      </p>
                      <Bullets
                        items={pick(role.points).slice(0, BULLETS_PER_ROLE[experience.indexOf(role)] ?? 2)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div key={gi} className="cv-entry">
                  <p className="text-cv-base font-semibold leading-tight">
                    {pick(group.roles[0].title)}
                    <span className="font-normal text-muted">
                      {' '}
                      | {pick(group.roles[0].org)} | {pick(group.roles[0].location)} | {pick(group.roles[0].period)}
                    </span>
                  </p>
                  {group.roles[0].repos ? (
                    <p className="text-cv-xs">
                      {group.roles[0].repos.map((repo, i) => (
                        <span key={repo.url}>
                          {i > 0 && ' | '}
                          <a href={repo.url} className="underline decoration-dotted underline-offset-2">
                            {repo.label}
                          </a>
                        </span>
                      ))}
                    </p>
                  ) : null}
                  <Bullets
                    items={pick(group.roles[0].points).slice(
                      0,
                      BULLETS_PER_ROLE[experience.indexOf(group.roles[0])] ?? 2,
                    )}
                  />
                </div>
              ),
            )}
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
