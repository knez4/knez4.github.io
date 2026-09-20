import { Contact, Education, Experience, Skills } from '../components/Sections';
import { Hero } from '../components/Hero';
import { Projects } from '../components/Projects';
import { SchemaDiagram } from '../components/SchemaDiagram';
import { SectionHeading } from '../components/SectionHeading';
import { profile } from '../data/profile';
import { useHead } from '../lib/useHead';
import { useLang } from '../lib/useLang';

export default function Home() {
  const { t, pick, lang } = useLang();

  useHead({
    title: `${profile.name} — ${pick(profile.role)}`,
    description: pick(profile.summary).slice(0, 300),
    canonical: `${profile.siteUrl}/`,
  });

  return (
    <>
      <Hero />

      <section id="projects" className="scroll-mt-20 border-t border-line py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow={t('projects.eyebrow')} title={t('projects.title')} />
          <Projects />
        </div>
      </section>

      <section id="schema" className="relative scroll-mt-20 overflow-hidden border-t border-line bg-surface-2/40 py-16 sm:py-20">
        <div className="pointer-events-none absolute inset-0 grid-texture" aria-hidden="true" />
        <div className="container-page relative">
          <SectionHeading eyebrow={t('schema.eyebrow')} title={t('schema.title')} lead={t('schema.lead')} />
          <SchemaDiagram />
        </div>
      </section>

      <section id="skills" className="scroll-mt-20 border-t border-line py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow={t('skills.eyebrow')} title={t('skills.title')} />
          <Skills />
        </div>
      </section>

      <section id="experience" className="scroll-mt-20 border-t border-line bg-surface-2/40 py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow={t('experience.eyebrow')} title={t('experience.title')} />
          <Experience />
        </div>
      </section>

      <section id="education" className="scroll-mt-20 border-t border-line py-16 sm:py-20">
        <div className="container-page">
          <SectionHeading eyebrow={t('education.eyebrow')} title={t('education.title')} />
          <Education />
        </div>
      </section>

      <section id="contact" className="scroll-mt-20 border-t border-line py-16 sm:py-20" lang={lang}>
        <div className="container-page">
          <Contact />
        </div>
      </section>
    </>
  );
}
