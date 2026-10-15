import type { ReactNode } from 'react';
import { SplitText } from './Reveal';

/**
 * On phones the title is violet and the number large: every other title inside a
 * section is also set in the display face, and without this the page read as one
 * level. Desktop has the size difference to do that job, so it stays white there.
 *
 * "(01) Projects" on a hairline, then the title in the display face, large
 * enough to work as the section's landmark while scrolling.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  children,
}: {
  index?: string;
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 sm:mb-12 lg:mb-16">
      <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-subtle sm:gap-4">
        {index ? (
          <span className="font-display text-[1.6rem] leading-none tracking-normal text-accent sm:font-mono sm:text-[11px] sm:tracking-[0.22em]">
            <span className="hidden sm:inline">(</span>
            {index}
            <span className="hidden sm:inline">)</span>
          </span>
        ) : null}
        <span>{eyebrow}</span>
        <span className="h-px flex-1 bg-fg/10" aria-hidden="true" />
      </p>
      <div className="mt-4 flex flex-col gap-4 sm:mt-6 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="font-display max-w-5xl text-[clamp(2.8rem,10vw,7.5rem)] text-accent lg:text-fg">
          <SplitText text={title} />
        </h2>
        {lead || children ? (
          <div className="max-w-md lg:pb-2">
            {lead ? <p className="text-[14px] leading-relaxed text-muted sm:text-[15px]">{lead}</p> : null}
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}
