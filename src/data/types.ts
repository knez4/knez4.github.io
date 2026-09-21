/** A string that exists in both site languages. */
export type L = { en: string; sr: string };
/** A bullet list that exists in both site languages. */
export type LL = { en: string[]; sr: string[] };

export type ProjectStatus =
  | 'prototype'
  | 'delivered'
  | 'coursework'
  | 'maintained'
  /** Written, but never finished or run. Not a prototype: nothing has worked yet. */
  | 'unfinished';

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
  /** A single repo (most projects: one codebase, one link). */
  repoUrl?: string;
  /** Multiple named repos, for a project bundling more than one codebase. */
  repos?: { label: string; url: string }[];
  /**
   * CV-only line standing in for a missing repo link. Without it the reader sees
   * one project linked and the next not, and reads the gap as carelessness
   * rather than as a team repo that is not his to publish.
   */
  repoNote?: L;
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
