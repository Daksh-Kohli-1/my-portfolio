"use client";
import Link from "next/link";
import { motion } from "motion/react";
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

      {/* bottom right: resume */}
      <motion.a
        href={site.resume}
        download
        onMouseEnter={(e) => pulse(e.currentTarget)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className={`${corner} absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-5 z-10`}
      >
        Resume <span aria-hidden>↓</span>
      </motion.a>
    </main>
  );
}