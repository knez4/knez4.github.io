/** A string that exists in both site languages. */
export type L = { en: string; sr: string };
/** A bullet list that exists in both site languages. */
export type LL = { en: string[]; sr: string[] };

export type ProjectStatus =
  | 'prototype'
  | 'delivered'
  | 'coursework'
  | 'maintained';

export type MediaItem = {
  /** Path under /public, e.g. "/screenshots/salon-admin.png" */
  src: string;
  alt: L;
  caption?: L;
};

export type Project = {
  id: string;
  title: L;
  /** One line under the title. */
  subtitle: L;
  /** Who it was for and why it exists. Two sentences at most. */
  context: L;
  year: string;
  status: ProjectStatus;
  /** Ordering on the site and in the CV. Lower comes first. */
  rank: number;
  /** Shown on the CV. Keep to four bullets or fewer. */
  highlights: LL;
  tech: string[];
  repoUrl?: string;
  liveUrl?: string;
  /** Required: a project without a screenshot does not ship. Enforced by tests. */
  media: MediaItem[];
  /** Rendered on the case-study page only. */
  caseStudy?: {
    problem: L;
    approach: LL;
    decisions?: LL;
    limits: L;
  };
};
