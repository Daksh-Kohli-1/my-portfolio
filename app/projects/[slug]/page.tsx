import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell, Title } from "@/components/Shell";
import DotField from "@/components/DotField";
import { projects } from "@/data/site";

export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

const label = "mb-3 font-mono text-xs uppercase tracking-widest text-accent";
const body = "text-lg leading-8 text-fg/90";

export default function Detail({ params }: { params: { slug: string } }) {
  const i = projects.findIndex((x) => x.slug === params.slug);
  if (i === -1) notFound();
  const p = projects[i];
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];

  return (
    <>
      <DotField />
      <Shell back="/projects">
        <Title sub="Project detail">{p.title}</Title>

        <article className="max-w-3xl">
          {/* 1. What it is */}
          <p className="text-xl leading-relaxed md:text-2xl">{p.summary}</p>

          {/* 2. Key numbers + tags, quiet and in one row */}
          {(p.stats.length > 0 || p.tags.length > 0) && (
            <div className="mt-8 space-y-5 border-y border-line py-6">
              {p.stats.length > 0 && (
                <dl className="flex flex-wrap gap-x-10 gap-y-4">
                  {p.stats.map((s) => (
                    <div key={s.label}>
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">{s.label}</dt>
                      <dd className="mt-1 text-xl font-bold text-accent">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {p.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded border border-line px-2 py-1 font-mono text-xs text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Details, one after another */}
          <section className="mt-12">
            <h2 className={label}>Who I built it for</h2>
            <p className={body}>{p.builtFor}</p>
          </section>

          <section className="mt-12">
            <h2 className={label}>How it came together</h2>
            <p className={body}>{p.story}</p>
          </section>

          {/* 4. Actions */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
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
              <span className="font-mono text-sm text-muted">Soon to be live</span>
            )}
          </div>

          {/* 5. Prev / next */}
          {projects.length > 1 && (
            <nav className="mt-14 flex justify-between gap-6 border-t border-line pt-6 font-mono text-sm">
              <Link href={`/projects/${prev.slug}`} className="text-muted hover:text-accent">
                ← {prev.title}
              </Link>
              <Link href={`/projects/${next.slug}`} className="text-right text-muted hover:text-accent">
                {next.title} →
              </Link>
            </nav>
          )}
        </article>
      </Shell>
    </>
  );
}