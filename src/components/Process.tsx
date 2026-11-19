import { useEffect, useRef, useState } from 'react';
import { motionOK, ScrollTrigger } from '../lib/motion';
import { useLang } from '../lib/useLang';

/**
 * Working together, in four steps on one line. The line fills as the visitor scrolls
 * and each step lights when the fill reaches it. Across on wide screens, down the
 * left edge on phones. With motion off, and in the prerender, the line is full and
 * every step is lit.
 */
export function Process() {
  const { t } = useLang();
  const steps = [1, 2, 3, 4].map((n) => ({ title: t(`process.s${n}` as 'process.s1'), body: t(`process.s${n}b` as 'process.s1b') }));
  const box = useRef<HTMLDivElement>(null);
  const [animated] = useState(() => motionOK());
  const [on, setOn] = useState(animated ? 0 : steps.length);

  useEffect(() => {
    const el = box.current;
    if (!animated || !el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 75%',
      end: () => (window.matchMedia('(max-width: 1023px)').matches ? 'bottom 65%' : 'top 35%'),
      scrub: 0.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        el.style.setProperty('--p', self.progress.toFixed(4));
        setOn(Math.min(steps.length, Math.floor(self.progress * steps.length + 0.75)));
      },
    });
    return () => st.kill();
  }, [animated, steps.length]);

  return (
    <div ref={box} className={'line-steps' + (animated ? '' : ' is-static')}>
      <span className="line-steps__track" aria-hidden="true">
        <span className="line-steps__fill" />
      </span>
      <ol className="grid gap-10 lg:grid-cols-4 lg:gap-8">
        {steps.map((s, i) => (
          <li key={s.title} className={'line-steps__step' + (i < on ? ' is-on' : '')}>
            <span className="line-steps__dot" aria-hidden="true" />
            <span className="font-display line-steps__num text-[2.6rem] leading-none tabular-nums">{i + 1}</span>
            <h3 className="mt-3 text-[19px] font-semibold text-fg">{s.title}</h3>
            <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
