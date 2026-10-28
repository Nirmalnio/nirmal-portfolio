"use client";

import * as m from "motion/react-m";
import { fade, rise, stagger } from "@/lib/motion";

const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

type Tag = "div" | "li" | "article" | "p" | "h1" | "h2" | "h3" | "span";
type Props = {
  children: React.ReactNode;
  className?: string;
  as?: Tag;
  delay?: number;
  /** `rise` only translates; use it for text that drives LCP. */
  variant?: "fade" | "rise";
};

const tags = { div: m.div, li: m.li, article: m.article, p: m.p, h1: m.h1, h2: m.h2, h3: m.h3, span: m.span } as const;

/** Reveals once when scrolled into view. Inside a RevealGroup it follows the group's stagger. */
export function Reveal({ children, className, as = "div", delay = 0, variant = "fade" }: Props) {
  const Tag = tags[as];
  return (
    <Tag
      data-reveal
      className={className}
      variants={variant === "rise" ? rise : fade}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Standalone reveal: triggers on its own when scrolled into view. */
export function RevealOnScroll({ children, className, as = "div", delay = 0 }: Omit<Props, "variant">) {
  const Tag = tags[as];
  return (
    <Tag
      data-reveal
      className={className}
      variants={fade}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Staggers its Reveal children. `mount` plays on load; otherwise on scroll into view. */
export function RevealGroup({
  children,
  className,
  gap = 0.08,
  delay = 0,
  mount = false,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  mount?: boolean;
  as?: "div" | "ul" | "ol";
}) {
  const Tag = as === "ul" ? m.ul : as === "ol" ? m.ol : m.div;
  return (
    <Tag
      className={className}
      variants={stagger(gap, delay)}
      initial="hidden"
      {...(mount ? { animate: "show" } : { whileInView: "show", viewport: VIEWPORT })}
    >
      {children}
    </Tag>
  );
}
