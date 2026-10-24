import { useContext } from 'react';
import { Hero, Marquee } from '../components/Hero';
import { About, Process, Services, TechDetails, Work } from '../components/Plain';
import { Contact } from '../components/Sections';
import { SectionHeading } from '../components/SectionHeading';
import { IntroReady } from '../components/Stage';
import { profile } from '../data/profile';
import { useHead } from '../lib/useHead';
import { useLang } from '../lib/useLang';

/**
 * Order follows a visitor who is not from IT (20 October 2026): who he is, what he
 * can do for them, how working together goes, who he is as a person, proof, and
 * then, folded, the technical depth for employers and developers. One action
 * throughout: "Javi se".
 */
export default function Home() {
  const { t, lang } = useLang();
  const ready = useContext(IntroReady);

  useHead({
    title: t('seo.title'),
    description: t('seo.description'),
    canonical: `${profile.siteUrl}/`,
  });

  return (
    <>
      <Hero ready={ready} />
      <Marquee
        items={
          lang === 'sr'
            ? ['Sajtovi', 'Automatizacija', 'Baze podataka', 'Beograd']
            : ['Websites', 'Automation', 'Databases', 'Belgrade']
        }
      />

      <section id="services" className="scroll-mt-20 py-16 sm:py-24 lg:py-32">
        <div className="container-page">
          <SectionHeading index="01" eyebrow={t('services.eyebrow')} title={t('services.title')} />
          <Services />
        </div>
      </section>

      <section id="process" className="relative scroll-mt-20 overflow-hidden border-t border-fg/10 py-16 sm:py-24 lg:py-32">
        <div className="pointer-events-none absolute -left-60 top-0 h-[56rem] w-[56rem] bg-[radial-gradient(closest-side,rgb(124_77_255/0.1),transparent)]" aria-hidden="true" />
        <div className="container-page relative">
          <SectionHeading index="02" eyebrow={t('process.eyebrow')} title={t('process.title')} />
          <Process />
        </div>
      </section>

      <section id="about" className="scroll-mt-20 py-16 sm:py-24 lg:py-32">
        <div className="container-page">
          <SectionHeading index="03" eyebrow={t('about.eyebrow')} title={t('about.title')} />
          <About />
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

      <section id="projects" className="scroll-mt-20 py-16 sm:py-24 lg:py-32">
        <div className="container-page">
          <SectionHeading index="04" eyebrow={t('work.eyebrow')} title={t('work.title')} />
          <Work />
        </div>
      </section>

      <section id="tech" className="scroll-mt-20 border-t border-fg/10 py-16 sm:py-24 lg:py-32">
        <div className="container-page">
          <SectionHeading index="05" eyebrow={t('tech.eyebrow')} title={t('tech.title')} lead={t('tech.lead')} />
          <TechDetails />
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
