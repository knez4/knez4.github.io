import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { bookingFunction, relations, tables } from '../data/schema';
import type { Table } from '../data/schema';
import { useLang } from '../lib/useLang';

type Edge = { key: string; d: string; from: string; to: string };

const groupTint: Record<Table['group'], string> = {
  tenant: 'border-accent/40',
  catalog: 'border-line',
  schedule: 'border-line',
  booking: 'border-key/40',
};

/**
 * Connection lines are drawn from measured DOM positions rather than hard-coded
 * coordinates, so the diagram survives a font change or a language switch that
 * makes a table card taller.
 */
function useEdges(
  containerRef: React.RefObject<HTMLDivElement>,
  nodeRefs: React.MutableRefObject<Map<string, HTMLElement>>,
  enabled: boolean,
) {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container || !enabled) {
      setEdges([]);
      return;
    }
    const base = container.getBoundingClientRect();
    setSize({ w: base.width, h: base.height });

    const next: Edge[] = [];
    for (const rel of relations) {
      const a = nodeRefs.current.get(rel.from);
      const b = nodeRefs.current.get(rel.to);
      if (!a || !b) continue;

      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();

      const cxA = ra.left + ra.width / 2;
      const cxB = rb.left + rb.width / 2;
      const cyA = ra.top + ra.height / 2;
      const cyB = rb.top + rb.height / 2;

      let d: string;

      if (Math.abs(cxB - cxA) < ra.width * 0.6) {
        // Same column: leave from the bottom or top edge, otherwise the curve
        // would sweep sideways across the boxes in between.
        const down = cyA < cyB;
        const x1 = cxA - base.left;
        const y1 = (down ? ra.bottom : ra.top) - base.top;
        const x2 = cxB - base.left;
        const y2 = (down ? rb.top : rb.bottom) - base.top;
        const dy = Math.max(16, Math.abs(y2 - y1) * 0.5);
        d = `M ${x1} ${y1} C ${x1} ${down ? y1 + dy : y1 - dy}, ${x2} ${
          down ? y2 - dy : y2 + dy
        }, ${x2} ${y2}`;
      } else {
        // Leave from the side of A that faces B.
        const aRight = cxA < cxB;
        const x1 = (aRight ? ra.right : ra.left) - base.left;
        const y1 = cyA - base.top;
        const x2 = (aRight ? rb.left : rb.right) - base.left;
        const y2 = cyB - base.top;
        const dx = Math.max(20, Math.abs(x2 - x1) * 0.45);
        d = `M ${x1} ${y1} C ${aRight ? x1 + dx : x1 - dx} ${y1}, ${
          aRight ? x2 - dx : x2 + dx
        } ${y2}, ${x2} ${y2}`;
      }

      next.push({ key: `${rel.from}->${rel.to}`, from: rel.from, to: rel.to, d });
    }
    setEdges(next);
  }, [containerRef, nodeRefs, enabled]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => measure());
    ro.observe(container);
    for (const el of nodeRefs.current.values()) ro.observe(el);

    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [containerRef, nodeRefs, measure, enabled]);

  return { edges, size };
}

export function SchemaDiagram() {
  const { t, pick, lang } = useLang();
  const [selectedId, setSelectedId] = useState<string>('appointments');
  const [wide, setWide] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const { edges, size } = useEdges(containerRef, nodeRefs, wide);
  const selected = tables.find((tb) => tb.id === selectedId) ?? tables[0];

  const isActive = (edge: Edge) => edge.from === selectedId || edge.to === selectedId;

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
      {/* Diagram */}
      <div ref={containerRef} className="relative">
        {wide ? (
          <svg
            className="pointer-events-none absolute inset-0 z-0"
            width={size.w}
            height={size.h}
            aria-hidden="true"
          >
            {edges.map((e) => (
              <path
                key={e.key}
                d={e.d}
                fill="none"
                stroke={isActive(e) ? 'rgb(var(--accent))' : 'rgb(var(--rel))'}
                strokeWidth={isActive(e) ? 1.8 : 1}
                strokeOpacity={isActive(e) ? 0.9 : 0.35}
              />
            ))}
          </svg>
        ) : null}

        <ul
          className="relative z-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-5 xl:gap-x-5 xl:gap-y-10"
          role="list"
        >
          {tables.map((tb) => {
            const active = tb.id === selectedId;
            return (
              <li
                key={tb.id}
                style={wide ? { gridColumn: tb.col + 1, gridRow: tb.row + 1 } : undefined}
                ref={(el) => {
                  if (el) nodeRefs.current.set(tb.id, el);
                  else nodeRefs.current.delete(tb.id);
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedId(tb.id)}
                  aria-pressed={active}
                  className={
                    'w-full rounded-lg border bg-surface px-2.5 py-2 text-left transition-colors ' +
                    (active
                      ? 'border-accent bg-accent-soft/60 text-fg'
                      : `${groupTint[tb.group]} text-muted hover:bg-surface-2 hover:text-fg`)
                  }
                >
                  {/* Zero-width spaces after underscores so a long name wraps at a
                      readable point instead of mid-word. */}
                  <span className="block break-words font-mono text-[11px] font-medium leading-tight">
                    {tb.name.replace(/_/g, '_​')}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] text-subtle">
                    {tb.columns.length} {lang === 'en' ? 'cols' : 'kol.'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Detail panel */}
      <aside className="card p-5" aria-live="polite">
        <p className="eyebrow">{t('schema.selectHint')}</p>
        <h3 className="mt-2 font-mono text-lg font-semibold">{selected.name}</h3>

        <p className="mt-3 text-sm leading-relaxed text-muted">{pick(selected.purpose)}</p>

        <h4 className="mt-5 font-mono text-[11px] uppercase tracking-[0.15em] text-subtle">
          {t('schema.columns')}
        </h4>
        <ul className="mt-2 space-y-1.5">
          {selected.columns.map((c) => (
            <li key={c.name} className="flex flex-wrap items-baseline gap-x-2 font-mono text-[12px]">
              <span className="text-fg">{c.name}</span>
              <span className="text-subtle">{c.type}</span>
              {c.pk ? <span className="text-key">PK</span> : null}
              {c.fk ? <span className="text-accent">&rarr; {c.fk}</span> : null}
              {c.note ? <span className="text-subtle">({pick(c.note)})</span> : null}
            </li>
          ))}
        </ul>

        {selected.rls ? (
          <>
            <h4 className="mt-5 font-mono text-[11px] uppercase tracking-[0.15em] text-subtle">
              {t('schema.rls')}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-muted">{pick(selected.rls)}</p>
          </>
        ) : null}
      </aside>

      {/* The function, spanning both columns */}
      <div className="card p-5 xl:col-span-2">
        <p className="eyebrow">{t('schema.functionTitle')}</p>
        <h3 className="mt-2 font-mono text-base font-semibold">{bookingFunction.name}()</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">{pick(bookingFunction.summary)}</p>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {pick(bookingFunction.steps).map((step, i) => (
            <li key={step} className="rounded-lg border border-line bg-surface-2 p-3">
              <span className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
