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
  "flex items-center gap-2 rounded-full border border-line bg-card/90 px-5 py-2.5 font-mono text-sm backdrop-blur transition hover:border-accent hover:text-accent";

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
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <HexFloor />
      {/* <div className="absolute right-5 top-5"><ThemeToggle /></div> */}
      <h1 className="outline-text pointer-events-none absolute top-[12%] w-full text-center text-[13vw] font-bold uppercase leading-none">{site.name}</h1>
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative z-10 mt-56 w-full max-w-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={site.heroImage} alt="" className="mx-auto mb-[-80px] h-72 object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
        <div className="rounded-xl border border-line bg-card/90 p-5 font-mono text-base backdrop-blur glow md:p-7 md:text-lg">
          <p className="mb-4 text-fg"><span className="text-accent">dakshKohli:~$</span> ls -la --interactive</p>
          {menu.map(([n, href, hint], i) => (
            <motion.div key={n} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
              <Link href={href} onMouseEnter={(e) => pulse(e.currentTarget)} className="flex justify-between rounded-lg px-4 py-3 text-fg hover:bg-accent hover:text-bg md:py-3.5"><span>› {n}</span><span className="opacity-60">{hint}</span></Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* bottom left: email */}
      <motion.a
        href={`mailto:${site.email}`}
        onMouseEnter={(e) => pulse(e.currentTarget)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className={`${corner} absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-5 z-10`}
      >
        <span aria-hidden>✉</span>
        <span className="sm:hidden">Email</span>
        <span className="hidden sm:inline">{site.email}</span>
      </motion.a>

      {/* bottom right: resume (opens preview) */}
      <motion.button
        type="button"
        onClick={() => setShowResume(true)}
        onMouseEnter={(e) => pulse(e.currentTarget)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className={`${corner} absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-10`}
      >
        Resume <span aria-hidden>↗</span>
      </motion.button>

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
            className="fixed inset-0 z-50 grid place-items-center bg-bg/80 p-3 backdrop-blur-sm md:p-8"
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
              className="flex h-full max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-line bg-card glow"
            >
              {/* header */}
              <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 font-mono text-sm md:px-5">
                <span className="truncate text-fg"><span className="text-accent">~/</span>resume.pdf</span>
                <div className="flex items-center gap-2">
                  <a
                    href={site.resume}
                    download
                    className="flex items-center gap-2 rounded-full border border-accent bg-accent px-4 py-1.5 text-bg transition hover:opacity-90"
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