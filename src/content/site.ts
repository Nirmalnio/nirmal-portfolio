/**
 * Single source of truth for identity, contact details and navigation.
 * Edit values here; every section reads from this file.
 */

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

export const site = {
  name: "Nirmal Kumar G",
  firstName: "Nirmal",
  role: "Technical Lead & Senior Frontend Engineer",
  tagline: "React · Next.js · TypeScript",
  location: "Bengaluru, India",
  timezone: "IST (UTC+5:30)",
  /** Hours (0–23, IST) shown in the hero scene: at the desk from `wake`, asleep from `sleep`. 0 = midnight. */
  schedule: { wake: 8, sleep: 0 },
  availability: "Available for freelance and contract work",
  description:
    "Nirmal Kumar G is a technical lead and senior frontend engineer in Bengaluru with 7+ years building React, Next.js and TypeScript apps for SaaS and enterprise teams. Open to freelance and contract work.",

  /** Absolute production URL, without a trailing slash. Undefined until a domain is configured. */
  url: siteUrl?.replace(/\/$/, ""),

  contact: {
    email: "nirmalnio123@gmail.com",
    phone: "+91 86819 13206",
    /** Digits only, with country code. */
    whatsapp: "918681913206",
    linkedin: "https://www.linkedin.com/in/nirmal-kumar-g-92774318b/",
    github: "https://github.com/Nirmalnio",
  },

  /**
   * Path to a public resume PDF, e.g. "/Nirmal-Kumar-G-Resume.pdf" (place the file in /public).
   * Leave undefined to hide the resume button.
   */
  resumeUrl: undefined as string | undefined,
} as const;

export const nav = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "approach", label: "Approach" },
] as const;

export const heroStack = ["React", "Next.js", "TypeScript", "Node.js", "Redux Toolkit", "Zustand"] as const;
