"use client";
import { Shell, Title } from "@/components/Shell";
import AboutScene from "@/components/AboutScene";
import GlowBox from "@/components/GlowBox";
import { site } from "@/data/site";

/* ---------- RESUME DATA ---------- */
const education = {
  degree: "Bachelor of Engineering in Computer Engineering",
  school: "Thapar Institute of Engineering and Technology, Patiala",
  period: "2024 – 2028",
  cgpa: "8.39",
};

const experience = [
  {
    role: "Technical Intern",
    org: "TSLAS Office, TIET",
    period: "2026 – Present",
    points: [
      "Co-developed an auto-scheduling engine in a 2-person team, generating timetables across 300+ major, minor, and elective combinations for institute-wide faculty use, under the Dean, TSLAS, using Python and simulated annealing-based optimization.",
      "Streamlined manual scheduling workflows across multiple departments, cutting redundant operational effort and freeing up team bandwidth for planning and execution initiatives.",
    ],
  },
  {
    role: "Technical Secretary",
    org: "Microsoft Learn Student Chapter (MLSC), TIET",
    period: "2025 – Present",
    points: [
      "Lead technical initiatives and cross-functional collaboration across a 14-member executive board and 40+ contributors, driving execution on 5+ concurrent projects.",
      "Mentored 30+ students across 3 hackathons, and manage task delegation, sprint planning, and team communication across 4+ concurrent technical projects.",
    ],
  },
];

const skills: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Python", "Java", "C++", "JavaScript"] },
  { label: "Backend & APIs", items: ["FastAPI", "Spring Boot", "Node.js", "Express.js", "REST API Design"] },
  { label: "Frontend", items: ["Next.js", "React.js", "Tailwind CSS", "Framer Motion", "Three.js", "React Three Fiber"] },
  { label: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"] },
  { label: "DevOps & Infra", items: ["AWS", "DynamoDB", "Docker", "Nginx", "Cloudflare", "Railway", "CI/CD", "Git", "GitHub", "Postman"] },
  { label: "Machine Learning", items: ["PyTorch", "LSTM", "Transformers", "Scikit-learn", "GMM Clustering", "Learning-to-Rank", "TF-IDF/BM25", "Semantic Search"] },
  // { label: "Auth & Platform", items: ["Clerk"] },
  { label: "Core Concepts", items: ["DBMS", "OOP", "System Design", "Data Modeling", "Transaction Management", "Concurrency Control", "API Design"] },
  // { label: "Management", items: ["SCRUM", "JIRA", "Agile Workflow", "Technical Team Leadership", "Stakeholder Communication", "Cross-Functional Collaboration", "Mentorship"] },
];

/* ---------- SMALL UI HELPERS ---------- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="font-mono text-xs uppercase tracking-[0.3em] opacity-70">{children}</span>
      <span className="h-px flex-1 bg-current opacity-20" />
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-current/30 px-3 py-1 font-mono text-xs opacity-80">
      {children}
    </span>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3 text-sm leading-relaxed opacity-80 md:text-base">
      {items.map((p, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-current" />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- PAGE ---------- */
export default function About() {
  return (
    <>
      <AboutScene />
      <Shell wide>
        <div className="py-6 md:py-12 mt-[3%]">
          <Title sub="PROFILE_OVERVIEW // DAKSH">Who am I?</Title>
        </div>

        <div className="grid gap-16 md:grid-cols-[1.4fr_1fr] md:gap-20">
          {/* ---------- LEFT: MAIN RESUME ---------- */}
          <div className="space-y-16">
            <GlowBox className="p-8 md:p-12" speed={7}>
              <blockquote className="whitespace-pre-line text-xl leading-loose md:text-2xl">
                “{site.about.quote}”
              </blockquote>
            </GlowBox>

            {/* Experience */}
            <section>
              <SectionLabel>Leadership &amp; Experience</SectionLabel>
              <div className="space-y-6">
                {experience.map((e) => (
                  <GlowBox key={e.role} className="p-6 md:p-8" speed={9}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-lg font-semibold md:text-xl">{e.role}</h3>
                      <span className="font-mono text-xs opacity-60">{e.period}</span>
                    </div>
                    <p className="mt-1 font-mono text-sm opacity-70">{e.org}</p>
                    <Bullets items={e.points} />
                  </GlowBox>
                ))}
              </div>
            </section>

          </div>

          {/* ---------- RIGHT: BADGE + EDUCATION + SKILLS ---------- */}
          <aside className="space-y-16">
            <section>
              <SectionLabel>Education</SectionLabel>
              <GlowBox className="p-6" speed={8}>
                <h3 className="text-lg font-semibold">{education.degree}</h3>
                <p className="mt-1 text-sm opacity-75">{education.school}</p>
                <div className="mt-4 flex items-center justify-between font-mono text-xs opacity-70">
                  <span>{education.period}</span>
                  <span>CGPA: {education.cgpa}</span>
                </div>
              </GlowBox>
            </section>

            <section>
              <SectionLabel>Technical Skills</SectionLabel>
              <div className="space-y-6">
                {skills.map((g) => (
                  <div key={g.label}>
                    <p className="mb-2 font-mono text-xs uppercase tracking-widest opacity-60">{g.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {g.items.map((s) => (
                        <Chip key={s}>{s}</Chip>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <div className="h-24" />
      </Shell>
    </>
  );
}