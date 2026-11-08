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
    live:"https://timetable-tslas.org/",
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
    slug: "volatility-regimes", title: "Regime-X", icon: "∿",
    summary: "A research project on predicting SPY's volatility regime, benchmarking LSTM, Transformer and classical ML against naive and GARCH baselines with leakage-free validation.",
    builtFor: "Portfolio exposure decisions across liquid ETFs.",
    tags: ["Python", "PyTorch", "LSTM", "Transformer", "Scikit-learn", "GARCH", "yfinance"],
    story: "A research project on whether market volatility regimes can be predicted. Daily data for 9 ETFs (2012–2024) comes from Yahoo Finance, and SPY's regime (low, medium or high) is labeled with a Gaussian mixture model. The target for each day is the realized volatility of the next 20 trading days, the labeler and scaler are fit on training rows only, and a 20-day purge gap keeps training labels from leaking into the test period. LSTM, Transformer, Gradient Boosted Trees and Logistic Regression are benchmarked against two strong baselines: naive persistence (tomorrow's regime = today's) and GJR-GARCH. On the holdout, Gradient Boosted Trees was the best ML model at 81.0% accuracy and 0.785 macro-F1, but persistence still scored 86.1%. A 9-fold purged walk-forward test, which includes crisis periods the holdout never saw, told the same story: no ML model beat persistence in more than 2 of 9 folds. Volatility features drive the model (20-day XLK volatility matters most). On SPY, a volatility-targeting rule on the GBT forecasts reached a holdout Sharpe of 1.05 against 1.03 for buy-and-hold, but over the walk-forward it fell to 0.80 against 0.81, so I read it as no tradable edge. The honest conclusion: simple baselines are hard to beat, and the value of the project is the rigorous evaluation.",
    stats: [{ label: "Best ML accuracy", value: "81.0%" }, { label: "Macro-F1", value: "0.785" }, { label: "Persistence baseline", value: "86.1%" }, { label: "Walk-forward folds", value: "9" }], github: "https://github.com/Daksh-Kohli-1/RegimeX/",
  },
  {
    slug: "nest-hostel-allotment", title: "Nest: Hostel Allotment", icon: "⌂",
    summary: "A hostel allotment system that keeps friends close together, with visual maps of every hostel.",
    builtFor: "Thapar Institute students and the hostel office.",
    tags: ["Next.js", "FastAPI", "PostgreSQL", "Redis", "Three.js", "Motion", "Docker"],
    story: "As a student I saw hostel allotment run very randomly, with people changing rooms by hand again and again just to end up near their friends. Nest fixes that with an algorithm that places every student near their friends, in the same room where possible and at least close by. Students form a group first (with a join code), and the leader submits 5–6 ranked hostel preferences during a preference window, with hostels allotted by demand and CGPA. Once fees are paid, a room allotment window opens and the algorithm keeps groups together. Students also never knew which way a room's balcony faced, so Nest includes full visual maps of the hostels, with room orientation shown on the floor plans.",
    stats: [{ label: "Test data", value: "15,000 students" }, { label: "Preferences", value: "5–6 ranked" }],
    github:"https://github.com/Daksh-Kohli-1/SE_Project/",
  },
  {
    slug: "wecare-2027-conference", title: "WECARE2027: Conference Website", icon: "≈",
    summary: "The official website for Thapar's international conference on water, environment and climate, built for paper submissions, registrations and showing the conference to the world.",
    builtFor: "Thapar Institute and the WECARE2027 organizing committee.",
    tags: ["Next.js", "React", "Tailwind CSS", "Cloudflare"],
    story: "WECARE2027, the International Conference on Water, Environment, and Climate Adaptations for Regional Ecosystems, will be held at TIET, Patiala on 11–12 March 2027, with researchers coming from all over the world. The institute needed a site that works as the conference's public face and also does real work for authors and attendees. I built it as a front-end only website, with a bold hero, a clean committee and leadership section, and a dedicated Author's Area for paper submissions. It covers the four conference themes (water resources and watershed management; surface water, groundwater and cryosphere; climate change and hydrologic extremes; water quality and environmental sustainability), plus keynote speakers, sponsorship, registration and venue pages. A live Important Dates panel tracks the abstract submission window (24 Aug – 15 Nov 2026), acceptance notifications, camera-ready papers and early-bird registration, so authors always know what is next. The site is already live and has been visited by 1,500+ people, and traffic is expected to grow as the conference gets closer.",
    stats: [{ label: "Visitors so far", value: "1,500+" }, { label: "Conference", value: "11–12 Mar 2027" }, { label: "Audience", value: "International" }],
    live: "https://wecare.thapar.edu",
    github:"https://github.com/Daksh-Kohli-1/conference-website",
  },
  {
    slug: "offset-ledger-knock-off-engine", title: "Offset: The Ledger Knock-Off Engine", icon: "⇌",
    summary: "A web app that turns a raw sheet of invoices, credit notes and payments into a clean knock-off Excel report, and carries unsettled balances forward month after month.",
    builtFor: "Accounts teams who reconcile receivables for many customers and used to match payments to invoices by hand.",
    tags: ["Next.js", "TypeScript", "React", "Excel Automation"],
    story: "Reconciling payments against invoices for hundreds of customers is slow, repetitive and easy to get wrong. Offset automates it. You upload a raw .xlsx containing sales invoices, credit notes and payments for many parties, and it returns a knock-off Excel in the exact layout the accountants already use. For every customer, debits are sorted by overdue date and credits are applied against them in order. When a credit is bigger than the debit it is clearing, the remainder spills over to the next one. Whatever is left is flagged as an Unadjusted Debit or Unadjusted Credit, so nothing disappears silently. The workflow is built around month-end. You preview the result first, and nothing is stored until you are happy. Then you save the unadjusted balances, and they become the opening balance for the next month's upload. Opening Balance rows are handled with care: only the earliest month counts, rows that would double-count earlier transactions are ignored, and mismatched debit and credit entries are listed as warnings. Duplicate protection skips lines that were already processed and blocks the same file from being saved twice, and a one-click undo reverts the last saved batch. Every saved batch can be downloaded again, and the Summary sheet shows opening, totals, knocked-off and unadjusted amounts per party. The engine is tested against a hand-built reference sheet, and on a 14,000-row file covering about 1,000 parties it reproduced matching balances for all 1,031 parties.",
    stats: [{ label: "Parties verified", value: "1,031" }, { label: "Rows tested", value: "14,000+" }, { label: "Output", value: "Excel + Summary" }],
    github: "https://github.com/Daksh-Kohli-1/AutoKnockOff",
  },
  
];

