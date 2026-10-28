"use client";

import { useRef } from "react";
import Image from "next/image";
import * as m from "motion/react-m";
import { useReducedMotion, useScroll, useTransform } from "motion/react";
import { EASE } from "@/lib/motion";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/** Image that unmasks as it enters and drifts slightly against the scroll. */
export function ParallaxImage({ src, alt, width, height, sizes, className = "", priority }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-1.5%", "1.5%"]);

  return (
    <m.div
      ref={ref}
      data-reveal
      initial={{ clipPath: "inset(8% 5% 8% 5%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
      className="overflow-hidden"
    >
      <m.div style={reduce ? undefined : { y, scale: 1.035 }}>
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} className={className} />
      </m.div>
    </m.div>
  );
}
