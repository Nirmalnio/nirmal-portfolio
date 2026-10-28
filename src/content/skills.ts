export type SkillGroup = {
  id: string;
  label: string;
  note: string;
  items: readonly string[];
};

export const skillGroups: readonly SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend engineering",
    note: "The core of my work: component-driven interfaces that stay fast as they grow.",
    items: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Responsive design"],
  },
  {
    id: "state",
    label: "State management",
    note: "Picking the lightest tool that keeps data flow predictable.",
    items: ["Redux", "Redux Toolkit", "Zustand", "Context API"],
  },
  {
    id: "ui",
    label: "UI & styling",
    note: "Design systems and styling approaches that scale with a team.",
    items: ["Tailwind CSS", "CSS Modules", "Ant Design", "Material UI", "Bootstrap"],
  },
  {
    id: "backend",
    label: "Backend & APIs",
    note: "Enough server-side range to ship a feature end to end.",
    items: ["Node.js", "Express.js", "MongoDB", "REST APIs", "API integration"],
  },
  {
    id: "quality",
    label: "Testing & performance",
    note: "Measured, not guessed: tests for confidence, tooling for speed.",
    items: ["Jest", "React Testing Library", "Lighthouse", "Chrome DevTools", "WebPageTest"],
  },
  {
    id: "platform",
    label: "Cloud & delivery",
    note: "Storage, build tooling and monitoring around the app.",
    items: ["Firebase", "AWS S3", "Cloudinary", "Git", "GitHub Actions", "Docker", "Webpack", "Babel", "Splunk"],
  },
] as const;
