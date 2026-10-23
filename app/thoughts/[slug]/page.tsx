import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell, Title } from "@/components/Shell";
import ThoughtsScene from "@/components/ThoughtsScene";
import { blogs, site } from "@/data/site";
export const generateStaticParams = () => blogs.map((b) => ({ slug: b.slug }));
export default function Post({ params }: { params: { slug: string } }) {
  const b = blogs.find((x) => x.slug === params.slug); if (!b) notFound();
  return (
    <>
      <ThoughtsScene subtle />
      <Shell back="/thoughts">
        <Title sub={`${b.readTime} min read // by ${site.name}`}>{b.title}</Title>
        <p className="mb-10 rounded-xl border border-line bg-card p-6 text-lg leading-relaxed">{b.intro}</p>
        <div className="space-y-10 rounded-xl border border-line bg-card/60 p-6 md:p-10">
          {b.sections.map((s) => (<section key={s.heading}><h2 className="mb-3 border-l-4 border-accent pl-3 text-xl font-bold">{s.heading}</h2><p className="leading-loose text-fg/90">{s.body}</p></section>))}
        </div>
        <Link href="/thoughts" className="mt-10 inline-block rounded-full border border-accent px-6 py-3 font-mono text-sm text-accent hover:bg-accent hover:text-bg">← Return to all thoughts</Link>
      </Shell>
    </>
  );
}