"use client";

import { useEffect, useState } from "react";
import * as m from "motion/react-m";
import { useMotionValue, useReducedMotion, useSpring } from "motion/react";

type Mode = "idle" | "link" | "view";

const SIZE: Record<Mode, number> = { idle: 14, link: 44, view: 84 };

/**
 * A trailing ring that grows over links and turns into a "Visit" label over
 * elements marked data-cursor="view". Fine pointers only; the native cursor stays visible.
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 420, damping: 34, mass: 0.5 });
  const [mode, setMode] = useState<Mode>("idle");
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target instanceof Element ? e.target : null;
      if (el?.closest("[data-cursor='view']")) setMode("view");
      else if (el?.closest("a, button, summary")) setMode("link");
      else setMode("idle");
      setShown(true);
    };
    const onLeave = () => setShown(false);

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, x, y]);

  return (
    <m.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden motion-reduce:!hidden [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      <m.div
        initial={false}
        animate={{
          width: SIZE[mode],
          height: SIZE[mode],
          opacity: shown ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className={`-ml-[var(--half)] -mt-[var(--half)] grid place-items-center rounded-full border border-accent transition-colors duration-200 ${
          mode === "view" ? "bg-accent" : "bg-transparent"
        }`}
        style={{ ["--half" as string]: `${SIZE[mode] / 2}px` }}
      >
        <span
          className={`text-xs font-bold uppercase tracking-wider text-accent-ink transition-opacity duration-200 ${
            mode === "view" ? "opacity-100" : "opacity-0"
          }`}
        >
          Visit
        </span>
      </m.div>
    </m.div>
  );
}
