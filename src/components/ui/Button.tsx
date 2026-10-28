import { ArrowUpRight } from "lucide-react";

type Props = React.ComponentProps<"a"> & { variant?: "primary" | "ghost"; arrow?: boolean };

const base =
  "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[0.95rem] font-semibold transition-[transform,background-color,border-color,color] duration-300 active:scale-[0.97]";
const variants = {
  primary: "bg-accent text-accent-ink hover:bg-ink",
  ghost: "border border-line-strong text-ink hover:border-ink hover:bg-raised",
} as const;

export function Button({ variant = "primary", arrow, className = "", children, ...rest }: Props) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
      {arrow && (
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      )}
    </a>
  );
}
