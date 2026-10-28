export type Principle = { title: string; body: string; evidence: string };

/** Each principle is tied to work documented elsewhere on the site. */
export const principles: readonly Principle[] = [
  {
    title: "Components a team can reuse",
    body: "Shared building blocks beat one-off screens. Typed props and modular styling keep them predictable to change.",
    evidence: "Reusable UI shared across the Trade Brains products; typed components at Videonetics.",
  },
  {
    title: "Render what search needs on the server",
    body: "Pages that depend on organic traffic are server-rendered, so content is in the HTML before any script runs.",
    evidence: "FinGrad course pages built on Next.js.",
  },
  {
    title: "Measure performance, then fix it",
    body: "Profile first with Lighthouse, DevTools and WebPageTest, so effort goes where the time is actually lost.",
    evidence: "Load time improved by 30% on Videonetics interfaces.",
  },
  {
    title: "Tests around the flows that matter",
    body: "Critical user journeys get unit tests, so a refactor or a defect fix doesn't quietly break them.",
    evidence: "Jest and React Testing Library on enterprise banking workflows.",
  },
  {
    title: "Clean seams with the backend",
    body: "Interfaces integrate with REST services through clear contracts, and I can work on both sides when needed.",
    evidence: "REST integrations across products; Node.js, Express and MongoDB experience.",
  },
  {
    title: "Leadership through review",
    body: "Code reviews, mentoring and written technical decisions that a team can revisit months later.",
    evidence: "Technical lead at HCLTech.",
  },
] as const;
