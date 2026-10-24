import { useLayoutEffect, useRef } from 'react';
import { profile } from '../data/profile';
import { gsap, motionOK } from '../lib/motion';
import { useLang } from '../lib/useLang';
import { ArrowRight } from './icons';
import { Ball } from './Logo';
import { drawSignature, hideSignature, Signature } from './Signature';
import { TalkButton } from './Plain';
import { SqlTerminal } from './SqlTerminal';

const SURNAME = 'KNEŽEVIĆ';

/**
 * The stage: a surname wider than the screen, the portrait standing in front of
 * it, the signature across both, and a plain line saying what he does. Below lg the
 * same pieces stack in reading order.
 */
export function Hero({ ready }: { ready: boolean }) {
  const { t, pick } = useLang();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!motionOK() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.set('[data-a="char"]', { yPercent: 110 });
      // Painted from the start (it is the page's largest image, so its first paint is the LCP);
      // under the intro cover it just settles from a slight zoom.
      gsap.set('[data-a="portrait"]', { scale: 1.08, yPercent: 4 });
      hideSignature(root.current!);
      // Text is moved, never hidden: it sits under the intro cover anyway, and keeping it painted
      // lets the browser record the hero line as the largest paint (LCP) as soon as it renders.
      gsap.set('[data-a="fade"]', { y: 24 });
      gsap.set('[data-a="term"]', { autoAlpha: 0, y: 40, rotateX: 8 });
    }, root);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!ready || !motionOK() || !root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.to('[data-a="char"]', { yPercent: 0, duration: 1.3, stagger: 0.045 })
        .to('[data-a="portrait"]', { scale: 1, yPercent: 0, duration: 1.5 }, 0.15)
        // The signature writes itself letter by letter (see Signature.tsx).
        .add(drawSignature(root.current!), 0.7)
        .to('[data-a="fade"]', { y: 0, duration: 1, stagger: 0.08 }, 0.5)
        .to('[data-a="term"]', { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.2 }, 0.8)

      // Scroll: the surname drifts sideways, the portrait sinks, the signature lifts.
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('[data-p="name"]', { xPercent: -10, ease: 'none', scrollTrigger: st });
      gsap.to('[data-p="portrait"]', { yPercent: 10, ease: 'none', scrollTrigger: st });
      gsap.to('[data-p="sig"]', { yPercent: -60, ease: 'none', scrollTrigger: st });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden lg:h-[100svh] lg:min-h-[720px]"
      aria-labelledby="hero-title"
    >
      {/* Light */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 grid-texture opacity-40" />
        <div className="absolute left-1/2 top-[10%] h-[90vmin] w-[90vmin] -translate-x-1/2 bg-[radial-gradient(closest-side,rgb(124_77_255/0.28),transparent)]" />
      </div>

      <h1 id="hero-title" className="sr-only">
        {profile.name}: {t('hero.plainRole')}
      </h1>

      {/*
        Phones: name, portrait and the intro block share exactly one screen (100svh,
        the height left by the browser's own bars). The portrait takes whatever room
        the rest leaves, so both buttons are on screen on every phone and the next
        section starts below the fold. The surname shares the portrait's cell, set in front of
        him across the lower body: behind him it was hidden, since on a phone the
        photo is nearly as wide as the name. On desktop it stays behind. On desktop the wrapper is display:contents and the
        pieces keep their absolute positions.
      */}
      <div className="grid h-[100svh] min-h-[540px] grid-rows-[minmax(0,1fr)_auto] pb-6 pt-[72px] lg:contents">
      {/* Surname, behind everything */}
      <div
        data-p="name"
        className="pointer-events-none relative z-20 col-start-1 row-start-1 mb-16 self-end select-none px-2 will-change-transform
                   [text-shadow:0_10px_40px_rgba(8,6,14,0.7)] lg:mb-0 lg:[text-shadow:none] lg:absolute lg:inset-x-0 lg:bottom-[5vh] lg:z-0 lg:px-0"
        aria-hidden="true"
      >
        <p className="font-display whitespace-nowrap text-center text-[22vw] text-fg lg:text-[19vw]">
          {[...SURNAME].map((c, i) => (
            <span key={i} className="-mt-[0.22em] inline-block overflow-hidden pb-[0.04em] pt-[0.22em] align-bottom">
              <span data-a="char" className="inline-block">
                {c}
              </span>
            </span>
          ))}
        </p>
      </div>

      {/* Portrait and signature */}
      <div
        className="relative z-10 col-start-1 row-start-1 min-h-0 lg:absolute lg:bottom-0 lg:left-1/2 lg:z-10 lg:mt-0 lg:flex-none
                   lg:-translate-x-1/2"
      >
        <div data-p="portrait" className="relative mx-auto h-full w-fit will-change-transform lg:h-auto" data-cursor="ball">
          <div className="portrait-glow absolute inset-x-[-25%] top-[2%] -z-10 aspect-square" aria-hidden="true" />
          <img
            data-a="portrait"
            src="/img/portrait-800.webp"
            srcSet="/img/portrait-480.webp 480w, /img/portrait-800.webp 800w, /img/portrait-1200.webp 1200w"
            sizes="(min-width: 1024px) 52vh, 62vw"
            width={1410}
            height={2259}
            alt={pick({ en: 'Veljko Knežević, arms crossed', sr: 'Veljko Knežević, prekrštenih ruku' })}
            fetchPriority="high"
            className="block h-full w-auto max-w-[86vw] origin-bottom object-contain object-bottom
                       [mask-image:linear-gradient(to_top,transparent,black_22%)] lg:h-[min(86svh,900px)] lg:max-w-none"
          />
        </div>

        <div
          data-p="sig"
          className="pointer-events-none absolute left-[2%] top-[30%] z-20 sm:left-[14%] will-change-transform [filter:drop-shadow(0_6px_26px_rgba(124,77,255,0.5))]
                     lg:-left-[44%] lg:top-[42%]"
          aria-hidden="true"
        >
          {/* Drawn letters, not text: the font size here only sets the SVG's em scale. */}
          <span data-a="sig" className="block -rotate-[9deg] px-[0.2em] text-[24vw] leading-none text-accent sm:text-[18vw] lg:text-[19vw]">
            <Signature className="block" />
          </span>
        </div>
      </div>

      {/* Left column: who, why, what next */}
      <div className="container-page relative z-20 row-start-2 -mt-12 lg:absolute lg:inset-x-0 lg:top-[15vh] lg:mt-0">
        <div className="max-w-[24rem] xl:max-w-[26rem]">
          <p
            data-a="fade"
            className="inline-flex items-center gap-2 rounded-full border border-fg/12 bg-bg/60 px-3 py-1.5 font-mono
                       text-[11px] text-muted"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7ee2a8] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#7ee2a8]" />
            </span>
            {t('hero.available')}
          </p>

          {/* What he does, in a sentence anyone understands (20 October 2026). Set in the
              text face rather than the condensed display caps: it is a sentence, not a label. */}
          <p data-a="fade" className="mt-4 text-[clamp(1.45rem,6.2vw,2.3rem)] font-semibold leading-[1.15] tracking-tight text-fg">
            {t('hero.plainRole')}
          </p>
          <p data-a="fade" className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            {t('hero.plainSub')}
          </p>

          {/* Compact on phones so both buttons share one row. */}
          <div data-a="fade" className="mt-6 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
            <TalkButton className="max-sm:!gap-2 max-sm:!px-4 max-sm:!py-3 max-sm:!text-[11px]" />
            <a href="#services" className="btn-pill btn-pill--ghost max-sm:!gap-2 max-sm:!px-4 max-sm:!py-3 max-sm:!text-[11px]" data-magnetic>
              {t('nav.services')}
              <ArrowRight />
            </a>
          </div>
        </div>
      </div>

      </div>

      {/* "Pitaj moju bazu": he wanted it kept on the landing page (20 October 2026). Desktop: right of
          the portrait. Phones: right after the first screen, so the hero still fits to its buttons. */}
      <div
        className="container-page relative z-30 mt-4 pb-12 [perspective:1200px] lg:absolute lg:right-0 lg:top-[12vh] lg:mt-0
                   lg:w-[min(440px,31vw)] lg:px-0 lg:pb-0 lg:pr-8"
      >
        <div data-a="term">
          <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-subtle">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            {t('hero.terminalHint')}
          </p>
          <SqlTerminal autoplay={ready} />
        </div>
      </div>
    </section>
  );
}

/** Skills band under the hero, a ball between every item. */
export function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const track = (hidden: boolean) => (
    <div className="marquee__track" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-10">
          <span className="font-display text-[clamp(2rem,7vw,6rem)] text-fg">{it}</span>
          <Ball tone="line" className="h-[clamp(1.6rem,3.5vw,3rem)] w-[clamp(1.6rem,3.5vw,3rem)] shrink-0" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={'marquee border-y border-fg/10 py-4 sm:py-6 ' + (reverse ? 'marquee--reverse' : '')}>
      {track(false)}
      {track(true)}
    </div>
  );
}
