"use client";
import { Shell, Title } from "@/components/Shell";
import IdBadge from "@/components/IdBadge";
import { site } from "@/data/site";
export default function About() {
  return (
    <Shell wide>
      <div className="py-6 md:py-12 mt-[-8%]"><Title sub="PROFILE_OVERVIEW // DAKSH">Who am I?</Title></div>
      <div className="grid gap-16 md:grid-cols-[1.2fr_1fr] md:gap-24 mt-[-4%]">
        <div className="space-y-12">
          <blockquote className="rounded-2xl border border-line bg-card p-8 text-xl leading-loose md:p-12 md:text-2xl">“{site.about.quote}”</blockquote>
          {/* <ul className="space-y-4 font-mono text-sm leading-relaxed text-muted">{site.about.facts.map((f) => <li key={f}>› {f}</li>)}</ul> */}
          <div className="grid grid-cols-3 gap-6">
            {site.about.stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-card p-5">
                <p className="font-mono text-xs text-muted">{s.label}</p><p className="mt-2 text-2xl font-bold text-accent">{s.value}</p>
              </div>))}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <IdBadge />
        </div>
      </div>
    </Shell>
  );
}