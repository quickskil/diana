// src/components/Services.tsx
'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import {
  Rocket,
  Megaphone,
  MousePointerClick,
  PhoneCall,
  ChevronDown,
  ShieldCheck,
  GaugeCircle,
  Layers,
  ArrowRight,
  Sparkles,
  BadgeDollarSign,
  Headphones,
} from 'lucide-react';

type Item = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
  href: string;
  cta: string;
  bullets: string[];
  badges?: string[];
};

const ITEMS: Item[] = [
  {
    icon: Rocket,
    title: 'Websites that convert',
    desc: 'Next.js sites that load fast, rank better, and convert more.',
    href: '/services/websites',
    cta: 'See Website Plan',
    bullets: [
      'Core Web Vitals wins & SEO architecture',
      'CRO patterns (hero, proof, CTA density)',
      'Analytics + server-side tagging'
    ],
    badges: ['Next.js', 'SEO', 'CRO']
  },
  {
    icon: Megaphone,
    title: 'Meta & Google Ads',
    desc: 'Full-funnel paid media with creative testing and ROAS tracking.',
    href: '/services/google-ads',
    cta: 'See Ads Plans',
    bullets: [
      'Search & PMAX mapped to landing relevance',
      'Creative testing on Meta (short scene pacing)',
      'Clear attribution & conversion hygiene'
    ],
    badges: ['PMAX', 'Creative Testing', 'ROAS']
  },
  {
    icon: MousePointerClick,
    title: 'Funnels & CRO',
    desc: 'High-converting landing pages, A/B tests, heatmaps and UX fixes.',
    href: '/services/funnels',
    cta: 'See Funnel Plan',
    bullets: [
      'Uncluttered, goal-focused layouts',
      'A/B tests & heatmaps',
      'Lead magnets + instant scheduling'
    ],
    badges: ['LPs', 'A/B', 'Heatmaps']
  },
  {
    icon: PhoneCall,
    title: 'AI Voice Receptionists',
    desc: '24/7 call answering, scheduling & warm-transfers powered by OpenAI.',
    href: '/services/voice-agents',
    cta: 'See Voice Plan',
    bullets: [
      'Answers, qualifies, and books via Cal.com',
      'Warm transfers using a brief consult/bridge',
      'SIP/WebRTC + CRM integrations'
    ],
    badges: ['Realtime', 'Scheduling', 'Warm Transfer']
  }
];

export default function Services() {
  const reduce = useReducedMotion() ?? false; // respect users who prefer less motion. :contentReference[oaicite:2]{index=2}
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="services" className="section" aria-labelledby="services-title">
      <div className="container space-y-8">
        <h2 id="services-title" className="text-center">What we ship</h2>
        <p className="text-center text-white/70 max-w-2xl mx-auto">
          Websites, ads, and AI voice receptionists working together to capture demand and book calls.
        </p>

        <div role="list" className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ITEMS.map((it, i) => (
            <ServiceCard
              key={it.title}
              index={i}
              item={it}
              reduce={reduce}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link href="/pricing" className="btn-ghost inline-flex items-center gap-2">
            <BadgeDollarSign className="size-4" aria-hidden />
            Compare Plans
          </Link>
          <a href="/voice-demo" className="btn-ghost inline-flex items-center gap-2">
            <Headphones className="size-4" aria-hidden />
            Try Voice Demo
          </a>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  item,
  index,
  reduce,
  isOpen,
  onToggle
}: {
  item: Item;
  index: number;
  reduce: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = item.icon;
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 3D tilt on hover (softened or disabled for reduced motion)
  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduce) return;
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rotateX = (py - 0.5) * -6; // tilt up/down
      const rotateY = (px - 0.5) * 8; // tilt left/right
      el.style.setProperty('--rx', `${rotateX}deg`);
      el.style.setProperty('--ry', `${rotateY}deg`);
      el.style.setProperty('--mx', `${px * 100}%`);
      el.style.setProperty('--my', `${py * 100}%`);
    },
    [reduce]
  );

  const onMouseLeave = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty('--rx', `0deg`);
    el.style.setProperty('--ry', `0deg`);
  }, []);

  return (
    <motion.div
      role="listitem"
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 18, scale: 0.98 }}
      whileInView={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="radiant-card"
    >
      <div
        ref={containerRef}
        className="card h-full p-5 rounded-2xl will-change-transform"
        style={{
          transform:
            reduce ? undefined : 'perspective(900px) rotateX(var(--rx,0)) rotateY(var(--ry,0))'
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Hover ripple (disabled for reduced motion) */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="absolute inset-0 rounded-2xl"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.08 }}
            transition={{ duration: 0.2 }}
            style={{
              background:
                'radial-gradient(600px 200px at var(--mx, 50%) var(--my, 50%), #fff, transparent 40%)'
            }}
          />
        )}

        {/* Top row: icon + optional badges */}
        <div className="flex items-start justify-between">
          <Icon className="mb-3 opacity-90" aria-hidden />
          {item.badges && (
            <div className="hidden md:flex items-center gap-2">
              {item.badges.map((b) => (
                <span key={b} className="badge">{b}</span>
              ))}
            </div>
          )}
        </div>

        {/* Title & pitch */}
        <h3 className="font-semibold mb-1">{item.title}</h3>
        <p className="text-white/70 text-sm">{item.desc}</p>

        {/* Mini feature strip */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-white/70">
          <div className="flex items-center gap-1"><GaugeCircle className="size-4 opacity-70" /> Fast</div>
          <div className="flex items-center gap-1"><Layers className="size-4 opacity-70" /> Scalable</div>
          <div className="flex items-center gap-1"><ShieldCheck className="size-4 opacity-70" /> Reliable</div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <Link
            href={item.href}
            className="btn-ghost"
            aria-label={`${item.cta}: ${item.title}`}
          >
            <ArrowRight className="size-4" aria-hidden />
            {item.cta}
          </Link>
          <Link
            href="/contact"
            className="btn"
            aria-label={`Book a call about ${item.title}`}
          >
            <PhoneCall className="size-4" aria-hidden />
            Book a Call
          </Link>
        </div>

        {/* Expandable details: accessible Disclosure pattern (button + region) */}
        <div className="mt-3">
          <button
            className="w-full text-left text-sm text-white/80 flex items-center justify-between py-2"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls={`svc-panel-${index}`}
          >
            <span>Learn more</span>
            <ChevronDown
              className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              aria-hidden
            />
          </button>
          <motion.div
            id={`svc-panel-${index}`}
            role="region"
            aria-label={`${item.title} details`}
            initial={false}
            animate={isOpen ? 'open' : 'closed'}
            variants={{
              open: { height: 'auto', opacity: 1 },
              closed: { height: 0, opacity: 0 }
            }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <ul className="mt-1 text-white/70 text-sm space-y-1 list-disc list-inside">
              {item.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="mt-3">
              <a href="voice-demo" className="btn-ghost inline-flex items-center gap-2">
                <Sparkles className="size-4" aria-hidden />
                See it in action
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
