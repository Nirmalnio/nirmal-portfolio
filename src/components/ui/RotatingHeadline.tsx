"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { EASE } from "@/lib/motion";

export type HeadlineLine = { lead: string; accent: string };

const INTERVAL_MS = 3800;

function Line({ line }: { line: HeadlineLine }) {
  return (
    <>
      {line.lead} <span className="text-accent">{line.accent}</span>
    </>
  );
}

/**
 * Headline that cycles through `lines`: the current one slides up and out while the next rises in.
 * Every line is also rendered invisibly in the same grid cell, so the block always takes the height
 * of the longest line and nothing below it jumps. Screen readers get the first line only, once.
 */
export function RotatingHeadline({ lines, className }: { lines: readonly HeadlineLine[]; className?: string }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || lines.length < 2) return;
    const id = setInterval(() => {
      // Don't advance while the tab is in the background.
      if (!document.hidden) setIndex((i) => (i + 1) % lines.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [reduce, lines.length]);

  const first = lines[0];

  return (
    <h1 className={className}>
      <span className="sr-only">
        {first.lead} {first.accent}
      </span>
      <span aria-hidden className="grid overflow-hidden pb-[0.08em]">
        {lines.map((line, i) => (
          <span key={i} className="invisible [grid-area:1/1]">
            <Line line={line} />
          </span>
        ))}
        <AnimatePresence initial={false}>
          <m.span
            key={index}
            className="[grid-area:1/1]"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.75, ease: EASE }}
          >
            <Line line={lines[index]} />
          </m.span>
        </AnimatePresence>
      </span>
    </h1>
  );
}
