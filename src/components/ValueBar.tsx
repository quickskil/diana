// src/components/ValueBar.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

type Item = {
  /** numeric goal/value (e.g., 2.5, 95, 24) */
  value: number;
  /** suffix to show after the number (e.g., '%', 's', '/7', ' min') */
  suffix?: string;
  /** top line label, short and scannable */
  label: string;
  /** tiny subcopy (use to declare "Goal", "After rollout", etc.) */
  sub?: string;
  /** optional chart values */
  /** optional progress value 0-1 */
  progress?: number;
  /** optional friendly caption */
  caption?: string;
};

const DEFAULT_ITEMS: Item[] = [
  {
    value: 44,
    suffix: '%',
    label: 'More booked consultations',
    sub: 'Full-funnel average',
    progress: 0.82,
    caption: 'Conversion-first site, coordinated campaigns, and AI follow-up increase booked meetings.',
  },
  {
    value: 93,
    suffix: '%',
    label: 'Answered leads',
    sub: '24/7 coverage',
    progress: 0.93,
    caption: 'AI receptionist qualifies inbound requests within seconds, any time of day.',
  },
  {
    value: 14,
    suffix: ' hrs',
    label: 'Hours saved monthly',
    sub: 'No chasing',
    progress: 0.7,
    caption: 'Automation handles booking confirmations and status updates.',
  },
];

/** Easing for the counter */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Count-up number that respects Reduced Motion */
function CountUp({
  to,
  suffix = '',
  duration = 900,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const shouldReduce = useReducedMotion();
  const [n, setN] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef<number | null>(null);

  useEffect(() => {
    if (shouldReduce) {
      setN(to);
      return;
    }
    const step = (ts: number) => {
      if (start.current === null) start.current = ts;
      const p = Math.min(1, (ts - start.current) / duration);
      setN(to * easeOutCubic(p));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      start.current = null;
    };
  }, [to, duration, shouldReduce]);

  const formatted = useMemo(() => {
    const isInt = Math.abs(to - Math.round(to)) < 0.0001;
    return `${isInt ? Math.round(n) : n.toFixed(1)}${suffix}`;
  }, [n, suffix, to]);

  return <span aria-live="polite">{formatted}</span>;
}

export default function ValueBar({ items = DEFAULT_ITEMS }: { items?: Item[] }) {
  const shouldReduce = useReducedMotion();

  return (
    <section aria-label="Key outcomes" className="section pt-8">
      <div
        className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        role="list"
      >
        {items.map((it, i) => (
          <motion.div
            role="listitem"
            key={it.label + i}
            initial={shouldReduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
            whileInView={shouldReduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="radiant-card"
          >
            <div className="card flex h-full flex-col gap-4 p-4">
              {!shouldReduce && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -top-1 left-0 h-px w-full opacity-30"
                  initial={{ x: '-100%' }}
                  whileInView={{ x: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, delay: 0.1 + i * 0.12 }}
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,.6), transparent)',
                  }}
                />
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-white/60">{it.label}</div>
                {it.sub && <div className="badge">{it.sub}</div>}
              </div>

              <div className="grid gap-3">
                <div className="text-3xl font-extrabold tracking-tight">
                  <CountUp to={it.value} suffix={it.suffix} />
                </div>
                {typeof it.progress === 'number' && (
                  <div className="space-y-1">
                    <div className="progress-track" aria-hidden>
                      <div
                        className="progress-bar"
                        style={{ width: `${Math.min(100, Math.max(0, it.progress * 100))}%` }}
                      />
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-white/45">Momentum</div>
                  </div>
                )}
              </div>

              {it.caption && <div className="text-xs text-white/60">{it.caption}</div>}

            </div>
          </motion.div>
        ))}
      </div>

      {/* tiny legend under the grid for transparency */}
      <div className="container mt-3 text-[11px] text-white/55">
        <div>* Results shown are typical starting points once the system is live. We tailor targets to your goals.</div>
      </div>
    </section>
  );
}
