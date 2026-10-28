import {
  siExpress,
  siJavascript,
  siJest,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siReact,
  siRedux,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";
import { Boxes, Webhook, type LucideIcon } from "lucide-react";

const brands: Record<string, SimpleIcon> = {
  React: siReact,
  "Next.js": siNextdotjs,
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  "Node.js": siNodedotjs,
  Express: siExpress,
  "Redux Toolkit": siRedux,
  MongoDB: siMongodb,
  "Tailwind CSS": siTailwindcss,
  Jest: siJest,
};

// No official mark in the icon set, so these use neutral glyphs.
const generic: Record<string, LucideIcon> = {
  Zustand: Boxes,
  "REST APIs": Webhook,
};

/** Near-black brand colours vanish on the dark theme, so those render in the text colour. */
function colour(hex: string) {
  const n = parseInt(hex, 16);
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum < 60 ? "currentColor" : `#${hex}`;
}

export function TechIcon({ name, className = "size-5" }: { name: string; className?: string }) {
  const brand = brands[name];
  if (brand) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className={className} fill={colour(brand.hex)}>
        <path d={brand.path} />
      </svg>
    );
  }
  const Icon = generic[name];
  return Icon ? <Icon aria-hidden className={`${className} text-accent`} /> : null;
}
