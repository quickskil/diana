// components/RequestCallbackButton.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  label?: string;
  className?: string;
  disabled?: boolean; // you already disable it server-side when creds are missing
};

export default function RequestCallbackButton({
  label = "☎️ Request a callback",
  className = "btn h-12 px-6 rounded-xl",
  disabled = false,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [hint, setHint] = useState<string>("");
  const liveRef = useRef<HTMLDivElement | null>(null);

  // mark as "ready" once the script attaches something usable
  useEffect(() => {
    const hasAnyHandle =
      (globalThis as any)?.Retell?.openCallbackWidget ||
      (globalThis as any)?.RetellWidget?.open ||
      document.querySelector('[data-retell-widget-button], .retell-callback-button, iframe[src*="retell"]');

    if (hasAnyHandle) setStatus("ready");

    // try again shortly in case script loads a bit later
    const t = setTimeout(() => {
      const now =
        (globalThis as any)?.Retell?.openCallbackWidget ||
        (globalThis as any)?.RetellWidget?.open ||
        document.querySelector('[data-retell-widget-button], .retell-callback-button, iframe[src*="retell"]');
      if (now && status === "idle") setStatus("ready");
    }, 1200);

    return () => clearTimeout(t);
  }, [status]);

  const announce = (msg: string) => {
    setHint(msg);
    // aria-live region
    if (liveRef.current) {
      liveRef.current.textContent = msg;
    }
  };

  const tryOpen = useCallback((): boolean => {
    const w = globalThis as any;

    // 1) Official-looking handles (try most specific first)
    if (w?.Retell?.openCallbackWidget) {
      w.Retell.openCallbackWidget();
      return true;
    }
    if (w?.RetellWidget?.open) {
      w.RetellWidget.open(); // some builds expose this
      return true;
    }

    // 2) Known DOM affordances (button injected by the widget)
    const btn = document.querySelector(
      '[data-retell-widget-button], .retell-callback-button',
    ) as HTMLElement | null;
    if (btn) {
      btn.click();
      return true;
    }

    // 3) PostMessage to iframe, if present (best-effort)
    const iframe = document.querySelector(
      'iframe[src*="retell"]',
    ) as HTMLIFrameElement | null;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        { type: "RETELL_OPEN_CALLBACK" },
        "*",
      );
      return true;
    }

    return false;
  }, []);

  const onClick = async () => {
    if (disabled) return;
    setStatus("loading");
    announce("Opening the callback widget…");

    const ok = tryOpen();
    if (ok) {
      setStatus("ready");
      announce("Callback widget opened.");
      // clear hint after a moment
      setTimeout(() => setHint(""), 1500);
    } else {
      setStatus("error");
      announce("Widget is still loading. If nothing appears, please refresh.");
    }
  };

  return (
    <div className="inline-flex flex-col items-center">
      <button
        type="button"
        className={`${className} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        aria-disabled={disabled || status === "loading"}
        onClick={onClick}
      >
        {status === "loading" ? "⏳ Opening…" : label}
      </button>

      {/* subtle, non-intrusive helper text */}
      <div
        className={`mt-1 text-[11px] ${
          status === "error"
            ? "text-rose-300/90"
            : status === "loading"
            ? "text-white/70"
            : "text-white/50"
        }`}
      >
        {hint || ""}
      </div>

      {/* aria-live region for SR users */}
      <div
        ref={liveRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
    </div>
  );
}
