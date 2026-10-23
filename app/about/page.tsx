"use client";
import { Shell, Title } from "@/components/Shell";
import IdBadge from "@/components/IdBadge";
import AboutScene from "@/components/AboutScene";
import GlowBox from "@/components/GlowBox";
import { site } from "@/data/site";
export default function About() {
  return (
    <>
      <AboutScene />
      <Shell wide>
        <div className="py-6 md:py-12 mt-[3%]"><Title sub="PROFILE_OVERVIEW // DAKSH">Who am I?</Title></div>
        <div className="grid gap-16 md:grid-cols-[1.2fr_1fr] md:gap-24 mt-[-4%]">
          <div className="space-y-12">
            <GlowBox className="p-8 md:p-12" speed={7}>
              <blockquote className="whitespace-pre-line text-xl leading-loose md:text-2xl">“{site.about.quote}”</blockquote>
            </GlowBox>
            {/* <ul className="space-y-4 font-mono text-sm leading-relaxed text-muted">{site.about.facts.map((f) => <li key={f}>› {f}</li>)}</ul> */}
            {/* <div className="grid grid-cols-3 gap-6">
              {site.about.stats.map((s, i) => (
                <GlowBox key={s.label} radius={12} className="p-5" speed={8} delay={i * 2.6}>
                  <p className="font-mono text-xs text-muted">{s.label}</p>
                  <p className="mt-2 text-2xl font-bold text-accent">{s.value}</p>
                </GlowBox>
              ))}
            </div> */}
          </div>
          <div className="flex flex-col items-center">
            <IdBadge />
          </div>
        </div>
      </Shell>
    </>
  );
}