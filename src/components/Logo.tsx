/**
 * The VK monogram on a basketball. The letters are drawn as polygons rather than
 * set in a font, so the favicon (public/favicon.svg, same geometry) renders the
 * same everywhere without loading anything.
 */
export const LOGO_V = '13,20 19.5,20 23,35 26.5,20 33,20 26,44 20,44';
export const LOGO_K = '35,20 40.5,20 40.5,29.5 45,20 51,20 44.6,32 51.5,44 45.5,44 40.5,34.5 40.5,44 35,44';

export function Logo({ className = 'h-9 w-9', spin = false }: { className?: string; spin?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g className={spin ? 'origin-center transition-transform duration-700 group-hover:rotate-[360deg]' : ''}>
        <circle cx="32" cy="32" r="30" fill="rgb(var(--accent-strong))" />
        <g fill="none" stroke="rgb(var(--bg))" strokeOpacity="0.38" strokeWidth="1.6">
          <path d="M2 32H62" />
          <path d="M12 9C22 20 22 44 12 55" />
          <path d="M52 9C42 20 42 44 52 55" />
        </g>
      </g>
      <polygon points={LOGO_V} fill="#fff" />
      <polygon points={LOGO_K} fill="#fff" />
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
