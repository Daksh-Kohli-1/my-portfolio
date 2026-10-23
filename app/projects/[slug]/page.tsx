import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Shell, Title } from "@/components/Shell";
import { projects } from "@/data/site";

const HEX = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

const Box = ({ n, t, children }: { n: string; t: string; children: ReactNode }) => (
  <section className="rounded-xl border border-line bg-card p-6 md:p-8">
    <h2 className="mb-4 font-mono text-xs text-accent">{n} // {t}</h2>
    {children}
  </section>
);

export default function Detail({ params }: { params: { slug: string } }) {
  const i = projects.findIndex((x) => x.slug === params.slug);
  if (i === -1) notFound();
  const p = projects[i];
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  return (
    <Shell back="/projects">
      <Title sub="Project detail">{p.title}</Title>

      <div className="space-y-8">
        {/* Hero */}
        <section className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
          <div
            className="grid h-44 w-40 shrink-0 place-items-center bg-accent text-6xl text-bg"
            style={{ clipPath: HEX }}
          >
            {p.icon}
          </div>
          <div>
            <p className="font-mono text-xs text-accent">01 // What I built</p>
            <p className="mt-3 text-lg leading-relaxed md:text-xl">{p.summary}</p>
          </div>
        </section>

        {/* Stats */}
        {p.stats.length > 0 && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {p.stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-line bg-card px-5 py-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{s.label}</p>
                <p className="mt-1 text-2xl font-bold text-accent">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <Box n="02" t="Who I built it for">
          <p className="leading-relaxed">{p.builtFor}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="rounded border border-line px-2 py-1 font-mono text-xs text-muted">
                {t}
              </span>
            ))}
          </div>
        </Box>

        <Box n="03" t="How it came together">
          <p className="leading-loose">{p.story}</p>
        </Box>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4">
          {p.github && (
            <a
              href={p.github}
              className="rounded-full border border-accent px-6 py-3 font-mono text-sm text-accent hover:bg-accent hover:text-bg"
            >
              GitHub
            </a>
          )}
          {p.live ? (
            <a href={p.live} className="rounded-full bg-accent px-6 py-3 font-mono text-sm text-bg">
              Live
            </a>
          ) : (
            <span className="rounded-full border border-line px-6 py-3 font-mono text-sm text-muted">
              Soon to be live
            </span>
          )}
          <Link href="/projects" className="px-6 py-3 font-mono text-sm text-muted hover:text-accent">
            See other builds
          </Link>
        </div>

        {/* Prev / next */}
        {projects.length > 1 && (
          <nav className="grid gap-3 border-t border-line pt-8 md:grid-cols-2">
            <Link
              href={`/projects/${prev.slug}`}
              className="rounded-xl border border-line px-5 py-4 transition hover:border-accent"
            >
              <p className="font-mono text-[10px] text-muted">← PREVIOUS</p>
              <p className="mt-1 font-bold">{prev.title}</p>
            </Link>
            <Link
              href={`/projects/${next.slug}`}
              className="rounded-xl border border-line px-5 py-4 text-right transition hover:border-accent"
            >
              <p className="font-mono text-[10px] text-muted">NEXT →</p>
              <p className="mt-1 font-bold">{next.title}</p>
            </Link>
          </nav>
        )}
      </div>
    </Shell>
  );
}