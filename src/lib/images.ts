/**
 * Responsive sources for the site's own raster images. The diagrams ship as WebP at
 * 2400px with a 1200px sibling ("-1200"); the Flekout shots at 1200px with a 600px one.
 * They used to be SVG <img>s, but each SVG image is its own document to Chrome, and
 * several on one page made Lighthouse lose track of the main frame (NO_LCP).
 */
export function srcSetFor(src: string): string | undefined {
  if (src.startsWith('/screenshots/') && src.endsWith('.webp')) {
    return `${src.replace(/\.webp$/, '-1200.webp')} 1200w, ${src} 2400w`;
  }
  if (src === '/img/work/flekout-desktop.webp') {
    return '/img/work/flekout-desktop-600.webp 600w, /img/work/flekout-desktop.webp 1200w';
  }
  return undefined;
}

/** A diagram rather than a photo of something real (the plain work cards skip these). */
export const isDiagram = (src: string) => src.startsWith('/screenshots/');
