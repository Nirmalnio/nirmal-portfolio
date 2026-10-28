"use client";

import { useRef } from "react";
import * as m from "motion/react-m";
import { useScroll, useSpring } from "motion/react";

/** Accent line that fills down the timeline as you scroll through it. */
export function TimelineProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return (
    <div ref={ref} aria-hidden className="absolute inset-y-0 left-0 w-px">
      <m.div style={{ scaleY }} className="h-full w-px origin-top bg-accent" />
    </div>
  );
}
