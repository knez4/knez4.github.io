/**
 * Contact details that are deliberately kept out of the repository.
 *
 * The published site and the PDF it serves never carry a phone number: a file on
 * a public site is read by scrapers as much as by recruiters, and anything
 * committed here stays in the git history for good.
 *
 * `npm run cv:private` injects these at render time from private.local.json,
 * which is gitignored, and writes the result to private/ rather than public/.
 */
export type PrivateContact = { phone?: string };

declare global {
  interface Window {
    __CV_PRIVATE__?: PrivateContact;
  }
}

export function privateContact(): PrivateContact {
  if (typeof window === 'undefined') return {};
  return window.__CV_PRIVATE__ ?? {};
}
