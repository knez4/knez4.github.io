import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Whether to run decorative motion at all. Off for reduced-motion visitors, and
 * off under automation: scripts/prerender.mjs snapshots the DOM with Puppeteer,
 * and a snapshot taken mid-intro would ship half-faded text in the static HTML.
 */
export function motionOK(): boolean {
  if (typeof window === 'undefined') return false;
  if (navigator.webdriver) return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Fine pointer only: no custom cursor or magnetic pull on touch screens. */
export function finePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
}

/** The one Lenis instance, set by <SmoothScroll>. Null when motion is off. */
export const scroller: { lenis: Lenis | null } = { lenis: null };

export function scrollToTarget(target: string | number | HTMLElement, immediate = false) {
  if (scroller.lenis) {
    scroller.lenis.scrollTo(target, { immediate, offset: typeof target === 'number' ? 0 : -72 });
    return;
  }
  if (typeof target === 'number') window.scrollTo(0, target);
  else {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    el?.scrollIntoView({ block: 'start' });
  }
}
