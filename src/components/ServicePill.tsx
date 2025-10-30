import * as React from "react";

type ServicePillProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: string;
};

export default function ServicePill({
  label = "Service",
  className = "",
  style,
  ...rest
}: ServicePillProps) {
  const mergedStyle: React.CSSProperties = {
    background: "rgba(255,255,255,.04)",
    ...(style ?? {}),
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] border border-white/10 ${className}`.trim()}
      style={mergedStyle}
      {...rest}
    >
      <span
        aria-hidden
        className="inline-block size-1.5 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(139,92,246,.9), rgba(96,165,250,.9))",
        }}
      />
      {label}
    </div>
  );
}
