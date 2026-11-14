/**
 * The mark (November 2026): a lowercase "vk" where the v stands and the k leans
 * forward, already on its way. The k is the one accent-coloured piece. The outlines
 * are Archivo (the display face) at its widest and heaviest, taken as paths, so the
 * favicon (public/favicon.svg, same geometry on a dark tile) renders the same
 * everywhere without loading a font. The v takes the current text colour.
 */
export const LOGO_V = 'M253.1 724.8 0 197H222.3L317.5 427.5Q323.7 442.5 331.8 465Q339.8 487.4 348.4 510.1Q357 532.8 362.7 550.5H372.2Q378.7 532 387 509Q395.4 485.9 404.1 463.4Q412.8 441 419 426L511.1 197H725.6L472.5 724.8Z';
export const LOGO_K = 'M754.4 724.8 935.1 0H1139.4L1039.2 402L1315.1 197H1565L1291.7 408.3L1439.1 724.8H1199.5L1109.4 518.3L992.8 588L958.7 724.8Z';

export function Logo({ className = 'h-6 w-auto', spin = false }: { className?: string; spin?: boolean }) {
  return (
    <svg viewBox="0 0 1570 725" className={className + ' overflow-visible'} aria-hidden="true">
      <path d={LOGO_V} fill="currentColor" />
      {/* On hover the k takes a step forward. */}
      <path
        d={LOGO_K}
        fill="rgb(var(--accent))"
        className={spin ? 'transition-transform duration-300 ease-out group-hover:translate-x-[90px]' : ''}
      />
    </svg>
  );
}

/**
 * A basketball. "real" is the orange one (cursor, shot easter egg), the only
 * place the site breaks palette on purpose; "line" is drawn in the accent.
 */
export function Ball({ className = 'h-full w-full', tone = 'real' }: { className?: string; tone?: 'real' | 'line' }) {
  const line = tone === 'line';
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill={line ? 'none' : '#F07A2A'} />
      <g fill="none" stroke={line ? 'rgb(var(--accent))' : '#2A1206'} strokeWidth={line ? 3 : 2.2}>
        <circle cx="32" cy="32" r="30" />
        <path d="M2 32H62M32 2V62" />
        <path d="M12 9C22 20 22 44 12 55M52 9C42 20 42 44 52 55" />
      </g>
    </svg>
  );
}
