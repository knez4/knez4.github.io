import { useContext } from 'react';
import { Hero, Marquee } from '../components/Hero';
import { About, Faq, Services, TechDetails, Work } from '../components/Plain';
import { Process } from '../components/Process';
import { Contact } from '../components/Sections';
import { SectionHeading } from '../components/SectionHeading';
import { IntroReady } from '../components/Stage';
import { profile } from '../data/profile';
import { useHead } from '../lib/useHead';
import { useLang } from '../lib/useLang';

/**
 * Order (November 2026): what he does with the proof beside it, the work as an
 * index, how working together goes, who he is, the questions people ask, and then,
 * folded, the technical depth for employers. One action throughout: "Javi se".
 *
 * The page answers three things in order: what he does, the proof, how to hire him.
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

      <section id="services" className="scroll-mt-20 py-16 sm:py-24 lg:py-28">
        <div className="container-page">
          <SectionHeading title={t('services.title')} />
          <Services />
        </div>
      </section>

      <section id="projects" className="scroll-mt-20 border-t border-fg/10 py-16 sm:py-24 lg:py-28">
        <div className="container-page">
          <SectionHeading title={t('work.title')} />
          <Work />
        </div>
      </section>

      <section id="process" className="relative scroll-mt-20 overflow-hidden py-16 sm:py-24 lg:py-28">
        <div className="pointer-events-none absolute -left-60 top-0 h-[56rem] w-[56rem] bg-[radial-gradient(closest-side,rgb(124_77_255/0.1),transparent)]" aria-hidden="true" />
        <div className="container-page relative">
          <SectionHeading title={t('process.title')} />
          <Process />
        </div>
      </section>

      <section id="about" className="scroll-mt-20 border-t border-fg/10 py-16 sm:py-24 lg:py-28">
        <div className="container-page">
          <SectionHeading title={t('about.title')} />
          <About />
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 py-16 sm:py-24 lg:py-28">
        <div className="container-page">
          <SectionHeading title={t('faq.title')} />
          <Faq />
        </div>
      </section>

      <section id="tech" className="scroll-mt-20 border-t border-fg/10 py-16 sm:py-24 lg:py-28">
        <div className="container-page">
          <SectionHeading title={t('tech.title')} lead={t('tech.lead')} />
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
