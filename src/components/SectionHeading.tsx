import type { ReactNode } from 'react';
import { SplitText } from './Reveal';

/**
 * A section's title, in the display face, and nothing else above it. The numbered
 * "(01) Label" line that used to sit on top was dropped in November 2026: the nav
 * already names the sections, and they are not a sequence, so the numbers said
 * nothing. The hero name stays the largest thing on the page; titles are a step
 * below it.
 *
 * On phones the title is violet: every other title inside a section is also set
 * in the display face, and without the colour the page read as one level.
 */
export function SectionHeading({ title, lead, children }: { title: string; lead?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
      <h2 className="font-display max-w-4xl text-balance text-[clamp(2.5rem,8.5vw,5.5rem)] !leading-[1.06] text-accent lg:text-fg">
        <SplitText text={title} />
      </h2>
      {lead || children ? (
        <div className="max-w-md lg:pb-1.5">
          {lead ? <p className="text-[15px] leading-relaxed text-muted sm:text-[16px]">{lead}</p> : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}
