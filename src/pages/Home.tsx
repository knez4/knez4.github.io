import { Contact, Education, Experience, Freelance, Skills } from '../components/Sections';
import { useContext } from 'react';
import { Hero, Marquee } from '../components/Hero';
import { IntroReady } from '../components/Stage';
import { Projects } from '../components/Projects';
import { SchemaDiagram } from '../components/SchemaDiagram';
import { SectionHeading } from '../components/SectionHeading';
import { profile } from '../data/profile';
import { useHead } from '../lib/useHead';
import { useLang } from '../lib/useLang';

export default function Home() {
  const { t, pick, lang } = useLang();
  const ready = useContext(IntroReady);

  useHead({
    // `role` now carries its own em dash ("... student — databases and backend"),
    // so joining with another one gave the tab and the search result two of them.
    title: `${profile.name} · ${pick(profile.role)}`,
    description: pick(profile.summary).slice(0, 300),
    canonical: `${profile.siteUrl}/`,
  });

  return (
    <>
      <Hero ready={ready} />
      <Marquee
        items={
          lang === 'sr'
            ? ['Web dizajn', 'Automatizacija', 'Baze podataka', 'PostgreSQL', 'Python']
            : ['Web design', 'Automation', 'Databases', 'PostgreSQL', 'Python']
        }
      />

      <section id="projects" className="scroll-mt-20 py-16 sm:py-24 lg:py-32">
        <div className="container-page">
          <SectionHeading index="01" eyebrow={t('projects.eyebrow')} title={t('projects.title')} />
          <Projects />
        </div>
      </section>

      <section id="schema" className="relative scroll-mt-20 overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="pointer-events-none absolute inset-0 grid-texture opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-60 top-0 h-[56rem] w-[56rem] bg-[radial-gradient(closest-side,rgb(124_77_255/0.12),transparent)]" aria-hidden="true" />
        <div className="container-page relative">
          <SectionHeading index="02" eyebrow={t('schema.eyebrow')} title={t('schema.title')} lead={t('schema.lead')} />
          <SchemaDiagram />
        </div>
      </section>

      <section id="skills" className="scroll-mt-20 py-16 sm:py-24 lg:py-32">
        <div className="container-page">
          <SectionHeading index="03" eyebrow={t('skills.eyebrow')} title={t('skills.title')} />
          <Skills />
        </div>
      </section>

      <Marquee
        reverse
        items={
          lang === 'sr'
            ? ['Pozitivan', 'Timski igrač', 'Košarka', 'Rado pomažem']
            : ['Positive', 'Team player', 'Basketball', 'Happy to help']
        }
      />

      <section id="experience" className="scroll-mt-20 py-16 sm:py-24 lg:py-32">
        <div className="container-page">
          <SectionHeading index="04" eyebrow={t('experience.eyebrow')} title={t('experience.title')} />
          <Experience />
        </div>
      </section>

      <section id="education" className="scroll-mt-20 pb-16 sm:pb-24 lg:pb-32">
        <div className="container-page">
          <SectionHeading index="05" eyebrow={t('education.eyebrow')} title={t('education.title')} />
          <Education />
        </div>
      </section>

      <section id="freelance" className="scroll-mt-20 border-t border-fg/10 py-16 sm:py-24 lg:py-32">
        <div className="container-page">
          <SectionHeading index="06" eyebrow={t('freelance.eyebrow')} title={t('freelance.title')} lead={t('freelance.lead')} />
          <Freelance />
        </div>
      </section>

      <section id="contact" className="relative scroll-mt-20 overflow-hidden py-16 sm:py-24 lg:py-32" lang={lang}>
        <div className="pointer-events-none absolute -right-60 -bottom-40 h-[60rem] w-[60rem] bg-[radial-gradient(closest-side,rgb(124_77_255/0.18),transparent)]" aria-hidden="true" />
        <div className="container-page relative">
          <Contact />
        </div>
      </section>
    </>
  );
}
