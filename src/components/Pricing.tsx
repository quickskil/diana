'use client';
import { motion } from 'motion/react';
import { CalendarCheck } from 'lucide-react';
import {
  BASE_DEPOSIT_CENTS,
  SERVICE_LIST,
  describeSelection,
  formatCurrency as formatSelectionCurrency
} from '@/lib/plans';

const fullFunnelSummary = describeSelection({ website: true, ads: true, voice: true });

const tiers = [
  ...SERVICE_LIST.map(service => ({
    name: service.name,
    price: `${formatSelectionCurrency(BASE_DEPOSIT_CENTS)} kickoff • ${formatSelectionCurrency(service.dueAtApprovalCents)} due at approval`,
    sub: service.ongoingNote,
    bullets: service.bullets,
    cta: '#book'
  })),
  {
    name: 'Full Funnel Bundle',
    price: `${formatSelectionCurrency(BASE_DEPOSIT_CENTS)} kickoff • ${formatSelectionCurrency(fullFunnelSummary.dueAtApprovalCents)} due at approval`,
    sub: `${fullFunnelSummary.ongoingNotes.join(' • ') || 'Flexible ongoing usage'}`,
    bullets: [
      'Website, ads, and AI voice agents launched together.',
      `Bundle savings: ${formatSelectionCurrency(fullFunnelSummary.discountCents)} off when you activate all three.`,
      'Unified reporting that ties spend to booked conversations.'
    ],
    cta: '#book'
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="container space-y-10">
        <h2 className="text-center">Transparent pricing</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {tiers.map((t, i)=>(
            <motion.div
              key={t.name}
              className="radiant-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="card p-6 flex flex-col gap-4">
                <div className="text-white/60">{t.name}</div>
                <div className="text-4xl font-extrabold">{t.price}</div>
                {t.sub && <div className="text-xs text-white/55">{t.sub}</div>}
                <ul className="text-white/70 space-y-2 list-disc list-inside">
                  {t.bullets.map(b=><li key={b}>{b}</li>)}
                </ul>
                <a href={t.cta} className="btn mt-auto inline-flex items-center gap-2">
                  <CalendarCheck className="size-4" aria-hidden />
                  Book a Call
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
