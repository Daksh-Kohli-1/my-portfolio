"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark; setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };
  return <button onClick={toggle} aria-label="Toggle theme" className="grid h-10 w-10 place-items-center rounded-full border border-accent/40 bg-card text-accent hover:glow">{dark ? "☀" : "☾"}</button>;
}
export function Shell({ children, back = "/", wide = false }: { children: React.ReactNode; back?: string | null; wide?: boolean }) {
  return (
    <div className="relative min-h-screen">
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between p-4 md:p-6">
        {back ? <Link href={back} aria-label="Back" className="grid h-10 w-10 place-items-center rounded-full border border-accent/40 bg-card text-accent">←</Link> : <span />}
        {/* <ThemeToggle /> */}
      </header>
      <motion.main initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className={`mx-auto px-5 pb-24 pt-24 ${wide ? "max-w-6xl" : "max-w-4xl"}`}>{children}</motion.main>
    </div>
  );
}
export const Title = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
  <div className="mb-10">
    {sub && <p className="mb-2 font-mono text-xs text-accent">{sub}</p>}
    <h1 className="outline-text text-5xl font-bold uppercase leading-none md:text-7xl">{children}</h1>
  </div>
);
