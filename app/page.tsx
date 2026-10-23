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

export default function Landing() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <HexFloor />
      {/* <div className="absolute right-5 top-5"><ThemeToggle /></div> */}
      <h1 className="outline-text pointer-events-none absolute top-[12%] w-full text-center text-[13vw] font-bold uppercase leading-none">{site.name}</h1>
      <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative z-10 mt-56 w-full max-w-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={site.heroImage} alt="" className="mx-auto mb-[-80px] h-72 object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
        <div className="rounded-lg border border-line bg-card/90 p-4 font-mono text-sm backdrop-blur glow">
          <p className="mb-3 text-fg"><span className="text-accent">dakshKohli:~$</span> ls -la --interactive</p>
          {menu.map(([n, href, hint], i) => (
            <motion.div key={n} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}>
              <Link href={href} onMouseEnter={(e) => pulse(e.currentTarget)} className="flex justify-between rounded px-3 py-2 text-fg hover:bg-accent hover:text-bg"><span>› {n}</span><span className="opacity-60">{hint}</span></Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}