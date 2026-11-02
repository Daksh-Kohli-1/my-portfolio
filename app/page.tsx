"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "@/components/Shell";
import HexFloor from "@/components/HexFloor";
import { site } from "@/data/site";
const menu = [["about", "/about", "/whoami"], ["projects", "/projects", "/projects"], ["blog", "/thoughts", "/thoughts"], ["contact", "/contact", "/contact"]];

// Tells the hex floor to send a ripple from this element's position.
const pulse = (el: HTMLElement) => {
  const r = el.getBoundingClientRect();
  window.dispatchEvent(new CustomEvent("hex-pulse", { detail: { x: r.left + r.width / 2, y: r.top + r.height / 2 } }));
};

const corner =
  "flex items-center gap-2 rounded-full border border-line bg-card/90 px-4 py-2 font-mono text-xs backdrop-blur transition hover:border-accent hover:text-accent sm:px-5 sm:py-2.5 sm:text-sm";

export default function Landing() {
  const [showResume, setShowResume] = useState(false);

  // Close on Escape + lock page scroll while the preview is open.
  useEffect(() => {
    if (!showResume) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowResume(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [showResume]);

  return (
    // Everything is in normal flow (no absolute positioning for the main blocks),
    // so nothing can overlap and the content is spread evenly on any screen height.
    <main className="relative flex h-[100svh] flex-col items-center overflow-hidden px-4">
      <HexFloor />
      {/* <div className="absolute right-5 top-5"><ThemeToggle /></div> */}

      {/* name */}
      <h1 className="outline-text pointer-events-none relative z-0 mt-[3svh] w-full shrink-0 text-center text-[min(14vw,24svh)] font-bold uppercase leading-none md:mt-[3svh] md:text-[min(13vw,26svh)]">
        {site.name}
      </h1>

      {/* hero image + terminal card, centered in the remaining space */}
      <div className="relative z-10 flex min-h-0 w-full flex-1 flex-col items-center justify-center py-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={site.heroImage}
            alt=""
            className="mx-auto -mb-[4svh] h-[min(18rem,20svh)] object-contain"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className="relative rounded-xl border border-line bg-card/90 p-3 font-mono text-sm backdrop-blur glow sm:p-5 sm:text-base md:p-7 md:text-lg">
            <p className="mb-3 truncate text-fg sm:mb-4"><span className="text-accent">dakshKohli:~$</span> ls -la --interactive</p>
            {menu.map(([n, href, hint], i) => (
              <motion.div key={n} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
                <Link
                  href={href}
                  onMouseEnter={(e) => pulse(e.currentTarget)}
                  className="flex justify-between gap-3 rounded-lg px-3 py-[min(0.75rem,1.6svh)] text-fg hover:bg-accent hover:text-bg sm:px-4 md:py-[min(0.875rem,1.8svh)]"
                >
                  <span>› {n}</span>
                  <span className="opacity-60">{hint}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* footer row: email (left) + resume (right). In flow, so it never covers the card. */}
      <div className="relative z-10 flex w-full shrink-0 items-center justify-between gap-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 sm:px-1 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <motion.a
          href={`mailto:${site.email}`}
          onMouseEnter={(e) => pulse(e.currentTarget)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className={corner}
        >
          <span aria-hidden>✉</span>
          <span className="sm:hidden">Email</span>
          <span className="hidden max-w-[40vw] truncate sm:inline md:max-w-none">{site.email}</span>
        </motion.a>

        <motion.button
          type="button"
          onClick={() => setShowResume(true)}
          onMouseEnter={(e) => pulse(e.currentTarget)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className={corner}
        >
          Resume <span aria-hidden>↗</span>
        </motion.button>
      </div>

      {/* resume preview modal */}
      <AnimatePresence>
        {showResume && (
          <motion.div
            key="resume-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowResume(false)}
            className="fixed inset-0 z-50 grid place-items-center bg-bg/80 p-2 backdrop-blur-sm sm:p-3 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Resume preview"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full max-h-[92svh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-line bg-card glow"
            >
              {/* header */}
              <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2.5 font-mono text-xs sm:text-sm md:px-5 md:py-3">
                <span className="truncate text-fg"><span className="text-accent">~/</span>resume.pdf</span>
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={site.resume}
                    download
                    className="flex items-center gap-2 rounded-full border border-accent bg-accent px-3 py-1.5 text-bg transition hover:opacity-90 sm:px-4"
                  >
                    Download <span aria-hidden>↓</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowResume(false)}
                    aria-label="Close preview"
                    className="grid h-8 w-8 place-items-center rounded-full border border-line transition hover:border-accent hover:text-accent"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* preview */}
              <div className="relative flex-1 bg-bg">
                <iframe
                  src={`${site.resume}#toolbar=0&navpanes=0&view=FitH`}
                  title="Resume preview"
                  className="h-full w-full"
                />
                {/* fallback for browsers that can't render PDFs inline (e.g. iOS Safari) */}
                <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center font-mono text-xs opacity-60">
                  Preview not showing?{" "}
                  <a href={site.resume} target="_blank" rel="noreferrer" className="pointer-events-auto underline">
                    Open in a new tab
                  </a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}