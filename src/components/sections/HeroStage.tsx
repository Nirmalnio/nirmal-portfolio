"use client";

import { useRef } from "react";
import * as m from "motion/react-m";
import { useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Hero wrapper: a cursor-following spotlight that reveals a dot grid, and
 * content that drifts up slightly as the page scrolls away. No fade: the client list
 * at the bottom of the hero must stay readable while it is on screen.
 */
export function HeroStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative overflow-hidden pb-20 pt-28 sm:pt-32 lg:pb-24"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden className="hero-spot pointer-events-none absolute inset-0 -z-10" />
      <m.div style={reduce ? undefined : { y }}>{children}</m.div>
    </section>
  );
}
