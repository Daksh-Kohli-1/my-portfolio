import type { ReactNode } from "react";

// A bright arc that runs around the edge of whatever it sits behind.
const GRAD =
  "conic-gradient(from 0deg, transparent 0deg, transparent 230deg, currentColor 335deg, transparent 360deg)";

export const Spin = ({ s = 6, d = 0 }: { s?: number; d?: number }) => (
  <span
    aria-hidden
    className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[300%] -translate-x-1/2 -translate-y-1/2 text-accent"
  >
    <span
      className="block h-full w-full animate-spin motion-reduce:animate-none"
      style={{ background: GRAD, animationDuration: `${s}s`, animationDelay: `-${d}s` }}
    />
  </span>
);

export default function GlowBox({
  children,
  className = "",
  radius = 16,
  speed = 6,
  delay = 0,
  border = 2,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
  speed?: number; // seconds per lap
  delay?: number; // offsets the arc so boxes don't run in sync
  border?: number;
}) {
  return (
    <div className="relative" style={{ borderRadius: radius }}>
      {/* soft glow outside the box */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1 overflow-hidden opacity-60 blur-md"
        style={{ borderRadius: radius + 4 }}
      >
        <Spin s={speed} d={delay} />
      </div>
      {/* the running border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden bg-accent/20"
        style={{ borderRadius: radius }}
      >
        <Spin s={speed} d={delay} />
      </div>
      <div className={`relative bg-card ${className}`} style={{ margin: border, borderRadius: radius - border }}>
        {children}
      </div>
    </div>
  );
}