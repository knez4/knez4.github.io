import { createContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { finePointer, gsap, motionOK, ScrollTrigger, scroller } from '../lib/motion';
import { useLang } from '../lib/useLang';
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
 * First-visit intro as a basketball shot clock: 24 runs down to 0, the buzzer
 * sounds (visually), and the panel lifts off the hero. Once per session, about
 * 1.4 s, skipped entirely when motion is off.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const { lang } = useLang();
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [show] = useState(() => {
    if (!motionOK()) return false;
    try {
      return sessionStorage.getItem('intro') !== '1';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!show) {
      onDone();
      return;
    }
    try {
      sessionStorage.setItem('intro', '1');
    } catch {
      // private mode: the intro just plays again next time
    }
    const clock = { v: 24 };
    const tl = gsap.timeline({ onComplete: onDone });
    tl.to(clock, {
      v: 0,
      duration: 1.05,
      ease: 'power1.in',
      onUpdate: () => {
        if (num.current) num.current.textContent = String(Math.ceil(clock.v)).padStart(2, '0');
      },
    })
      .to(num.current, { color: 'rgb(124 77 255)', scale: 1.08, duration: 0.12, yoyo: true, repeat: 1 })
      .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.75, ease: 'expo.inOut' }, '+=0.05');
    return () => {
      tl.kill();
    };
    // onDone is stable for the lifetime of the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!show) return null;
  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] grid place-items-center bg-bg"
      style={{ clipPath: 'inset(0 0 0 0)' }}
      aria-hidden="true"
    >
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-subtle">
          {lang === 'sr' ? 'Napad počinje' : 'Shot clock'}
        </p>
        <span ref={num} className="font-display mt-3 block text-[34vw] leading-none text-fg sm:text-[22vw]">
          24
        </span>
      </div>
    </div>
  );
}
