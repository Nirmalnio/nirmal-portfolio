import { RevealOnScroll } from "./Reveal";

export function SectionHeading({
  index,
  label,
  title,
  children,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="max-w-3xl">
      <RevealOnScroll>
        <p className="eyebrow flex items-center gap-3">
          <span className="text-accent">{index}</span>
          <span aria-hidden className="h-px w-8 bg-line-strong" />
          {label}
        </p>
      </RevealOnScroll>
      <RevealOnScroll as="h2" delay={0.06} className="display mt-5 text-[clamp(2rem,5vw,3.5rem)]">
        {title}
      </RevealOnScroll>
      {children && (
        <RevealOnScroll as="p" delay={0.12} className="mt-5 max-w-[56ch] text-lg text-muted">
          {children}
        </RevealOnScroll>
      )}
    </header>
  );
}
