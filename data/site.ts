// ============================================================
// ALL SITE CONTENT LIVES HERE. Add/remove entries in `projects`
// and `blogs` and the whole site updates automatically.
// ============================================================
export const site = {
  name: "Daksh Kohli",
  tagline: "Full-stack engineer building scheduling systems, search and ML pipelines.",
  email: "kohlidaksh1707@gmail.com",
  github: "https://github.com/Daksh-Kohli-1",     // TODO: your GitHub URL
  linkedin: "https://www.linkedin.com/in/daksh-kohli-244a37328/", // TODO: your LinkedIn URL
  telegram: "",         // TODO: your Telegram handle
  resume: "/daksh_kohli_resume.pdf",
  photo: "/me.jpeg", // drop your photo at public/me.png
  heroImage: "/hacker.png", // optional landing art at public/hacker.png
  about: {
    quote:
      "An aspiring engineer who refuses to follow the norm. I like to bend the rules to my liking. I pride myself on being a fast learner. I have led teams and finished projects. I am a believer of doing only what is important and hate doing things unnecessarily.\nI follow ‘keep it simple’ as a rule.",
    stats: [
      // { label: "", value: "" },
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
    summary: "An institute-wide timetable scheduler that balances 20+ constraints with simulated annealing, wrapped in a full management portal.",
    builtFor: "TSLAS (Thapar School of Liberal Arts and Sciences), Thapar Institute, Patiala: faculty, students and the timetable office. An official institute project.",
    tags: ["Python", "FastAPI", "Simulated Annealing", "Next.js", "Motion", "AWS", "DynamoDB", "Docker"],
    story: "TSLAS needed one timetable that works for everyone at once, and building it by hand meant endless clashes. I treated it as an optimization problem: the scheduler starts from a rough but valid timetable and uses simulated annealing, running 20,000+ optimization steps, to swap slots, rooms and faculty. Early on it accepts small setbacks so it can escape dead ends, then tightens as it cools. It balances 20+ configurable constraints, including faculty overlaps, room capacity, elective clashes and cross-department conflicts, across 20+ courses and 300+ major, minor and elective combinations. Around the solver sits a full portal with complete CRUD for students, faculty and the rest of the timetable data, and a CI/CD pipeline runs 11 automated validation tests for room, faculty and student clashes before every deployment.",
    stats: [{ label: "Students", value: "800+" }, { label: "Faculty", value: "30+" }, { label: "Constraints", value: "20+" }, { label: "Optimization steps", value: "20,000+" }],
  },
  {
    slug: "library-management", title: "Thapar Library Management", icon: "▤",
    summary: "A real-time seat booking and complaint management platform for the Thapar library, built as an official institute project.",
    builtFor: "Thapar Institute students, faculty and library staff.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "Redis", "WebSockets", "Motion", "Docker", "Nginx"],
    story: "An official institute project, led as Tech Lead of a 7-member team. Students book library seats in real time: Redis handles caching and concurrency control so two people can never take the same seat, and WebSockets push live availability to every open screen. Each student gets their own analytics, and a complaint system tracks issues from filing to resolution, with feedback so library staff can see how well problems were handled. Built to serve 10,000+ monthly active users, with sprint planning and code review owned by me.",
    stats: [{ label: "Team", value: "7" }, { label: "Target MAU", value: "10k+" }, { label: "Type", value: "Official" }],
  },
  {
    slug: "document-search", title: "Document Search Engine", icon: "⌕",
    summary: "Full-text search built from first principles in Java, with a RAG upgrade planned.",
    builtFor: "Anyone searching their own PDFs and documents locally.",
    tags: ["Java", "Spring Boot", "React", "PDFBox", "Apache POI"],
    story: "A search engine built from scratch to understand how search really works, with no Lucene or Elasticsearch. It has a custom tokenizer, a Porter stemmer and a hand-built positional inverted index for phrase queries. TF-IDF and BM25 ranking are implemented manually, with cosine similarity as an alternate path, and the two rankers are benchmarked against each other. The algorithms are deliberately classic for now. Next up: turning it into a RAG system, so questions get answered from the documents themselves instead of only returning ranked results.",
    stats: [{ label: "Rankers", value: "BM25 + TF-IDF" }, { label: "Next", value: "RAG" }], github: "https://github.com/",
  },
  {
    slug: "volatility-regimes", title: "Volatility Regime Forecasting", icon: "∿",
    summary: "A research project on predicting market volatility regimes, comparing sequence-based and classical ML models.",
    builtFor: "Portfolio exposure decisions across liquid ETFs.",
    tags: ["Python", "PyTorch", "LSTM", "Transformer", "Scikit-learn", "yfinance"],
    story: "A research project on whether market volatility regimes can be predicted. Daily data for 9 ETFs comes from Yahoo Finance (yfinance), and regimes are labeled with GMM clustering (73% low, 25% medium, 1% high). Sequence-based models (LSTM, Transformer) and classical ML models (Logistic Regression, Gradient Boosted Trees) are then benchmarked against each other on the same data. Gradient Boosted Trees came out on top with 95.2% accuracy and 0.947 macro-F1, and a simple exposure rule built on the predictions beat buy-and-hold on Sharpe (0.98 vs 0.91).",
    stats: [{ label: "Accuracy", value: "95.2%" }, { label: "Macro-F1", value: "0.947" }, { label: "Sharpe", value: "0.98" }], github: "https://github.com/",
  },
  {
    slug: "nest-hostel-allotment", title: "Nest: Hostel Allotment", icon: "⌂",
    summary: "A hostel allotment system that keeps friends close together, with visual maps of every hostel.",
    builtFor: "Thapar Institute students and the hostel office.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "Redis", "Three.js", "Motion", "Docker"],
    story: "As a student I saw hostel allotment run very randomly, with people changing rooms by hand again and again just to end up near their friends. Nest fixes that with an algorithm that places every student near their friends, in the same room where possible and at least close by. Students form a group first (with a join code), and the leader submits 5–6 ranked hostel preferences during a preference window, with hostels allotted by demand and CGPA. Once fees are paid, a room allotment window opens and the algorithm keeps groups together. Students also never knew which way a room's balcony faced, so Nest includes full visual maps of the hostels, with room orientation shown on the floor plans.",
    stats: [{ label: "Test data", value: "15,000 students" }, { label: "Preferences", value: "5–6 ranked" }],
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
  { id: "01", name: "Core Frontend", prefix: "From", price: "₹20,000", note: "Frontend only, free hosting", featured: false,
    items: ["Responsive, polished UI/UX design: up to 5 pages, 2 revision rounds", "Free deployment on Vercel or Cloudflare (custom domain not included)", "Delivery: under 2 weeks", "Maintenance: ₹1,500/mo flat"] },
  { id: "02", name: "Dynamic Web App", prefix: "From", price: "₹50,000", note: "Dynamic frontend + basic backend", featured: true,
    items: ["Dynamic frontend (up to 8 pages) with a basic backend: CRUD or simple analytics", "3 revision rounds included, delivery within 1 month", "Deployment, hosting and domain costs handled by you", "First 2 months of maintenance free, then ₹3,000/mo from month 3 (hosting costs are separate)"] },
  { id: "03", name: "Custom Build", prefix: "From", price: "₹70,000", note: "Custom product, final price depends on scope", featured: false,
    items: ["Complete frontend and backend with any custom functionality", "AI integration where needed; AI usage and API key costs handled by you", "Scope, milestones and delivery time agreed upfront based on your requirements, with revisions at each milestone", "Maintenance: ₹5,000/mo"] },
];