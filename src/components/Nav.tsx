// src/components/Nav.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Menu, X, ChevronDown,
  Rocket, Search, Megaphone, MousePointerClick, PhoneCall,
  Headphones, CalendarCheck, ArrowRight, LogIn, LogOut, LayoutDashboard
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/about', label: 'About' },
];

const SERVICES = [
  {
    icon: Rocket,
    title: 'Websites that convert',
    href: '/services/websites',
    blurb: 'Fast, clean pages that guide visitors straight to booking.',
    chip: 'Start at $499'
  },
  {
    icon: Search,
    title: 'Google Ads',
    href: '/services/google-ads',
    blurb: 'Be found when intent is highest with hand-tuned campaigns.',
    chip: 'Simple 10% mgmt'
  },
  {
    icon: Megaphone,
    title: 'Meta Ads',
    href: '/services/meta-ads',
    blurb: 'Reach more of the right people with creative testing.',
    chip: 'Creative help'
  },
  {
    icon: MousePointerClick,
    title: 'Funnels & CRO',
    href: '/services/funnels',
    blurb: 'Clear steps that convert clicks into booked conversations.',
    chip: 'A/B friendly'
  },
  {
    icon: PhoneCall,
    title: 'AI Voice Receptionists',
    href: '/services/voice-agents',
    blurb: 'Answers 24/7, books meetings, and warm-transfers.',
    chip: 'Live demo'
  },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { hydrated, currentUser, logout } = useAuth();
  const isAuthed = hydrated && !!currentUser;
  const dashboardHref = currentUser?.role === 'admin' ? '/admin' : '/dashboard';
  const dashboardLabel = currentUser?.role === 'admin' ? 'Admin' : 'Dashboard';
  const clientPortalLabel = isAuthed ? dashboardLabel : 'Client Portal';
  const reduce = useReducedMotion();

  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);      // mobile drawer
  const [svcOpen, setSvcOpen] = useState(false);// desktop mega
  const [accountOpen, setAccountOpen] = useState(false);
  const lastY = useRef(0);

  // headroom + atTop
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setAtTop(y < 8);
      const goingDown = y > lastY.current && y > 56;
      setHidden(goingDown && !open && !svcOpen);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open, svcOpen]);

  // disable body scroll when drawer open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      setSvcOpen(false);
      setAccountOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // progress line
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const sh = document.documentElement.scrollHeight - window.innerHeight;
      setProg(sh > 0 ? Math.min(1, (window.scrollY || 0) / sh) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  // ---- Mega hover intent (forgiving) ----
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const megaWrapRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const accountWrapRef = useRef<HTMLDivElement | null>(null);
  const accountTriggerRef = useRef<HTMLButtonElement | null>(null);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const clearTimers = () => {
    if (openTimer.current) { window.clearTimeout(openTimer.current); openTimer.current = null; }
    if (closeTimer.current) { window.clearTimeout(closeTimer.current); closeTimer.current = null; }
  };
  const scheduleOpen = (delay = 40) => { clearTimers(); openTimer.current = window.setTimeout(() => setSvcOpen(true), delay); };
  const scheduleClose = (delay = 140) => { clearTimers(); closeTimer.current = window.setTimeout(() => setSvcOpen(false), delay); };

  // outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!svcOpen) return;
      const t = e.target as Node;
      if (megaWrapRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setSvcOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [svcOpen]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!accountOpen) return;
      const target = e.target as Node;
      if (accountWrapRef.current?.contains(target)) return;
      setAccountOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [accountOpen]);

  const isServicesActive = pathname?.startsWith('/services');

  // Use logo hues for ring
  const ring = 'linear-gradient(135deg, rgba(139,92,246,.95), rgba(96,165,250,.9))';

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-black/80 focus:px-3 focus:py-2 focus:text-white">Skip to content</a>

      <motion.nav
        initial={false}
        animate={{
          y: hidden ? -72 : 0,
          // Avoid transforms on ANCESTORS of the panel to prevent stacking context surprises
          backgroundColor: atTop ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.45)',
          backdropFilter: atTop ? 'blur(0px)' : 'blur(10px)',
        }}
        transition={reduce ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}
        className={`sticky top-0 z-[55] border-b ${atTop ? 'border-transparent' : 'border-white/10'}`} // z-[55] below panel’s z-[60]
        aria-label="Main"
      >
        {/* progress */}
        <div aria-hidden className="h-0.5 bg-gradient-to-r from-fuchsia-500 via-sky-400 to-emerald-400" style={{ width: `${prog * 100}%` }} />

        <div className="container py-3 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-32">
              <Image src="/theme/img/logo.png" alt="Business Booster AI logo" fill priority sizes="128px" className="object-contain" />
            </div>
            <span className="font-semibold tracking-wide">Business Booster AI</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {/* Services trigger + panel wrapper (relative, z context) */}
            <div
              className="relative z-[60]" // higher than nav
              ref={megaWrapRef}
              onMouseEnter={() => scheduleOpen(40)}
              onMouseLeave={() => scheduleClose(140)}
            >
              <button
                ref={triggerRef}
                type="button"
                className={`btn-ghost inline-flex h-8 items-center gap-1 px-3 text-[13px] ${isServicesActive ? 'ring-1 ring-white/30' : ''}`}
                aria-haspopup="true"
                aria-expanded={svcOpen}
                aria-controls="services-mega"
                onClick={() => setSvcOpen(v => !v)}
                onFocus={() => setSvcOpen(true)}
              >
                Services <ChevronDown className="size-4 opacity-80 transition" style={{ transform: svcOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              {/* MEGA PANEL */}
              <motion.div
                id="services-mega"
                role="menu"
                initial={false}
                animate={{ opacity: svcOpen ? 1 : 0, y: svcOpen ? 0 : -6, pointerEvents: svcOpen ? 'auto' : 'none' }}
                transition={reduce ? { duration: 0 } : { duration: 0.16, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-3 w-[min(90vw,640px)] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur"
                // overlap the trigger a bit to remove any “hover gap”
                onMouseEnter={() => scheduleOpen(0)}
                onMouseLeave={() => scheduleClose(140)}
                onMouseDownCapture={(e) => e.stopPropagation()}
              >
                <div className="p-5">
                  <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-[12px] uppercase tracking-[0.24em] text-white/50">What we do</div>
                      <div className="text-white/95 text-lg font-semibold">Growth systems that book more conversations</div>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-white/60">
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1">
                        <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
                        Fast onboarding
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1">
                        <span className="size-1.5 rounded-full bg-sky-400" aria-hidden />
                        Live collaboration
                      </span>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.title}
                        href={s.href}
                        className="group relative flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_15px_35px_-20px_rgba(15,23,42,0.8)] transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_20px_45px_-18px_rgba(56,189,248,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
                        onClick={() => setSvcOpen(false)}
                      >
                        <div className="flex items-start gap-3">
                          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sky-100 ring-1 ring-white/15">
                            <s.icon className="size-5" aria-hidden />
                          </span>
                          <div>
                            <div className="font-semibold tracking-tight text-white group-hover:text-sky-100 group-hover:underline group-hover:decoration-sky-300/80 group-hover:underline-offset-4">
                              {s.title}
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-white/70">{s.blurb}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[12px] text-white/65">
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-medium tracking-wide">
                            {s.chip}
                          </span>
                          <span className="inline-flex items-center gap-2 font-medium text-sky-200 opacity-0 transition-opacity group-hover:opacity-100">
                            Explore
                            <ArrowRight className="size-3.5" aria-hidden />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div aria-hidden className="my-6 h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />

                  <div className="flex flex-wrap items-center gap-2 text-[13px]">
                    <a href="/voice-demo" className="btn-ghost h-10 gap-2">
                      <Headphones className="size-4" />
                      Try the Live Voice Demo
                    </a>
                    <Link href="/pricing" className="btn-ghost h-10 gap-2">
                      <CalendarCheck className="size-4" />
                      See Packages & Pricing
                    </Link>
                    <Link href="/contact" className="btn h-10 gap-2 ml-auto">
                      <PhoneCall className="size-4" />
                      Book a Call
                    </Link>
                  </div>

                  <p className="mt-3 text-[12px] text-white/65">Friendly chat. Clear plan. Launch together when it feels right.</p>
                </div>
              </motion.div>
            </div>

            {/* other links */}
            <div className="flex items-center gap-1 text-[13px]">
              {LINKS.filter(l => l.href !== '/services').map(l => {
                const active = pathname?.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`btn-ghost h-8 px-2.5 ${active ? 'ring-1 ring-white/30' : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <a href="/voice-demo" className="btn-ghost h-8 px-2.5">Voice Demo</a>
              <Link
                href="/contact"
                className="btn h-9 px-3 font-semibold shadow-lg shadow-sky-500/25 transition hover:shadow-sky-500/40"
              >
                <PhoneCall className="mr-1.5 size-3.5" aria-hidden />
                Book a Call
              </Link>
            </div>
            <div
              className="relative ml-6 flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-1.5 py-1"
              ref={accountWrapRef}
              onBlur={(event) => {
                const next = event.relatedTarget as Node | null;
                if (next && accountWrapRef.current?.contains(next)) return;
                setAccountOpen(false);
              }}
            >
              <button
                ref={accountTriggerRef}
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 px-3 py-1 text-[13px] font-medium text-white shadow-lg shadow-sky-500/25 transition hover:shadow-sky-500/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                aria-controls="account-menu"
                onClick={() => setAccountOpen((v) => !v)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    setAccountOpen(true);
                    const firstItem = accountMenuRef.current?.querySelector<HTMLElement>('[data-menuitem]');
                    firstItem?.focus();
                  }
                }}
              >
                {isAuthed ? <LayoutDashboard className="size-4" /> : <LogIn className="size-4" />}
                <span>{clientPortalLabel}</span>
                <ChevronDown className="size-4" aria-hidden />
              </button>

              <motion.div
                id="account-menu"
                ref={accountMenuRef}
                initial={false}
                animate={{
                  opacity: accountOpen ? 1 : 0,
                  y: accountOpen ? 0 : -6,
                  pointerEvents: accountOpen ? 'auto' : 'none'
                }}
                transition={reduce ? { duration: 0 } : { duration: 0.16, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-2 w-60 rounded-2xl p-[1px] shadow-2xl"
                style={{ background: ring }}
                role="menu"
                aria-label="Account"
              >
                <div className="rounded-2xl border border-white/10 bg-black/85 py-3 text-[13px]">
                  {isAuthed ? (
                    <>
                      <Link
                        href={dashboardHref}
                        className="flex items-center gap-2 px-4 py-2 text-white/90 transition hover:bg-white/10 focus-visible:bg-white/10"
                        role="menuitem"
                        data-menuitem
                        onClick={() => setAccountOpen(false)}
                      >
                        <LayoutDashboard className="size-4" />
                        <span>{dashboardLabel}</span>
                      </Link>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-white/90 transition hover:bg-white/10 focus-visible:bg-white/10"
                        role="menuitem"
                        data-menuitem
                        onClick={async () => {
                          await logout();
                          setAccountOpen(false);
                          router.push('/');
                          accountTriggerRef.current?.focus();
                        }}
                      >
                        <LogOut className="size-4" />
                        <span>Log out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex items-center gap-2 px-4 py-2 text-white/90 transition hover:bg-white/10 focus-visible:bg-white/10"
                        role="menuitem"
                        data-menuitem
                        onClick={() => setAccountOpen(false)}
                      >
                        <LogIn className="size-4" />
                        <span>Client Portal</span>
                      </Link>
                      <p className="px-4 pt-1 text-[12px] text-white/65">
                        Create your workspace inside — we’ll map out onboarding together before any payments are due.
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            aria-label="Open menu"
            aria-controls="site-menu"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile drawer */}
        <motion.div
          id="site-menu"
          initial={false}
          animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.2 }}
          className="md:hidden overflow-hidden border-t border-white/10"
        >
          <div className="container py-2">
            <ul className="flex flex-col gap-1 py-1">
              <li>
                <details className="group rounded-lg">
                  <summary className="flex w-full items-center justify-between rounded-lg px-3 py-2 hover:bg-white/10 cursor-pointer">
                    <span>Services</span>
                    <ChevronDown className="size-4 group-open:rotate-180 transition" />
                  </summary>
                  <div className="mt-1 grid grid-cols-1 gap-1">
                    {SERVICES.map(s => (
                      <Link
                        key={s.title}
                        href={s.href}
                        className="block rounded-lg px-3 py-2 hover:bg:white/10 hover:bg-white/10"
                        onClick={() => setOpen(false)}
                      >
                        <div className="flex items-start gap-2">
                          <s.icon className="size-4 mt-0.5 opacity-90" />
                          <div>
                            <div className="font-medium">{s.title}</div>
                            <div className="text-xs text-white/70">{s.blurb}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <a href="/voice-demo" className="mt-1 inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/10" onClick={() => setOpen(false)}>
                      <Headphones className="size-4" /> Try the Live Voice Demo
                    </a>
                  </div>
                </details>
              </li>

              {LINKS.filter(l => l.href !== '/services').map(l => {
                const active = pathname?.startsWith(l.href);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className={`block w-full rounded-lg px-3 py-2 hover:bg-white/10 ${active ? 'bg-white/10' : ''}`}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}

              <li className="pt-1 space-y-2">
                <Link href="/contact" className="btn w-full" onClick={() => setOpen(false)}>Book a Call</Link>
                {isAuthed ? (
                  <>
                    <Link
                      href={dashboardHref}
                      className="btn-ghost w-full"
                      onClick={() => setOpen(false)}
                    >
                      {dashboardLabel}
                    </Link>
                    <button
                      type="button"
                      className="btn-ghost w-full"
                      onClick={() => {
                        setOpen(false);
                        logout();
                        router.push('/');
                      }}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="btn-ghost w-full" onClick={() => setOpen(false)}>
                      Client Portal
                    </Link>
                    <p className="px-3 text-center text-xs text-white/55">
                      Create your account inside — we’ll invite you to collaborate after onboarding.
                    </p>
                  </>
                )}
              </li>
            </ul>
            <div className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[12px] text-white/65">
              <div className="font-semibold text-white">Need something custom?</div>
              <p>
                Send over your goals and we’ll outline the exact mix of services we recommend—typically within one business day.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-sky-200 hover:text-sky-100"
                onClick={() => setOpen(false)}
              >
                Start a conversation
                <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
}
