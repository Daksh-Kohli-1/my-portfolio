"use client";
import { useEffect, useRef, useState } from "react";
import { Spin } from "@/components/GlowBox";
import { site } from "@/data/site";

// ✏️ Placeholder text for the back of the pendant. Replace it with your own.
const BIO =
  "Hey, I'm Daksh. I build clean, fast and simple things for the web, from backends that behave to interfaces that feel alive. I learn by shipping side projects, breaking things on purpose, and caring about the details most people never notice.";

// Pendulum feel: K = stiffness, C = damping (C_CALM is used while you reach for the Resume tab).
// KB/CB do the same for the loose hinge between the rope and the pendant.
const K = 6.8, C = 1.1, C_CALM = 9, KB = 38, CB = 3.4;
const OCT = "polygon(29.3% 0%, 70.7% 0%, 100% 29.3%, 100% 70.7%, 70.7% 100%, 29.3% 100%, 0% 70.7%, 0% 29.3%)";
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

const face: React.CSSProperties = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  clipPath: OCT,
};

export default function IdBadge() {
  const [flipped, setFlipped] = useState(false);
  const [ready, setReady] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLAnchorElement>(null);
  const S = useRef({
    a: 0, av: 0, // rope angle + angular velocity
    b: 0, bv: 0, // pendant angle relative to the clasp + velocity
    drag: false, moved: false, calm: false,
    sx: 0, sy: 0, off: 0, pivotX: 0, pivotY: 0, lastT: 0,
  });

  const flip = () => {
    setFlipped((f) => !f);
    S.current.av += (Math.random() < 0.5 ? -1 : 1) * 0.4;
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = S.current;
    const swing = swingRef.current!, wrap = wrapRef.current!, tab = tabRef.current!, card = cardRef.current!;
    s.a = 0;
    const fade = requestAnimationFrame(() => setReady(true));

    // Initial push: it swings in once, then settles and behaves normally.
    const push = reduced ? 0 : window.setTimeout(() => { s.av = -1.7; s.bv = 1.2; }, 450);

    let raf = 0, last = performance.now(), prevAv = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.033, Math.max(0.001, (now - last) / 1000));
      last = now;
      const calm = s.calm;

      if (!s.drag) {
        const wind = reduced || calm ? 0 : (Math.sin(now * 0.0006) * 0.35 + Math.sin(now * 0.00137) * 0.2) * 0.25;
        const acc = -K * Math.sin(s.a) - (calm ? C_CALM : C) * s.av + wind;
        s.av = clamp(s.av + acc * dt, -6, 6);
        s.a = clamp(s.a + s.av * dt, -1.3, 1.3);
      } else if (now - s.lastT > 60) {
        s.av *= 0.8;
      }

      const accA = clamp((s.av - prevAv) / dt, -60, 60);
      prevAv = s.av;
      s.bv += (-KB * s.b - (calm ? CB * 2.5 : CB) * s.bv - 0.7 * accA) * dt;
      s.b = clamp(s.b + s.bv * dt, -0.7, 0.7);

      swing.style.transform = `rotate(${s.a}rad)`;
      wrap.style.transform = `rotate(${s.b}rad)`;
      tab.style.transform = `rotate(${-s.b * 0.6}rad)`;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || s.drag) return;

      // Near the Resume tab: stop swinging and settle so it can be clicked.
      const tr = tab.getBoundingClientRect();
      const m = 70;
      s.calm = e.clientX > tr.left - m && e.clientX < tr.right + m && e.clientY > tr.top - m && e.clientY < tr.bottom + m;
      if (reduced || s.calm) return;

      // Elsewhere near the pendant: only a gentle nudge.
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const d = Math.hypot((e.clientX - cx) / 300, (e.clientY - cy) / 230);
      const infl = clamp(1 - d, 0, 1);
      if (infl > 0) {
        const nv = s.av - e.movementX * 0.0035 * infl;
        if (Math.abs(nv) < 0.9 || Math.abs(nv) < Math.abs(s.av)) s.av = nv;
      }
    };
    const onLeave = () => { s.calm = false; };

    const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const onVis = () => (document.hidden ? stop() : start());

    start();
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      cancelAnimationFrame(fade);
      clearTimeout(push);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // ---- drag to swing, tap to flip ----
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = S.current;
    const r = boxRef.current!.getBoundingClientRect();
    s.pivotX = r.left + r.width / 2;
    s.pivotY = r.top;
    s.drag = true;
    s.calm = false;
    s.moved = false;
    s.sx = e.clientX;
    s.sy = e.clientY;
    s.off = s.a - Math.atan2(-(e.clientX - s.pivotX), e.clientY - s.pivotY);
    s.lastT = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = S.current;
    if (!s.drag) return;
    if (Math.hypot(e.clientX - s.sx, e.clientY - s.sy) > 6) s.moved = true;
    if (!s.moved) return;
    const na = clamp(Math.atan2(-(e.clientX - s.pivotX), e.clientY - s.pivotY) + s.off, -1, 1);
    const now = performance.now();
    const dt = Math.max(0.008, (now - s.lastT) / 1000);
    s.av = clamp((na - s.a) / dt, -9, 9);
    s.a = na;
    s.lastT = now;
  };
  const onUp = () => {
    const s = S.current;
    if (!s.drag) return;
    s.drag = false;
    if (!s.moved) flip();
    else if (performance.now() - s.lastT > 80) s.av = 0;
  };
  const onCancel = () => { S.current.drag = false; };

  return (
    <div
      ref={boxRef}
      className={`pointer-events-none relative z-30 mx-auto h-[520px] w-[300px] select-none transition-opacity duration-700 md:fixed md:-top-[90px] md:right-8 md:mx-0 md:h-[660px] md:w-[380px] lg:right-16 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* phones: small pin so the rope has something to hang from */}
      <span className="pointer-events-none absolute -top-1.5 left-1/2 z-20 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-accent md:hidden" />

      <div ref={swingRef} className="absolute inset-0" style={{ transformOrigin: "50% 0", willChange: "transform" }}>
        {/* rope: on desktop it starts above the top edge of the page */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[150px] w-5 -translate-x-1/2 border-x border-accent/60 bg-accent/80 md:h-[210px]"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, transparent 0 6px, rgba(0,0,0,0.18) 6px 9px)" }}
        />

        <div
          ref={wrapRef}
          className="absolute inset-x-0 top-[150px] flex flex-col items-center md:top-[210px]"
          style={{ transformOrigin: "50% 0", willChange: "transform" }}
        >
          {/* soft glow behind the pendant */}
          <div className="pointer-events-none absolute left-1/2 top-[110px] h-64 w-64 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />

          {/* clasp + ring */}
          <div className="pointer-events-none absolute -top-1.5 left-1/2 z-10 h-9 w-[26px] -translate-x-1/2 rounded-md border-2 border-muted bg-card">
            <span className="absolute inset-x-1.5 top-2 h-[3px] rounded-full bg-muted/60" />
          </div>
          <span className="pointer-events-none absolute left-1/2 top-[10px] z-10 h-5 w-5 -translate-x-1/2 rounded-full border-2 border-muted bg-bg" />

          {/* octagon pendant */}
          <div className="pointer-events-auto mt-5" style={{ perspective: 1000 }}>
            <div
              ref={cardRef}
              role="button"
              tabIndex={0}
              aria-pressed={flipped}
              aria-label="Pendant. Press to flip it over."
              title="Click to flip, drag to swing"
              onPointerDown={onDown}
              onPointerMove={onDrag}
              onPointerUp={onUp}
              onPointerCancel={onCancel}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } }}
              className="relative h-[260px] w-[260px] cursor-grab outline-none focus-visible:ring-2 focus-visible:ring-accent active:cursor-grabbing md:h-[340px] md:w-[340px]"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(${flipped ? 180 : 0}deg)`,
                transition: "transform 700ms cubic-bezier(.2,.8,.2,1)",
                touchAction: "pan-y",
              }}
            >
              {/* FRONT: photo, always centered and cropped to fill */}
              <div className="absolute inset-0 overflow-hidden bg-accent/25" style={face}>
                <Spin s={5} />
                <div className="absolute inset-[5px] overflow-hidden bg-card" style={{ clipPath: OCT }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={site.photo}
                    alt={site.name}
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <div className="absolute inset-x-0 bottom-[10%] bg-bg/80 py-1.5 text-center font-mono text-[11px] font-bold uppercase tracking-widest text-accent md:text-xs">
                    {site.name}
                  </div>
                </div>
              </div>

              {/* BACK: a short paragraph about you */}
              <div className="absolute inset-0 overflow-hidden bg-accent/25" style={{ ...face, transform: "rotateY(180deg)" }}>
                <Spin s={5} d={2.5} />
                <div className="absolute inset-[5px] bg-card" style={{ clipPath: OCT }}>
                  <div className="flex h-full flex-col items-center justify-center px-[17%] text-center">
                    <p className="font-mono text-[10px] tracking-widest text-accent md:text-xs">ABOUT_ME</p>
                    <p className="mt-2 text-[10px] leading-snug text-fg/90 md:mt-3 md:text-[13px] md:leading-relaxed">{BIO}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* clip-on resume tab hanging off the bottom */}
          <a
            ref={tabRef}
            href={site.resume}
            download
            aria-label="Download resume"
            className="pointer-events-auto group relative z-10 -mt-1.5 flex flex-col items-center outline-none"
            style={{ transformOrigin: "50% 0", willChange: "transform" }}
          >
            <span className="h-4 w-4 rounded-full border-2 border-muted bg-bg" />
            <span className="-mt-px h-3 w-[2px] bg-muted" />
            <span className="relative rounded-lg bg-accent px-8 pb-3 pt-5 font-mono text-sm font-bold uppercase tracking-wider text-bg shadow-lg transition group-hover:brightness-110 group-focus-visible:ring-2 group-focus-visible:ring-fg">
              <span className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-bg/70" />
              Resume ↓
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}