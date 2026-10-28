"use client";

import { useRef } from "react";
import * as m from "motion/react-m";
import {
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { TechIcon } from "@/components/ui/TechIcon";

/** Big kinetic type that drifts on its own and speeds up (and reverses) with scroll velocity. */
export function ScrollMarquee({ items }: { items: readonly string[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const baseX = useMotionValue(0);
  const velocity = useVelocity(useScroll().scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return;
    const b = boost.get();
    if (b < -0.05) dir.current = -1;
    else if (b > 0.05) dir.current = 1;
    const step = dir.current * -1.6 * (delta / 1000) * (1 + Math.abs(b));
    baseX.set(wrap(-50, 0, baseX.get() + step));
  });

  const x = useTransform(baseX, (v) => `${v}%`);

  return (
    <div
      ref={ref}
      aria-hidden
      className="overflow-hidden border-y border-line py-6 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
    >
      <m.div style={{ x }} className="flex w-max whitespace-nowrap will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {items.map((item, i) => (
              <span
                key={`${copy}-${item}`}
                className="flex items-center text-[clamp(2.5rem,7vw,5.5rem)] font-bold leading-none tracking-tight"
              >
                <span className="mr-[0.25em] text-ink">
                  <TechIcon name={item} className="size-[0.72em]" />
                </span>
                <span className={i % 2 ? "text-transparent [-webkit-text-stroke:1px_var(--color-faint)]" : "text-ink"}>
                  {item}
                </span>
                <span className="mx-8 text-[0.4em] text-accent">&#10022;</span>
              </span>
            ))}
          </div>
        ))}
      </m.div>
    </div>
  );
}
