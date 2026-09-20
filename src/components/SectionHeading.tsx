import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {lead ? <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{lead}</p> : null}
      </div>
      {children}
    </div>
  );
}