export type Blog = { slug: string; title: string; excerpt: string; readTime: number; intro: string; sections: { heading: string; body: string }[] };
export const blogs: Blog[] = [
    { slug: "interviewing-in-the-age-of-ai", title: "Interviewing in the Age of AI: Time for a Rewrite", readTime: 3,
    excerpt: "AI is reshaping every stage of the hiring funnel, from online assessments to DSA rounds. Here is why the interview process needs a rewrite.",
    intro: "For a college student, an interview is the tunnel between campus life and the hustle of the corporate world. Lately, that tunnel has narrowed in the age of Artificial Intelligence, and everyone is fighting for space. AI has made memorising concepts like OOPS, DSA, SQL, and code syntax feel increasingly obsolete. So is memorisation actually necessary to work in the industry, or does it only help you clear old-fashioned interviews? Let’s find out!",
    sections: [
      { heading: "Online Assessments: The Gateway Gets Crowded", body: "The gateway to interviews, hated by many but defeated by none. AI has significantly increased the number of rule-breakers in online assessments, which makes the tests unfair for honest candidates. Companies and recruiters have responded by making these tests more rigorous and taxing, but the repercussions are felt by honest candidates too.\n\nOne of my observations is that violation has become the norm. Not using AI to perform better in an OA may be the ethical decision, but it is hardly the practical one. Even if you have strong knowledge of your domain, combining it with the power of AI will greatly improve your chances of qualifying.\n\nI am not saying that one should cheat, but taking a knife to a gunfight is simply foolish.\n\nThis shows how AI has changed the dynamics of online assessments. I still believe we are in a phase of transition, and that the format will gradually evolve into something more practical. For example, imagine a GitHub repository where candidates must solve a problem statement with a limited number of AI tokens, first by understanding the codebase and the requirements. That kind of assessment would test skills that are actually used in the industry." },
      { heading: "DSA Rounds: Brain Muscle or Barrier?", body: "Another major caveat is DSA. The world loves to show off the number of questions solved on LinkedIn, but I believe DSA-based screening has become outdated. Understanding data structures and different types of algorithms is important for sharpening problem-solving ability. Yet interviews still test how well you remember syntax and whether you can solve problems under pressure. In real-world scenarios, you have time to strategise and decide which approach best fits the requirements of the problem.\n\nI believe that if the pressure is lifted, people think better, and the vast pool of such questions can simply be used for reference. DSA is great for building mental muscle, but testing someone solely on it and then concluding that they are not good at tech is, by all means, wrong." },
      { heading: "Resume and Referrals: Proof of Work and the Power of People", body: "The resume comes into play once you reach the interview stage, and I believe it shows who you really are through what you have built with your own hands. I understand that AI has made building projects easy, but explaining those projects and truly understanding the concepts behind them is what sets candidates apart.\n\nReferrals, as always, still work remarkably well for getting placed at a company. AI has had no negative effect on them; on the contrary, it has only helped recruiters sort candidates more easily." },
      { heading: "Conclusion: A Rewrite in Progress", body: "All in all, the interview process is in a phase of transformation. Soon enough, new changes and industry standards will come to light, and the norm will shift toward a better future and a healthier industry." }
    ] },
    { slug: "will-ai-take-jobs-or-reduce-workload", title: "Job Killer or Ultimate Tool? The Truth About AI and Your Career", readTime: 4,
    excerpt: "AI can solve problems that stumped experts for decades. So will it take our jobs, or simply lighten our workload? A student engineer's honest take.",
    intro: "“Artificial Intelligence” is a term that scares the naive and means nothing to those who have never heard of it. But as a student working hard to become an engineer, I can see both sides of the picture. People with zero knowledge of AI have no clue about its capabilities. On the other hand, someone like me, who uses it daily, is in awe and, at the same time, scared that it is fully capable of replacing some jobs, if not all.",
    sections: [
      { heading: "Beyond the Calculator: Can AI Really Replace Us?", body: "One of the most heated debates of the AI age is whether it will be able to replace humans. People counter this with an analogy: when calculators were introduced, many thought accountants were finished, but the calculator eventually became a tool, and the same will happen with AI. I beg to differ. AI is far ahead of a simple calculator. It can think, create, and understand topics that a person of average IQ would find difficult and time-consuming to grasp. Different AI models have even solved mathematical problems that humans were incapable of solving. One example is OpenAI’s Astra, which solved several long-standing problems in areas like group theory, geometry, and combinatorics, some of which had remained unresolved for decades. Another is Anthropic’s Claude, which formalised a computer-verifiable proof of Fermat’s Last Theorem, a problem that went unsolved for more than 350 years before Andrew Wiles proved it in the 1990s. This shows that AI is fully capable of replacing humans, and concluding that it is just a tool would be naive.\n\nI will also point out that AI will create new job profiles, but most of them will involve managing AI workers, which means the work of ten people will be handled by one." },
      { heading: "The Unaware Majority: Left Behind Without Knowing It", body: "Not everyone is aware of how far AI has come in the last four to five years, from being a simple helper to building and automating entire workflows. There are people in the crafts industry, in small accounting firms, and in local shops who are either unaware of AI or, if aware, are not using it in a way that benefits them. Their disadvantage is that they will lose precious time catching up with those who are already using AI, even partly, and outsourcing their repetitive tasks to AI agents.\n\nI feel the world is currently divided into those who know AI and those who do not even have an inkling that something this powerful exists. At its very core, we have made rocks capable of thinking and reasoning, and the only thing left is emotions. I have no doubt that, in a decade or two, humanity will achieve that too. AI will affect the unaware in ways they do not expect, which is why making them aware is important: it will soften the blow." },
      { heading: "Surviving the AI Game: Think Beyond the Code", body: "Those of us who use AI on a daily basis will have to understand more than software, because software is now understood by AI. Understanding the complex requirements of a user or customer is the new skill. AI has also made it possible to build software in half the time it used to take. Many people say that AI cannot build for production, but my thinking is a bit different. I believe building for production with AI is a skill that people still do not understand. You need to know every step of bringing a product to production and then use AI to make that process faster.\n\nWe will also have to understand our customers’ domains with more interest and a genuine willingness to help them. In short, to survive the AI game, we must understand more than just the software." },
      { heading: "Racing Toward AGI: Can Anyone Keep Up?", body: "AI has grown at such an immense rate that by the time you learn a new skill, AI has taken it over or it has become outdated. MCP and RAG are a few examples: they were hyped faster than light and cooled down even faster. AI will become so powerful in the next decade that catching up with it will become a myth.\n\nI also believe that the reasoning we give ourselves, that even if AI does the work we still need to understand it, will become obsolete in a decade or two. For the majority of the population, understanding the input and the output will be all that matters. Artificial General Intelligence (AGI) is the next big thing we are looking forward to. Every big company is racing to achieve it, and the moment we get there, it will mark the start of the next industrial revolution." },
      { heading: "The Verdict: More Jobs Lost Than Gained", body: "In conclusion, AI will definitely create jobs and replace them, but the net result is most likely that more people will lose jobs to it than will find new ones because of it. AI is not just another tool that assists humans. It is a very powerful technology capable of replacing the repetitive tasks humans perform, especially the laborious ones." }
    ] },
];

export const tiers = [
  { id: "01", name: "Core Frontend", prefix: "From", price: "₹20,000", note: "Frontend only, free hosting", featured: false,
    items: ["Responsive, polished UI/UX design: up to 5 pages, 2 revision rounds", "Free deployment on Vercel or Cloudflare (custom domain not included)", "Delivery: under 2 weeks", "Maintenance: ₹1,500/mo flat"] },
  { id: "02", name: "Dynamic Web App", prefix: "From", price: "₹50,000", note: "Dynamic frontend + basic backend", featured: true,
    items: ["Dynamic frontend (up to 8 pages) with a basic backend: CRUD or simple analytics", "3 revision rounds included, delivery within 1 month", "Deployment, hosting and domain costs handled by you", "First 2 months of maintenance free, then ₹3,000/mo from month 3 (hosting costs are separate)"] },
  { id: "03", name: "Custom Build", prefix: "From", price: "₹70,000", note: "Custom product, final price depends on scope", featured: false,
    items: ["Complete frontend and backend with any custom functionality", "AI integration where needed; AI usage and API key costs handled by you", "Scope, milestones and delivery time agreed upfront based on your requirements, with revisions at each milestone", "Maintenance: ₹5,000/mo"] },
];