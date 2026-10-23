"use client";
import { useEffect, useRef } from "react";

const cssColor = (cls: string, prop: "color" | "backgroundColor", fallback: string) => {
  const el = document.createElement("div");
  el.className = cls;
  el.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
  document.body.appendChild(el);
  const v = getComputedStyle(el)[prop];
  el.remove();
  return !v || v === "rgba(0, 0, 0, 0)" ? fallback : v;
};
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, dpr = 1, gap = 34, cols = 0, rows = 0;
    let ox = new Float32Array(0), oy = new Float32Array(0);
    let color = cssColor("text-accent", "color", "#7cff6b");
    const mouse = { x: -9999, y: -9999 };
    const R = 120; // how far the cursor reaches
    let raf = 0;

    // Draws one frame; returns true while anything is still moving.
    const step = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = color;
      const cx = W / 2;
      const edge = Math.min(W / 2, 400); // dots are a little softer behind the text column
      let moving = false;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const bx = c * gap + gap / 2, by = r * gap + gap / 2;
          const dx = bx - mouse.x, dy = by - mouse.y;
          const d2 = dx * dx + dy * dy;
          let tx = 0, ty = 0, f = 0;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1;
            f = 1 - d / R;
            const push = f * f * 26; // dots are pushed away from the cursor
            tx = (dx / d) * push;
            ty = (dy / d) * push;
          }
          ox[i] += (tx - ox[i]) * 0.14;
          oy[i] += (ty - oy[i]) * 0.14;
          if (f > 0 || Math.abs(ox[i] - tx) > 0.05 || Math.abs(oy[i] - ty) > 0.05) moving = true;

          const calm = 0.7 + 0.3 * smooth(edge - 60, edge + 80, Math.abs(bx - cx));
          ctx.globalAlpha = 0.5 * calm + f * 0.5; // brighter near the cursor
          ctx.beginPath();
          ctx.arc(bx + ox[i], by + oy[i], 1.7 + f * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      return moving;
    };

    const tick = () => { raf = step() ? requestAnimationFrame(tick) : 0; };
    const wake = () => { if (!raf && !reduced) raf = requestAnimationFrame(tick); };

    const layout = () => {
      dpr = Math.min(window.devicePixelRatio, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      gap = W < 640 ? 38 : 34;
      cols = Math.ceil(W / gap) + 1;
      rows = Math.ceil(H / gap) + 1;
      ox = new Float32Array(cols * rows);
      oy = new Float32Array(cols * rows);
      step();
    };

    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; wake(); };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") { mouse.x = mouse.y = -9999; wake(); }
    };
    const onLeave = () => { mouse.x = mouse.y = -9999; wake(); };
    const onTheme = () => { color = cssColor("text-accent", "color", "#7cff6b"); step(); };

    layout();
    window.addEventListener("resize", layout);
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "style"] });
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onMove, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("resize", layout);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}