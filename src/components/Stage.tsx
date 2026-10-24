import { createContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { finePointer, gsap, motionOK, ScrollTrigger, scroller } from '../lib/motion';
import { Ball } from './Logo';

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
 * Intro screen, the same on every visit. Its markup and entrance live in index.html
 * (#boot), so the ball, the line and the name are on screen before any JavaScript
 * arrives. This takes over once the app loads: it runs the counter and the line to
 * 100 once the fonts and the portrait are ready (at least 1.4 s from navigation,
 * capped near 3 s), turns the ball once, and lifts the screen like a curtain with a
 * violet layer trailing it. Visitors with motion off, and the prerender, never get it.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    // The app is here: cancel index.html's 4 s safety net, which only exists for a page whose
    // script never loads, before it can cut the intro off halfway.
    window.clearTimeout((window as unknown as { __bootTimer?: number }).__bootTimer);
    const html = document.documentElement;
    const boot = document.getElementById('boot');
    if (!html.classList.contains('intro-pending') || !boot || !motionOK()) {
      // Leave #boot in place (it is display:none without the class): the prerender snapshots
      // the page from here, and the shipped HTML still needs it for real visitors.
      html.classList.remove('intro-pending');
      onDone();
      return;
    }
    scroller.lenis?.stop();
    const q = (sel: string) => boot.querySelector<HTMLElement>(sel)!;
    const logo = q('.logo');
    const meta = q('.meta');
    const bar = q('.bar');
    const num = q('.num');
    const panel = q('.panel');
    const veil = q('.veil');

    // Ready = fonts loaded and the portrait decoded, capped so a slow network never holds the page.
    const assets = new Promise<void>((resolve) => {
      const img = document.querySelector<HTMLImageElement>('[data-a="portrait"]');
      const decoded = img ? img.decode().catch(() => undefined) : Promise.resolve();
      Promise.all([document.fonts?.ready, decoded]).then(() => resolve());
      window.setTimeout(resolve, 2600);
    });
    const minWait = Math.max(0, 1400 - performance.now());

    const count = { v: 0 };
    const render = () => {
      num.textContent = String(Math.round(count.v)).padStart(3, '0');
    };
    // The CSS entrance has run; hand its end state to GSAP so the two never fight.
    logo.style.animation = 'none';
    meta.style.animation = 'none';

    const intro = gsap.timeline();
    intro
      .to(count, { v: 80, duration: 1, ease: 'power2.out', onUpdate: render })
      .to(bar, { scaleX: 0.8, duration: 1, ease: 'power2.out' }, 0);

    let outro: gsap.core.Timeline | null = null;
    let cancelled = false;
    Promise.all([assets, new Promise((r) => window.setTimeout(r, minWait))]).then(() => {
      if (cancelled) return;
      outro = gsap.timeline({
        onComplete: () => {
          html.classList.remove('intro-pending');
          boot.remove();
          scroller.lenis?.start();
        },
      });
      outro
        .to(count, { v: 100, duration: 0.45, ease: 'power2.inOut', onUpdate: render })
        .to(bar, { scaleX: 1, duration: 0.45, ease: 'power2.inOut' }, '<')
        .to(logo, { rotation: 360, duration: 0.7, ease: 'power3.inOut' }, '<')
        .to([logo, meta], { y: -24, autoAlpha: 0, duration: 0.45, ease: 'power3.in', stagger: 0.05 }, '+=0.05')
        .to(panel, { clipPath: 'inset(0 0 100% 0)', duration: 0.85, ease: 'expo.inOut' }, '-=0.15')
        .add(onDone, '-=0.55')
        .to(veil, { clipPath: 'inset(0 0 100% 0)', duration: 0.85, ease: 'expo.inOut' }, '-=0.72');
    });

    return () => {
      cancelled = true;
      intro.kill();
      outro?.kill();
    };
    // onDone is stable for the lifetime of the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
