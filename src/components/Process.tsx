import { useEffect, useRef, useState } from 'react';
import { motionOK, ScrollTrigger } from '../lib/motion';
import { useLang } from '../lib/useLang';

/**
 * Working together, shown as a site coming into being, on the Flekout example.
 *
 * A browser window floats in 3D beside the four steps and changes as each step
 * scrolls into view:
 *   1. You get in touch: a message lands in it.
 *   2. We agree: the layout is sketched as a wireframe.
 *   3. I build and show you: the real design wipes in over the sketch.
 *   4. It goes live: the window turns to face you, the address becomes
 *      flekoutclean.com, and the phone version slides out in front.
 *
 * Each step owns a value from 0 to 1 (--s1 to --s4 on the stage), driven by the
 * scroll; the CSS does the rest. With motion off, and in the prerender, all four are
 * 1, which is the finished, live site.
 */
export function Process() {
  const { t } = useLang();
  const steps = [1, 2, 3, 4].map((n) => ({ title: t(`process.s${n}` as 'process.s1'), body: t(`process.s${n}b` as 'process.s1b') }));
  const box = useRef<HTMLDivElement>(null);
  const [animated] = useState(() => motionOK());

  useEffect(() => {
    const el = box.current;
    if (!animated || !el) return;
    const stage = el.querySelector<HTMLElement>('.bld-stage')!;
    const items = [...el.querySelectorAll<HTMLElement>('.bld-step')];
    const set = (i: number, v: number) => {
      stage.style.setProperty(`--s${i + 1}`, v.toFixed(3));
      items[i].style.setProperty('--t', v.toFixed(3));
      items[i].classList.toggle('is-on', v > 0.5);
    };
    items.forEach((_, i) => set(i, 0));
    const triggers = items.map((item, i) =>
      ScrollTrigger.create({
        trigger: item,
        start: 'top 80%',
        end: 'top 45%',
        scrub: 0.6,
        onUpdate: (self) => set(i, self.progress),
      }),
    );
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      triggers.forEach((tr) => tr.kill());
    };
  }, [animated]);

  return (
    <div ref={box} className="bld grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
      <div className="bld-pin">
        <figure className="bld-stage" aria-hidden="true">
          <div className="bld-win">
            <div className="bld-bar">
              <span className="bld-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="bld-url">
                <span className="bld-url__t bld-url__t--1">{t('process.bar1')}</span>
                <span className="bld-url__t bld-url__t--2">{t('process.bar2')}</span>
                <span className="bld-url__t bld-url__t--3">{t('process.bar3')}</span>
                <span className="bld-url__t bld-url__t--4">
                  <i className="bld-live" />
                  flekoutclean.com
                </span>
              </span>
            </div>
            <div className="bld-view">
              {/* 2: the sketch */}
              <svg className="bld-wire" viewBox="0 0 1440 900" preserveAspectRatio="none">
                {/* nav */}
                <rect className="f" x="40" y="18" width="1360" height="64" rx="6" pathLength="1" />
                <rect className="d" x="72" y="38" width="150" height="24" rx="3" pathLength="1" />
                <path d="M1000 50h80M1110 50h80M1220 50h80" pathLength="1" />
                <rect className="b" x="1310" y="34" width="70" height="32" rx="3" pathLength="1" />
                {/* the slanted picture */}
                <path className="f" d="M640 82H1440V900H330Z" pathLength="1" />
                <path d="M640 82L1440 900M1440 82L330 900" pathLength="1" />
                {/* headline, text, button */}
                <rect className="d" x="80" y="320" width="330" height="86" rx="4" pathLength="1" />
                <rect className="d" x="80" y="426" width="290" height="86" rx="4" pathLength="1" />
                <path d="M80 568h360M80 600h320M80 632h250" pathLength="1" />
                <rect className="b" x="80" y="684" width="200" height="60" rx="3" pathLength="1" />
                <path d="M310 714h110" pathLength="1" />
              </svg>
              {/* 3: the real design */}
              <img
                className="bld-design"
                src="/img/work/flekout-hero.webp"
                srcSet="/img/work/flekout-hero-720.webp 720w, /img/work/flekout-hero.webp 1440w"
                sizes="(min-width: 1024px) 560px, 90vw"
                alt=""
                width={1440}
                height={900}
                loading="lazy"
                decoding="async"
              />
              {/* 1: the first message */}
              <div className="bld-msg">
                <p className="bld-msg__in">{t('process.msg1')}</p>
                <p className="bld-msg__out">{t('process.msg2')}</p>
              </div>
            </div>
          </div>
          {/* 4: the phone version slides out in front */}
          <div className="bld-phone">
            <img
              src="/img/work/flekout-m-hero.webp"
              srcSet="/img/work/flekout-m-hero-240.webp 240w, /img/work/flekout-m-hero.webp 480w"
              sizes="140px"
              alt=""
              width={480}
              height={1039}
              loading="lazy"
              decoding="async"
            />
          </div>
        </figure>
        <p className="bld-cap">{t('process.caption')}</p>
      </div>

      <ol className="bld-list">
        {steps.map((s, i) => (
          <li key={s.title} className={'bld-step' + (animated ? '' : ' is-on')}>
            <span className="font-display bld-num text-[2.6rem] leading-none tabular-nums">{i + 1}</span>
            <h3 className="mt-3 text-[20px] font-semibold text-fg sm:text-[22px]">{s.title}</h3>
            <p className="mt-2 max-w-sm text-[16px] leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
