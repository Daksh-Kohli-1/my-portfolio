"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, type PanInfo } from "motion/react";
import ContactScene from "@/components/ContactScene";
import { site, tiers } from "@/data/site";

const SWIPE_DISTANCE = 50; // px dragged to count as a swipe
const SWIPE_VELOCITY = 400; // or a quick flick

export default function Contact() {
  const featured = tiers.findIndex((t) => t.featured);
  const [sel, setSel] = useState(featured < 0 ? 0 : featured); // phone: one tier at a time
  const [mobile, setMobile] = useState<boolean | null>(null); // null until we know, avoids a flash of stacked cards

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const go = (dir: 1 | -1) => setSel((s) => Math.min(tiers.length - 1, Math.max(0, s + dir)));

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) go(1);
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) go(-1);
  };

  const links: [string, string][] = [
    ["Email", `mailto:${site.email}`],
    ["GitHub", site.github],
    ...(site.telegram ? ([["Telegram", site.telegram]] as [string, string][]) : []),
  ];

  return (
    <main className="fixed inset-0 flex flex-col overflow-hidden bg-bg">
      <ContactScene />

      <header className="relative z-10 px-5 pt-4 md:px-8 md:pt-6">
        <Link
          href="/"
          className="inline-block rounded-full border border-line bg-bg/70 px-4 py-2 font-mono text-xs text-muted backdrop-blur hover:text-accent"
        >
          ←
        </Link>
      </header>

      {/* Scrolls only if the screen is really tiny, and never shows a scrollbar. */}
      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 pb-4 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-center gap-4 md:gap-6">
          <div className="text-center">
            {/* <p className="font-mono text-xs text-accent">// High impact engagements</p> */}
            <h1 className="mt-1 text-3xl font-bold uppercase leading-none md:text-5xl">Work with me</h1>
          </div>

          {/* Phone tier switcher (tap) */}
          <div className="flex gap-2 md:hidden">
            {tiers.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setSel(i)}
                className={`rounded-full border px-4 py-1.5 font-mono text-xs transition ${
                  sel === i ? "border-accent bg-accent text-bg" : "border-line bg-card/80 text-muted"
                }`}
              >
                Tier {t.id}
              </button>
            ))}
          </div>

          {/*
            Phone: every card sits in the SAME grid cell, so the cell is as tall as the tallest
            card and all cards are stretched to that height (identical size). Swipe the wrapper
            left/right to change tier. Desktop: normal 3-column grid.
          */}
          <motion.div
            drag={mobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            dragSnapToOrigin
            onDragEnd={onDragEnd}
            className="grid w-full max-md:cursor-grab max-md:active:cursor-grabbing md:grid-cols-3 md:items-center md:gap-5"
          >
            {tiers.map((t, i) => {
              const active = !mobile || i === sel;
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: mobile === null ? 0 : active ? 1 : 0,
                    y: 0,
                    x: mobile ? (i - sel) * 40 : 0,
                    scale: mobile && !active ? 0.94 : 1,
                  }}
                  transition={{ delay: mobile ? 0 : i * 0.1, type: "spring", stiffness: 260, damping: 28 }}
                  style={{ pointerEvents: active ? "auto" : "none" }}
                  className={`flex h-full flex-col rounded-2xl border bg-card/90 p-5 backdrop-blur [grid-area:1/1] md:h-auto md:[grid-area:auto] ${
                    t.featured ? "border-accent glow md:scale-[1.04] md:py-7" : "border-line"
                  }`}
                >
                  {t.featured && (
                    <p className="mb-3 inline-block self-start rounded-full bg-accent px-3 py-1 font-mono text-[10px] text-bg">
                      Recommended
                    </p>
                  )}
                  <p className="font-mono text-xs text-muted">Tier {t.id}</p>
                  <h2 className="mt-1 text-lg font-bold uppercase md:text-xl">{t.name}</h2>
                  <p className="outline-text mt-2 text-3xl font-bold md:text-4xl">{t.prefix} {t.price}</p>
                  <p className="mb-3 mt-1 font-mono text-[10px] text-muted">{t.note}</p>
                  <ul className="mb-4 space-y-1.5 text-[13px] md:text-sm">
                    {t.items.map((x) => (
                      <li key={x} className="flex gap-2">
                        <span className="text-accent">✓</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`mailto:${site.email}?subject=Tier ${t.id} — ${t.name}`}
                    className={`mt-auto block rounded-full py-2.5 text-center font-mono text-sm ${
                      t.featured ? "bg-accent text-bg" : "border border-line hover:border-accent"
                    }`}
                  >
                    Start tier {t.id}
                  </a>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Phone: swipe hint + position dots */}
          <div className="flex flex-col items-center gap-2 md:hidden">
            <div className="flex gap-1.5">
              {tiers.map((t, i) => (
                <span
                  key={t.id}
                  className={`h-1.5 rounded-full transition-all ${sel === i ? "w-5 bg-accent" : "w-1.5 bg-line"}`}
                />
              ))}
            </div>
            <p className="font-mono text-[10px] text-muted">← swipe →</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 font-mono text-sm">
            {links.map(([l, h]) => (
              <a
                key={l}
                href={h}
                className="rounded-full border border-line bg-card/90 px-6 py-2.5 backdrop-blur hover:border-accent hover:text-accent"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}