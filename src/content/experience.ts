export type Job = {
  company: string;
  role: string;
  period: string;
  place: string;
  current?: boolean;
  summary: string;
};

export const jobs: readonly Job[] = [
  {
    company: "HCLTech",
    role: "Senior Technical Lead",
    period: "Sep 2025 – Present",
    place: "Bengaluru, hybrid",
    current: true,
    summary:
      "Leading frontend development on enterprise applications with React.js and Next.js, guiding engineers and owning technical decisions for the UI layer.",
  },
  {
    company: "Appiness Interactive",
    role: "Senior Software Developer",
    period: "Jul 2024 – Sep 2025",
    place: "Bengaluru, on-site",
    summary:
      "Built and shipped product features for the client Videonetics, working across the frontend stack with designers, QA and backend teams.",
  },
  {
    company: "Alectify Inc.",
    role: "Senior Software Engineer",
    period: "Aug 2023 – Jul 2024",
    place: "Canada, remote",
    summary:
      "Worked remotely with a Canada-based product team on a SaaS platform, delivering features end to end across time zones.",
  },
  {
    company: "Trade Brains",
    role: "Associate Frontend Developer",
    period: "Nov 2021 – Aug 2023",
    place: "Bengaluru",
    summary:
      "Built frontend for FinGrad and the Trade Brains Portal, two fintech products used by investors and learners across India.",
  },
] as const;

export const education = { school: "Bishop Heber College" } as const;
