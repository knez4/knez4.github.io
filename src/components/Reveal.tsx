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

/**
 * A plain wrapper. It used to fade each block up as it scrolled into view; that was
 * taken out in November 2026, because an entrance on every block is what a generated
 * page does, and it made the two moments that matter (the intro, the four steps)
 * compete with twenty small ones. The props stay so call sites did not have to change.
 */
export function Reveal({
  children,
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  /** Unused; kept so existing call sites compile. */
  delay?: number;
  className?: string;
  /** 'li' when the wrapped element is itself a list item: a div between <ol> and <li> is invalid. */
  as?: 'div' | 'li';
}) {
  const Tag = as;
  return <Tag className={className || undefined}>{children}</Tag>;
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
