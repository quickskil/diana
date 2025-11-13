"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";

const DISMISS_KEY = "bb-offer-popup-dismissed";

export function OfferPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const hasDismissed = window.sessionStorage.getItem(DISMISS_KEY);

    if (hasDismissed) {
      triggeredRef.current = true;
      return;
    }

    const openPopup = () => {
      if (!triggeredRef.current) {
        triggeredRef.current = true;
        setIsOpen(true);
      }
    };

    const timer = window.setTimeout(openPopup, 10_000);

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        openPopup();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    window.sessionStorage.setItem(DISMISS_KEY, "true");
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 py-6 sm:items-center">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={closePopup}
        aria-hidden
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="Growth intensive offer"
        className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/90 shadow-2xl"
      >
        <div className="absolute -right-24 -top-24 size-64 rounded-full bg-indigo-500/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-16 -left-10 size-56 rounded-full bg-emerald-500/20 blur-3xl" aria-hidden />

        <button
          type="button"
          onClick={closePopup}
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
          aria-label="Close growth intensive offer"
        >
          <X className="size-4" aria-hidden />
        </button>

        <div className="relative space-y-6 p-8 text-white">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/70">
            <Sparkles className="size-3" aria-hidden />
            Exclusive offer
          </span>

          <div className="space-y-3">
            <h3 className="text-2xl font-semibold leading-snug md:text-3xl">
              Book our Growth Intensive and double your consults in 45 days—or we keep working free.
            </h3>
            <p className="text-sm text-white/70 md:text-base">
              Secure a full-funnel revamp: conversion audit, high-impact landing refresh, media relaunch, and AI receptionist training tuned to your calendar.
            </p>
          </div>

          <ul className="space-y-3 text-sm text-white/75">
            {[
              "Live funnel teardown with prioritized action plan",
              "Ad creative + messaging rewrites ready to launch",
              "Voice agent script training and follow-up automations",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                <span className="mt-1 block size-2 rounded-full bg-emerald-400" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-base font-semibold text-white">Only 5 new partners onboarded each month.</p>
              <p className="text-sm font-medium text-emerald-300">Save $1,200 when you book by Friday.</p>
            </div>
            <Link
              href="/contact?offer=growth-intensive"
              className="btn inline-flex h-12 w-full items-center justify-center gap-2 text-base"
              onClick={closePopup}
            >
              Claim my intensive
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <p className="text-center text-xs text-white/50">We’ll confirm your kickoff time within 1 business day.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OfferPopup;
