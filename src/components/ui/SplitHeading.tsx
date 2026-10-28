"use client";

import * as m from "motion/react-m";
import type { Variants } from "motion/react";
import { EASE } from "@/lib/motion";

const group: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const word: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.8, ease: EASE } },
};

export type SplitWord = { text: string; accent?: boolean };

/** Headline whose words slide up out of a mask. Must sit inside a RevealGroup (or animate itself). */
export function SplitHeading({ words, className }: { words: readonly SplitWord[]; className?: string }) {
  return (
    <m.h1 variants={group} className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
            <m.span data-reveal variants={word} className={`inline-block ${w.accent ? "text-accent" : ""}`}>
              {w.text}
            </m.span>
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </m.h1>
  );
}
