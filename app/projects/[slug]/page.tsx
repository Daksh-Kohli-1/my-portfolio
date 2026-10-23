import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell, Title } from "@/components/Shell";
import DotField from "@/components/DotField";
import { projects } from "@/data/site";

export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

const label = "mb-3 font-mono text-[11px] uppercase tracking-widest text-accent md:text-xs";
const body = "break-words text-base leading-7 text-fg/90 md:text-lg md:leading-8";

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

        <article className="w-full max-w-3xl">
          {/* 1. What it is */}
          <p className="break-words text-lg leading-relaxed md:text-2xl">{p.summary}</p>

          {/* 2. Key numbers + tags */}
          {(p.stats.length > 0 || p.tags.length > 0) && (
            <div className="mt-6 space-y-5 border-y border-line py-5 md:mt-8 md:py-6">
              {p.stats.length > 0 && (
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-10">
                  {p.stats.map((s) => (
                    <div key={s.label}>
                      <dt className="font-mono text-[10px] uppercase tracking-wider text-muted">{s.label}</dt>
                      <dd className="mt-1 text-lg font-bold text-accent md:text-xl">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {p.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded border border-line px-2 py-1 font-mono text-[11px] text-muted md:text-xs">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Details */}
          <section className="mt-9 md:mt-12">
            <h2 className={label}>Who I built it for</h2>
            <p className={body}>{p.builtFor}</p>
          </section>

          <section className="mt-9 md:mt-12">
            <h2 className={label}>How it came together</h2>
            <p className={body}>{p.story}</p>
          </section>

          {/* 4. Actions */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:mt-12">
            {p.github && (
              <a
                href={p.github}
                className="rounded-full border border-accent px-6 py-3 text-center font-mono text-sm text-accent hover:bg-accent hover:text-bg"
              >
                GitHub
              </a>
            )}
            {p.live ? (
              <a href={p.live} className="rounded-full bg-accent px-6 py-3 text-center font-mono text-sm text-bg">
                Live
              </a>
            ) : (
              <span className="font-mono text-sm text-muted">Soon to be live</span>
            )}
          </div>

          {/* 5. Prev / next */}
          {projects.length > 1 && (
            <nav className="mt-12 flex flex-col gap-4 border-t border-line pb-[env(safe-area-inset-bottom)] pt-6 font-mono text-sm sm:flex-row sm:justify-between sm:gap-6 md:mt-14">
              <Link href={`/projects/${prev.slug}`} className="break-words text-muted hover:text-accent">
                ← {prev.title}
              </Link>
              <Link href={`/projects/${next.slug}`} className="break-words text-muted hover:text-accent sm:text-right">
                {next.title} →
              </Link>
            </nav>
          )}
        </article>
      </Shell>
    </>
  );
}