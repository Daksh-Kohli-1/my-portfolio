"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import ContactScene from "@/components/ContactScene";
import { site, tiers } from "@/data/site";

export default function Contact() {
  const featured = tiers.findIndex((t) => t.featured);
  const [sel, setSel] = useState(featured < 0 ? 0 : featured); // phone: one tier at a time

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
            <p className="font-mono text-xs text-accent">// High impact engagements</p>
            <h1 className="mt-1 text-3xl font-bold uppercase leading-none md:text-5xl">Work with me</h1>
          </div>

          {/* Phone tier switcher */}
          <div className="flex gap-2 md:hidden">
            {tiers.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setSel(i)}
                className={`rounded-full border px-4 py-1.5 font-mono text-xs ${
                  sel === i ? "border-accent bg-accent text-bg" : "border-line bg-card/80 text-muted"
                }`}
              >
                Tier {t.id}
              </button>
            ))}
          </div>

          <div className="grid w-full items-center gap-4 md:grid-cols-3 md:gap-5">
            {tiers.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`${sel === i ? "block" : "hidden"} rounded-2xl border bg-card/90 p-5 backdrop-blur md:block ${
                  t.featured ? "border-accent glow md:scale-[1.04] md:py-7" : "border-line"
                }`}
              >
                {t.featured && (
                  <p className="mb-3 inline-block rounded-full bg-accent px-3 py-1 font-mono text-[10px] text-bg">
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
                  className={`block rounded-full py-2.5 text-center font-mono text-sm ${
                    t.featured ? "bg-accent text-bg" : "border border-line hover:border-accent"
                  }`}
                >
                  Start tier {t.id}
                </a>
              </motion.div>
            ))}
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