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
};

const DEFAULT_ITEMS: Item[] = [
  { value: 40, suffix: '%', label: 'More booked calls', sub: 'Average uplift' },
  { value: 95, suffix: '%', label: 'Answered leads', sub: 'After rollout' },
  { value: 24, suffix: '/7', label: 'Lead coverage', sub: 'Always on' },
  { value: 2, suffix: ' min', label: 'Speed to reply', sub: 'Live transfers' },
  { value: 12, suffix: '/mo', label: 'Extra meetings', sub: 'After hours' },
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
            <div className="card p-4 h-full">
              {/* subtle top shimmer */}
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

              <div className="mt-1 text-3xl md:text-4xl font-extrabold tracking-tight">
                <CountUp to={it.value} suffix={it.suffix} />
              </div>

              {/* micro caption that connects to business outcomes */}
              <div className="mt-2 text-xs text-white/60">
                {it.label === 'More booked calls' && 'Launch pages and ads that make the next step obvious.'}
                {it.label === 'Answered leads' && 'Voice receptionist greets every caller in seconds.'}
                {it.label === 'Lead coverage' && 'Always-on follow-up so interest never slips away.'}
                {it.label === 'Speed to reply' && 'Live transfers while the lead is still on the line.'}
                {it.label === 'Extra meetings' && 'After-hours scheduling fills your mornings with new calls.'}
              </div>

              {/* hover lift / ripple */}
              {!shouldReduce && (
                <motion.div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.08 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background:
                      'radial-gradient(600px 200px at var(--mx, 50%) var(--my, 50%), #fff, transparent 40%)',
                  }}
                  onMouseMove={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    const rect = el.getBoundingClientRect();
                    el.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
                    el.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
                  }}
                />
              )}
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
