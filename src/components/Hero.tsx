import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { profile } from '../data/profile';
import { gsap, motionOK } from '../lib/motion';
import { useLang } from '../lib/useLang';
import { ArrowRight, Download } from './icons';
import { Ball } from './Logo';
import { drawSignature, hideSignature, Signature } from './Signature';
import { SqlTerminal } from './SqlTerminal';

const SURNAME = 'KNEŽEVIĆ';

/**
 * The stage: a surname wider than the screen, the portrait standing in front of
 * it, the signature across both, and a live terminal on the right. Below lg the
 * same pieces stack in reading order.
 */
export function Hero({ ready }: { ready: boolean }) {
  const { t, pick } = useLang();
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!motionOK() || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.set('[data-a="char"]', { yPercent: 110 });
      gsap.set('[data-a="portrait"]', { clipPath: 'inset(100% 0 0 0)', scale: 1.08 });
      hideSignature(root.current!);
      gsap.set('[data-a="fade"]', { autoAlpha: 0, y: 24 });
      gsap.set('[data-a="term"]', { autoAlpha: 0, y: 40, rotateX: 8 });
    }, root);
    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!ready || !motionOK() || !root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.to('[data-a="char"]', { yPercent: 0, duration: 1.3, stagger: 0.045 })
        .to('[data-a="portrait"]', { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.5 }, 0.15)
        // The signature writes itself letter by letter (see Signature.tsx).
        .add(drawSignature(root.current!), 0.7)
        .to('[data-a="fade"]', { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08 }, 0.5)
        .to('[data-a="term"]', { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.2 }, 0.8);

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
        {profile.name}, {pick(profile.role)}
      </h1>

      {/*
        Phones: name, portrait and the intro block share exactly one screen (100svh,
        the height left by the browser's own bars). The portrait takes whatever room
        the rest leaves, so "Preuzmi CV" is on screen on every phone and the terminal
        starts below the fold. The surname shares the portrait's cell, set in front of
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
            sizes="(min-width: 1024px) 52vh, 70vw"
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
            {pick(profile.status)}
          </p>

          {/* What he does, large enough to answer "who is this?" before the photo does.
              His three fields, in his words; backend is deliberately not one of them. */}
          <p data-a="fade" className="font-display mt-4 text-[clamp(1.9rem,8.4vw,3.2rem)] text-fg lg:text-[clamp(2.1rem,2.9vw,3rem)]">
            {t('hero.role')}
          </p>
          <p data-a="fade" className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
            {t('hero.sub')}
          </p>

          {/* Compact on phones so both buttons share one row. */}
          <div data-a="fade" className="mt-6 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
            <a href="#projects" className="btn-pill btn-pill--solid max-sm:!gap-2 max-sm:!px-4 max-sm:!py-3 max-sm:!text-[11px]" data-magnetic>
              {t('hero.viewProjects')}
              <ArrowRight />
            </a>
            <Link to="/cv" className="btn-pill btn-pill--ghost max-sm:!gap-2 max-sm:!px-4 max-sm:!py-3 max-sm:!text-[11px]" data-magnetic>
              <Download />
              {t('hero.downloadCv')}
            </Link>
          </div>
        </div>
      </div>

      </div>

      {/* Right column: the terminal */}
      <div
        className="container-page relative z-30 mt-10 [perspective:1200px] lg:absolute lg:right-0 lg:top-[12vh] lg:mt-0
                   lg:w-[min(440px,31vw)] lg:px-0 lg:pr-8"
      >
        <div data-a="term">
          <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-subtle">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            {t('hero.terminalHint')}
          </p>
          <SqlTerminal autoplay={ready} />
        </div>
      </div>

      {/* Scroll cue */}
      <div
        data-a="fade"
        className="absolute bottom-6 left-8 z-20 hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em]
                   text-subtle lg:flex"
        aria-hidden="true"
      >
        <span className="relative h-10 w-px overflow-hidden bg-fg/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-accent" />
        </span>
        {t('hero.scroll')}
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
