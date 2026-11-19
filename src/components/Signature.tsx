import { useId } from 'react';
import { SIGNATURE } from '../data/signature';
import { gsap } from '../lib/motion';

/**
 * The signature as drawn letters. At rest it is a filled script "Veljko".
 *
 * The hero writes it with drawSignature(): each letter sits under a mask made of one
 * thick, round-capped line that runs along the letter's centreline in writing order
 * (SIGNATURE.strokes). Drawing that line reveals the ink where a pen would lay it
 * down, at the letter's real varying thickness, instead of tracing its outline.
 * Once written, the masks are dropped and the letters render plainly.
 */
export function Signature({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      viewBox={SIGNATURE.viewBox}
      className={className}
      style={{ width: `${SIGNATURE.widthEm}em`, height: `${SIGNATURE.heightEm}em`, overflow: 'visible' }}
      aria-hidden="true"
      data-signature
    >
      <defs>
        {SIGNATURE.strokes.map((d, i) => (
          <mask key={i} id={`${id}-m${i}`} maskUnits="userSpaceOnUse" x="-200" y="-1000" width="2400" height="1700">
            {/* One path per pen stroke, so each starts only when the one before it ends. */}
            {d.split(/ (?=M)/).map((part, k) => (
              <path
                key={k}
                d={part}
                data-sig-pen={i}
                fill="none"
                stroke="#fff"
                strokeWidth={SIGNATURE.strokeWidths[i]}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </mask>
        ))}
      </defs>
      {SIGNATURE.paths.map((d, i) => (
        <path key={i} d={d} data-sig-path data-mask={`url(#${id}-m${i})`} fill="currentColor" />
      ))}
    </svg>
  );
}

/** Hide every letter, ready to be written. Called before the intro plays. */
export function hideSignature(scope: Element) {
  const letters = [...scope.querySelectorAll<SVGPathElement>('[data-sig-path]')];
  letters.forEach((p) => p.setAttribute('mask', p.dataset.mask!));
  scope.querySelectorAll<SVGPathElement>('[data-sig-pen]').forEach((p) => {
    // The dash starts a full pen-width before the path does, so its round cap is off
    // the path too: nothing shows until the stroke is drawn, not even a dot.
    const len = p.getTotalLength();
    const w = Number(p.getAttribute('stroke-width')) || 60;
    gsap.set(p, { strokeDasharray: `${len} ${len + 2 * w}`, strokeDashoffset: len + w });
  });
}

/**
 * Write the letters left to right at an even pen speed: each letter takes time in
 * proportion to the length of its line, eases in and out like a hand does, and the
 * pen pauses for a moment between letters. Returns the timeline so the hero can
 * place it in its intro.
 */
export function drawSignature(scope: Element, total = 2.4) {
  const pens = [...scope.querySelectorAll<SVGPathElement>('[data-sig-pen]')];
  const letters = [...scope.querySelectorAll<SVGPathElement>('[data-sig-path]')];
  const lengths = pens.map((p) => p.getTotalLength());
  const sum = lengths.reduce((a, b) => a + b, 0) || 1;
  const tl = gsap.timeline();
  let at = 0;
  let letter = pens[0]?.dataset.sigPen;
  pens.forEach((p, i) => {
    // a short lift of the pen between letters, a shorter one between strokes of a letter
    if (p.dataset.sigPen !== letter) {
      at += 0.06;
      letter = p.dataset.sigPen;
    }
    const d = Math.max(0.08, (lengths[i] / sum) * total);
    tl.to(p, { strokeDashoffset: 0, duration: d, ease: 'sine.inOut' }, at);
    at += d + 0.015;
  });
  // Written: drop the masks, so nothing the centreline missed stays hidden.
  tl.add(() => letters.forEach((p) => p.removeAttribute('mask')));
  tl.set(pens, { clearProps: 'strokeDasharray,strokeDashoffset' });
  return tl;
}
