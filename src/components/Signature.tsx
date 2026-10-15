import { SIGNATURE } from '../data/signature';
import { gsap } from '../lib/motion';

/**
 * The signature as drawn letters. At rest it is a filled script "Veljko"; the hero
 * animates it with drawSignature(), which traces each letter's outline and lets the
 * fill follow the stroke, so it reads as being written rather than uncovered.
 */
export function Signature({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={SIGNATURE.viewBox}
      className={className}
      style={{ width: `${SIGNATURE.widthEm}em`, height: `${SIGNATURE.heightEm}em`, overflow: 'visible' }}
      aria-hidden="true"
      data-signature
    >
      {SIGNATURE.paths.map((d, i) => (
        <path
          key={i}
          d={d}
          data-sig-path
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

/** Hide every letter, ready to be written. Called before the intro plays. */
export function hideSignature(scope: Element) {
  scope.querySelectorAll<SVGPathElement>('[data-sig-path]').forEach((p) => {
    const len = p.getTotalLength();
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
  });
}

/**
 * Write the letters left to right. Each outline is traced at a speed set by its
 * length (a long V takes longer than an o), and the fill comes in behind the
 * stroke. Returns the timeline so the hero can place it in its intro.
 */
export function drawSignature(scope: Element, total = 2.6) {
  const paths = [...scope.querySelectorAll<SVGPathElement>('[data-sig-path]')];
  const lengths = paths.map((p) => p.getTotalLength());
  const sum = lengths.reduce((a, b) => a + b, 0) || 1;
  const tl = gsap.timeline();
  let at = 0;
  paths.forEach((p, i) => {
    const d = Math.max(0.22, (lengths[i] / sum) * total);
    tl.to(p, { strokeDashoffset: 0, duration: d, ease: 'power1.inOut' }, at);
    tl.to(p, { fillOpacity: 1, duration: Math.min(0.5, d * 0.8), ease: 'power1.out' }, at + d * 0.55);
    // letters overlap a little, the way a hand moves on before a stroke is quite done
    at += d * 0.82;
  });
  tl.set(paths, { clearProps: 'strokeDasharray,strokeDashoffset' });
  return tl;
}
