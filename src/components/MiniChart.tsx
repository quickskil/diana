// src/components/MiniChart.tsx
"use client";

import { useId, useMemo } from "react";

const PALETTE: Record<"violet" | "sky" | "emerald", { stroke: string; fill: string }> = {
  violet: { stroke: "#c084fc", fill: "rgba(139, 92, 246, 0.22)" },
  sky: { stroke: "#38bdf8", fill: "rgba(14, 165, 233, 0.22)" },
  emerald: { stroke: "#34d399", fill: "rgba(52, 211, 153, 0.22)" },
};

export type MiniChartProps = {
  values: number[];
  color?: "violet" | "sky" | "emerald";
  ariaLabel?: string;
  className?: string;
};

export default function MiniChart({ values, color = "violet", ariaLabel, className }: MiniChartProps) {
  const gradientId = useId();

  const { path, area, lastPoint } = useMemo(() => {
    const safeValues = values.length > 1 ? values : [...values, values[0] ?? 0];
    const max = Math.max(...safeValues);
    const min = Math.min(...safeValues);
    const range = max - min || 1;

    const width = 120;
    const height = 60;
    const padX = 6;
    const padY = 8;
    const innerHeight = height - padY * 2;
    const innerWidth = width - padX * 2;

    const points = safeValues.map((value, index) => {
      const x = padX + (innerWidth * index) / (safeValues.length - 1);
      const y = height - padY - ((value - min) / range) * innerHeight;
      return [Number(x.toFixed(2)), Number(y.toFixed(2))] as const;
    });

    const line = points.map(([x, y], idx) => `${idx === 0 ? "M" : "L"}${x} ${y}`).join(" ");
    const baselineY = height - padY;
    const areaPath = `${line} L ${points.at(-1)?.[0] ?? width} ${baselineY} L ${points[0]?.[0] ?? 0} ${baselineY} Z`;

    return { path: line, area: areaPath, lastPoint: points.at(-1) ?? [width, baselineY] };
  }, [values]);

  const palette = PALETTE[color];

  return (
    <div className={`mini-chart ${className ?? ""}`}>
      <svg
        viewBox="0 0 120 60"
        role={ariaLabel ? "img" : "presentation"}
        aria-label={ariaLabel}
        aria-hidden={ariaLabel ? undefined : true}
        focusable="false"
      >
        <defs>
          <linearGradient id={`fill-${gradientId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.fill} stopOpacity={0.95} />
            <stop offset="100%" stopColor={palette.fill} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#fill-${gradientId})`} stroke="none" />
        <path d={path} fill="none" stroke={palette.stroke} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={lastPoint[0]} cy={lastPoint[1]} r={3.5} fill={palette.stroke} stroke="rgba(15,23,42,0.9)" strokeWidth={1.5} />
      </svg>
    </div>
  );
}
