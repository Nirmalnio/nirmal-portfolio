export type ProjectVisual = "learning" | "research";

export type Project = {
  slug: string;
  name: string;
  kind: string;
  /** Organisation the work was done for. */
  org: string;
  /** What the product is. */
  summary: string;
  /** The context or constraint the work had to meet. */
  brief: string;
  /** My specific contribution. */
  built: readonly string[];
  stack: readonly string[];
  /** Role held while working on it. */
  role: string;
  /** Live site. Omit when there is no public destination. */
  href?: string;
  /** Label shown on the link, e.g. "joinfingrad.com". */
  hrefLabel?: string;
  /** Documented, measurable results only. */
  outcomes?: readonly string[];
  /**
   * Real screenshot. When omitted, a labelled schematic illustration is shown.
   * Place the file in /public/images/work and set width/height to its pixel size.
   */
  image?: { src: string; alt: string; width: number; height: number };
  visual: ProjectVisual;
};

export const featuredProjects: readonly Project[] = [
  {
    slug: "fingrad",
    name: "FinGrad",
    kind: "EdTech platform",
    org: "Trade Brains",
    summary:
      "A stock market learning platform with courses, webinars, certification and nationwide trading events, serving over a lakh learners.",
    brief:
      "A mobile-first audience across India, and course pages that depend on search traffic to be found.",
    built: [
      "Frontend on Next.js with server rendering for SEO-heavy course pages",
      "Course catalogue, learner progress, subscription plans and event pages",
      "Responsive layouts tuned for mobile-first usage",
    ],
    stack: ["Next.js", "React.js", "JavaScript", "REST APIs"],
    role: "Frontend developer",
    href: "https://joinfingrad.com/",
    hrefLabel: "joinfingrad.com",
    outcomes: [
      "Live site reports 70+ courses and webinars, 50+ events across 15+ cities, and 30,000+ participants.",
    ],
    image: {
      src: "/images/work/fingrad.png",
      alt: "FinGrad home page: Learn To Trade The Right Way, with course and event statistics",
      width: 1882,
      height: 1068,
    },
    visual: "learning",
  },
  {
    slug: "trade-brains-portal",
    name: "Trade Brains Portal",
    kind: "Fintech research tool",
    org: "Trade Brains",
    summary:
      "A stock research and analysis platform for Indian investors, with company fundamentals, screeners, charts and market data in one place.",
    brief:
      "Dense financial data that had to stay readable and responsive across stock pages, tables and charts.",
    built: [
      "Data-dense stock pages, tables and charts built to stay responsive",
      "Screeners and watchlists wired to live market data APIs",
      "Reusable UI components shared across the Trade Brains products",
    ],
    stack: ["React.js", "Next.js", "Data visualisation", "Performance"],
    role: "Frontend developer",
    href: "https://portal.tradebrains.in/",
    hrefLabel: "portal.tradebrains.in",
    image: {
      src: "/images/work/trade-brains-portal.png",
      alt: "Trade Brains Portal stock research reports page with a Wall of Profit table",
      width: 1920,
      height: 1080,
    },
    visual: "research",
  },
] as const;

export type OtherWork = {
  name: string;
  context: string;
  summary: string;
  points: readonly string[];
  note?: string;
};

/** Client work without a public destination. Kept deliberately factual. */
export const otherWork: readonly OtherWork[] = [
  {
    name: "Enterprise banking web applications",
    context: "HCLTech · client under NDA",
    summary: "Frontend delivery for critical banking workflows, in React and TypeScript.",
    points: [
      "Production defect fixes to keep critical workflows stable",
      "New business flows built from client requirements",
      "Unit tests with Jest and React Testing Library to raise coverage",
    ],
  },
  {
    name: "Videonetics traffic and surveillance tools",
    context: "Appiness Interactive · client Videonetics",
    summary: "Responsive React interfaces for traffic management, FRS and forensic investigation platforms.",
    points: [
      "Reusable React components with TypeScript and modular CSS",
      "Interfaces integrated with RESTful services",
      "Performance bottlenecks resolved, improving load time by 30%",
    ],
  },
] as const;
