import type { Variants } from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const fade: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Moves without hiding, so large text is painted before hydration. */
export const rise: Variants = {
  hidden: { y: 16 },
  show: { y: 0, transition: { duration: 0.6, ease: EASE } },
};

export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});
