"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { Shell, Title } from "@/components/Shell";
import ThoughtsScene from "@/components/ThoughtsScene";
import { blogs } from "@/data/site";
export default function Thoughts() {
  return (
    <>
      <ThoughtsScene />
      <Shell wide>
        <Title sub="Perspective & irreverent essays">My thoughts</Title>
        <div className="grid gap-5 md:grid-cols-3">
          {blogs.map((b, i) => (
            <motion.div key={b.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}>
              <Link href={`/thoughts/${b.slug}`} className="group flex h-full flex-col justify-between rounded-xl border border-line bg-card p-6 transition hover:bg-accent hover:text-bg">
                <div>
                  <div className="mb-6 flex justify-between font-mono text-[10px] text-muted group-hover:text-bg"><span>BLOG // {String(i + 1).padStart(2, "0")}</span><span>{b.readTime} min read</span></div>
                  <h2 className="mb-3 text-lg font-bold leading-snug">{b.title}</h2>
                  <p className="text-sm text-muted group-hover:text-bg/80">{b.excerpt}</p>
                </div>
                <span className="mt-6 font-mono text-xs text-accent group-hover:text-bg">Read ↗</span>
              </Link>
            </motion.div>))}
        </div>
      </Shell>
    </>
  );
}