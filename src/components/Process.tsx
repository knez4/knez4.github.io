import { useEffect, useRef, useState } from 'react';
import { gsap, motionOK, ScrollTrigger } from '../lib/motion';
import { useLang } from '../lib/useLang';
import { Ball } from './Logo';

/**
 * Working together, as a pass down the court. A ball rolls along the line as the
 * visitor scrolls, each step lights up when the ball reaches it, and after the
 * fourth ("it goes live") the ball drops through a hoop at the end of the line.
 * Scrolling back up rolls it back.
 *
 * The line runs across on wide screens and down the left edge on phones; the same
 * progress value (--p, 0 to 1) drives both, and the steps' own positions decide
 * when each one switches on, so the layout can change without touching this.
 *
 * With motion off (and in the prerender) there is no ball: the line is full and
 * all four steps are lit.
 */
export function Process() {
  const { t } = useLang();
  const steps = [1, 2, 3, 4].map((n) => ({ title: t(`process.s${n}` as 'process.s1'), body: t(`process.s${n}b` as 'process.s1b') }));
  const box = useRef<HTMLDivElement>(null);
  const [animated] = useState(() => motionOK());
  const [active, setActive] = useState(animated ? 0 : steps.length);
  const [scored, setScored] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!animated || !el) return;
    const BALL = 28;
    const state = { p: 0 };

    const render = () => {
      el.style.setProperty('--p', state.p.toFixed(4));
      const vertical = window.matchMedia('(max-width: 1023px)').matches;
      const track = el.querySelector<HTMLElement>('.proc-track')!;
      const length = vertical ? track.offsetHeight : track.offsetWidth;
      const ball = state.p * (length - BALL) + BALL / 2;
      let on = 0;
      el.querySelectorAll<HTMLElement>('.proc-step').forEach((li) => {
        // +14: the stop's dot sits a little inside the step on phones
        const stop = vertical ? li.offsetTop + 14 : li.offsetLeft;
        if (ball >= stop + 4) on += 1;
      });
      setActive(on);
      setScored(state.p > 0.97);
    };

    const tween = gsap.to(state, {
      p: 1,
      ease: 'none',
      onUpdate: render,
      // Phones: the list is tall, so the ball follows it down. Wide screens: the row is
      // short, so the roll is spread over about half a screen of scrolling.
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: () => (window.matchMedia('(max-width: 1023px)').matches ? 'bottom 78%' : 'top 42%'),
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
    render();
    // Fonts and lazy images above can move the section after first layout.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [animated]);

  return (
    <div ref={box} className={'proc' + (scored ? ' is-scored' : '') + (animated ? '' : ' is-static')}>
      <div className="proc-track" aria-hidden="true">
        <span className="proc-fill" />
        {animated ? (
          <>
            <span className="proc-ball">
              <Ball />
            </span>
            <svg className="proc-hoop" viewBox="0 0 44 40" fill="none">
              <path className="proc-net" d="M8 7l4 26M16 9l2 26M22 9v27M28 9l-2 26M36 7l-4 26M10 18h24M11 27h22" strokeWidth="1.2" />
              <ellipse className="proc-rim" cx="22" cy="6" rx="17" ry="4.2" strokeWidth="2.4" />
            </svg>
          </>
        ) : null}
      </div>
      <ol className="grid gap-9 lg:grid-cols-4 lg:gap-8">
        {steps.map((s, i) => (
          <li key={s.title} className={'proc-step' + (i < active ? ' is-on' : '')}>
            <span className="proc-dot" aria-hidden="true" />
            <span className="proc-num font-display text-[2.6rem] leading-none tabular-nums">{i + 1}</span>
            <h3 className="mt-3 text-[19px] font-semibold text-fg">{s.title}</h3>
            <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
