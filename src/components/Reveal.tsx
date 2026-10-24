import { Fragment, useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { motionOK } from '../lib/motion';

/**
 * True once the element has scrolled into view (and stays true). Starts true
 * when motion is off, so reduced-motion visitors and the prerender snapshot get
 * the final state with nothing hidden.
 */
export function useInView<T extends HTMLElement>(margin = '0px 0px -12% 0px'): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(() => !motionOK());

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin, shown]);

  return [ref, shown];
}

/** Fade-up on first scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** 'li' when the revealed element is itself a list item: a div between <ol> and <li> is invalid. */
  as?: 'div' | 'li';
}) {
  const [ref, shown] = useInView<HTMLElement>('0px 0px -60px 0px');
  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={(shown ? 'animate-fade-up ' : 'opacity-0 ') + className}
      style={shown && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Text split into words that rise out of their own clip boxes, one after another. */
export function SplitText({ text, className = '', step = 70 }: { text: string; className?: string; step?: number }) {
  const [ref, shown] = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} className={(shown ? 'is-in ' : '') + className}>
      {/* The space sits between the clip boxes, not inside one: inside, a tight line
          wrapped it onto a second line of its own and left an empty row. */}
      {text.split(' ').map((w, i, all) => (
        <Fragment key={i}>
          <span className="split-word whitespace-nowrap">
            <span style={{ ['--d' as string]: `${i * step}ms` }}>{w}</span>
          </span>
          {i < all.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  );
}
