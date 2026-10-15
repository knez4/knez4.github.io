import { createContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { finePointer, gsap, motionOK, ScrollTrigger, scroller } from '../lib/motion';
import { Ball, Logo } from './Logo';

/** True once the intro has finished (or was skipped), so the hero knows when to play. */
export const IntroReady = createContext(true);

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in step. */
export function SmoothScroll() {
  // While the page is moving, content slides under a still pointer and the browser
  // fires hover on every row it crosses: the project preview, the schema tables,
  // the card lights. Measured, that was nearly all of the dropped frames. So hover
  // is switched off for the length of a scroll and comes back 150 ms after it stops.
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;
    const onScroll = () => {
      if (!timer) root.classList.add('is-scrolling');
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        root.classList.remove('is-scrolling');
        timer = 0;
      }, 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!motionOK()) return;
    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } });
    scroller.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      scroller.lenis = null;
    };
  }, []);
  return null;
}

/**
 * Dot plus trailing ring. The ring grows over links and turns into a spinning
 * basketball over anything marked data-cursor="ball". Buttons and links marked
 * data-magnetic lean toward the pointer.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled] = useState(() => motionOK() && finePointer());

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    document.documentElement.classList.add('has-cursor');
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08 });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08 });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3.out' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3.out' });
    let magnet: HTMLElement | null = null;

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const target = e.target as HTMLElement;
      const r = ring.current!;
      if (target.closest('[data-cursor="ball"]')) r.dataset.state = 'ball';
      else if (target.closest('a, button, [role="button"], input, label')) r.dataset.state = 'link';
      else delete r.dataset.state;

      const spot = target.closest<HTMLElement>('.spot');
      if (spot) {
        const sb = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', `${e.clientX - sb.left}px`);
        spot.style.setProperty('--my', `${e.clientY - sb.top}px`);
      }

      const m = target.closest<HTMLElement>('[data-magnetic]');
      if (m !== magnet && magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      magnet = m;
      if (m) {
        const b = m.getBoundingClientRect();
        gsap.to(m, {
          x: (e.clientX - (b.left + b.width / 2)) * 0.28,
          y: (e.clientY - (b.top + b.height / 2)) * 0.35,
          duration: 0.4,
          ease: 'power3.out',
        });
      }
    };
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    document.addEventListener('pointerenter', enter);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      document.removeEventListener('pointerenter', enter);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <Ball className="h-full w-full" />
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}

/**
 * Intro screen, the same on every visit. The ball monogram turns once, a violet line
 * fills to 100 with a counter beside it, and the screen lifts like a curtain with a
 * violet layer trailing it. The line only reaches 100 once the fonts and the portrait
 * are ready (at least 1.4 s, never more than about 3 s), so the hero never opens on a
 * blank photo. Skipped when motion is off, and under automation (the prerender).
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const meta = useRef<HTMLDivElement>(null);
  const [show] = useState(() => motionOK());

  useEffect(() => {
    if (!show) {
      onDone();
      return;
    }
    const html = document.documentElement;
    html.style.overflow = 'hidden';
    scroller.lenis?.stop();

    // Ready = fonts loaded and the portrait decoded, capped so a slow network never holds the page.
    const assets = new Promise<void>((resolve) => {
      const img = document.querySelector<HTMLImageElement>('[data-a="portrait"]');
      const decoded = img ? img.decode().catch(() => undefined) : Promise.resolve();
      Promise.all([document.fonts?.ready, decoded]).then(() => resolve());
      window.setTimeout(resolve, 2600);
    });

    const count = { v: 0 };
    const render = () => {
      if (num.current) num.current.textContent = String(Math.round(count.v)).padStart(3, '0');
    };

    // Phase 1: logo in, line runs to 80 while assets load.
    const intro = gsap.timeline();
    intro
      .fromTo(logo.current, { scale: 0.6, autoAlpha: 0, rotation: -120 }, { scale: 1, autoAlpha: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.6)' })
      .fromTo(meta.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.2)
      .to(count, { v: 80, duration: 1.2, ease: 'power2.out', onUpdate: render }, 0.25)
      .fromTo(bar.current, { scaleX: 0 }, { scaleX: 0.8, duration: 1.2, ease: 'power2.out' }, 0.25);

    let outro: gsap.core.Timeline | null = null;
    let cancelled = false;
    Promise.all([assets, new Promise((r) => window.setTimeout(r, 1400))]).then(() => {
      if (cancelled) return;
      // Phase 2: finish the line, a full turn of the ball, then lift the curtain.
      outro = gsap.timeline({
        onComplete: () => {
          html.style.overflow = '';
          scroller.lenis?.start();
        },
      });
      outro
        .to(count, { v: 100, duration: 0.45, ease: 'power2.inOut', onUpdate: render })
        .to(bar.current, { scaleX: 1, duration: 0.45, ease: 'power2.inOut' }, '<')
        .to(logo.current, { rotation: 360, duration: 0.7, ease: 'power3.inOut' }, '<')
        .to([logo.current, meta.current], { y: -24, autoAlpha: 0, duration: 0.45, ease: 'power3.in', stagger: 0.05 }, '+=0.05')
        .to(panel.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.85, ease: 'expo.inOut' }, '-=0.15')
        .add(onDone, '-=0.55')
        .to(veil.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.85, ease: 'expo.inOut' }, '-=0.72')
        .set(root.current, { display: 'none' });
    });

    return () => {
      cancelled = true;
      intro.kill();
      outro?.kill();
      html.style.overflow = '';
    };
    // onDone is stable for the lifetime of the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!show) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[80]" aria-hidden="true">
      {/* trails the panel on the way out, so the lift shows a violet edge */}
      <div ref={veil} className="absolute inset-0 bg-accent-strong" style={{ clipPath: 'inset(0 0 0 0)' }} />
      <div ref={panel} className="absolute inset-0 grid place-items-center bg-bg" style={{ clipPath: 'inset(0 0 0 0)' }}>
        <div className="flex w-[min(280px,64vw)] flex-col items-center">
          <div ref={logo} className="opacity-0">
            <Logo className="h-16 w-16 sm:h-20 sm:w-20" />
          </div>
          <div ref={meta} className="mt-10 w-full opacity-0">
            <span className="relative block h-px w-full overflow-hidden bg-fg/15">
              <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-accent" />
            </span>
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-subtle">
              <span>Veljko Knežević</span>
              <span ref={num} className="tabular-nums text-fg">
                000
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
