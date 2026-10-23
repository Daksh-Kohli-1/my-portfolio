// ============================================================
// ALL SITE CONTENT LIVES HERE. Add/remove entries in `projects`
// and `blogs` and the whole site updates automatically.
// ============================================================
export const site = {
  name: "Daksh Kohli",
  tagline: "Full-stack engineer building scheduling systems, search and ML pipelines.",
  email: "kohlidaksh1707@gmail.com",
  github: "https://github.com/Daksh-Kohli-1",     // TODO: your GitHub URL
  linkedin: "https://linkedin.com/", // TODO: your LinkedIn URL
  telegram: "https://t.me/",         // TODO: your Telegram handle
  resume: "/daksh_kohli_resume.pdf",
  photo: "/me.png", // drop your photo at public/me.png
  heroImage: "/hacker.png", // optional landing art at public/hacker.png
  about: {
    quote:
      "An aspiring engineer who refuses to follow the norm. I like to bend the rules to my liking. I pride myself on being a fast learner. I have led teams and finished projects. I am a believer of doing only what is important and hate doing things unnecessarily.",
    stats: [
      // { label: "Role", value: "Tech Lead" },
      // { label: "CGPA", value: "8.39" },
    ],
    facts: [
      "B.E. Computer Engineering, Thapar Institute, 2024–2028",
      "Technical Secretary, Microsoft Learn Student Chapter",
    ],
  },
};

export type Project = {
  slug: string; title: string; icon: string; summary: string; builtFor: string; tags: string[];
  story: string; stats: { label: string; value: string }[]; github?: string; live?: string;
};
export const projects: Project[] = [
  {
    slug: "timetable-scheduler", title: "Timetable Scheduling System", icon: "▦",
    summary: "Production auto-scheduler for institute-wide timetables.",
    builtFor: "TSLAS Office, TIET: faculty and students across departments.",
    tags: ["Python", "Next.js", "AWS", "DynamoDB", "Docker"],
    story: "Resolves faculty overlaps, room-capacity limits, elective clashes and cross-department conflicts with simulated annealing, across 300+ major, minor and elective combinations and 20+ configurable constraints. A CI/CD pipeline with 11 automated validation tests checks room, faculty and student clashes before every deployment.",
    stats: [{ label: "Students", value: "800+" }, { label: "Faculty", value: "30+" }, { label: "Constraints", value: "20+" }],
  },
  {
    slug: "library-management", title: "Thapar Library Management", icon: "▤",
    summary: "Rebuild of the institute's official library platform.",
    builtFor: "Thapar Institute students, faculty and library staff.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "Redis", "Docker", "Nginx"],
    story: "Led a 7-member team as Tech Lead. Redis-backed real-time updates and concurrency control keep simultaneous book checkouts consistent, targeting 10,000+ monthly active users, with sprint planning and code review owned by me.",
    stats: [{ label: "Team", value: "7" }, { label: "Target MAU", value: "10k+" }],
  },
  {
    slug: "document-search", title: "Document Search Engine", icon: "⌕",
    summary: "Full-text search built from first principles.",
    builtFor: "Anyone searching their own PDFs and documents locally.",
    tags: ["Java", "Spring Boot", "React", "PDFBox", "Apache POI"],
    story: "Custom tokenizer, Porter stemmer and a hand-built positional inverted index for phrase queries, with no Lucene or Elasticsearch. TF-IDF and BM25 are implemented manually, with cosine similarity as an alternate path, and the two rankers are benchmarked against each other.",
    stats: [{ label: "Rankers", value: "BM25 + TF-IDF" }], github: "https://github.com/",
  },
  {
    slug: "volatility-regimes", title: "Volatility Regime Forecasting", icon: "∿",
    summary: "Classifying market volatility regimes with ML.",
    builtFor: "Portfolio exposure decisions across liquid ETFs.",
    tags: ["Python", "PyTorch", "LSTM", "Transformer", "Scikit-learn"],
    story: "Daily regimes for 9 ETFs are labeled with GMM clustering (73% low, 25% medium, 1% high), then four architectures are benchmarked. Gradient Boosted Trees reached 95.2% accuracy and 0.947 macro-F1, ahead of Logistic Regression, LSTM and Transformer. A simple exposure rule beat buy-and-hold on Sharpe (0.98 vs 0.91).",
    stats: [{ label: "Accuracy", value: "95.2%" }, { label: "Sharpe", value: "0.98" }], github: "https://github.com/",
  },
];

export type Blog = { slug: string; title: string; excerpt: string; readTime: number; intro: string; sections: { heading: string; body: string }[] };
export const blogs: Blog[] = [
  { slug: "breaking-the-norm", title: "Why Breaking the Norm is the Only Competitive Moat", readTime: 4,
    excerpt: "Consensus engineering produces conformist yields. How asymmetric architectural gambits win.",
    intro: "Standard procedures exist to protect mediocrity from catastrophic failure. Accept every best practice unquestioned and you guarantee average results.",
    sections: [{ heading: "The illusion of convention", body: "Most engineering dogma is inherited rather than reasoned. We stack abstraction on abstraction until a simple CRUD operation needs ten services." },
      { heading: "Tactical deviation", body: "Bending the rules isn't negligence, it is calculated optimization. Know the system deeper than the people who wrote the guidelines and the rules become suggestions." }] },
  { slug: "only-what-matters", title: "Doing Only What Matters: An Engineer's Antidote to Bloat", readTime: 5,
    excerpt: "Shedding defensive corporate features, excessive layers of abstraction, and ceremonial work.",
    intro: "Every feature is a liability until it proves otherwise.", sections: [{ heading: "Subtract first", body: "Before adding a layer, ask what breaks if it never exists." }] },
  { slug: "fast-learning", title: "Fast Learning via First Principles & Brutal Feedback", readTime: 5,
    excerpt: "Deconstructing textbooks to pure fundamentals while keeping production constraints in view.",
    intro: "Speed comes from fundamentals, not shortcuts.", sections: [{ heading: "Ship, then get it torn apart", body: "Fast feedback beats slow polish." }] },
];

export const tiers = [
  { id: "01", name: "Core Frontend", price: "₹20,000", note: "Fixed deployment cadence", featured: false,
    items: ["High-fidelity frontend UI/UX engineering", "Free deploy & edge-cached static CDN", "Maintenance: ₹500 – 1,500/mo"] },
  { id: "02", name: "Full-Stack Architecture", price: "₹50,000", note: "Complex workflows & microservice synergy", featured: true,
    items: ["Bespoke dynamic frontend application", "Resilient backend infrastructure & micro-APIs", "Deploy pipeline fully controlled by your team", "Maintenance: ₹1,500 – 3,000/mo"] },
  { id: "03", name: "Intelligent Systems", price: "₹1,00,000", note: "Dynamic execution & deep APIs", featured: false,
    items: ["Full multi-surface frontend orchestration", "Distributed cloud backend architecture", "AI integration, RAG & custom LLM pipelines", "Maintenance: ₹3,000+/mo"] },
];
