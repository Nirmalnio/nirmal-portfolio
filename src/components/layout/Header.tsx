"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/content/site";
import { EASE } from "@/lib/motion";

const ids = [...nav.map((n) => n.id), "contact"];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  // Mobile only: tucked away while scrolling down, back as soon as the reader scrolls up.
  const [tucked, setTucked] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      // Ignore tiny movements so the header doesn't flicker on small jitters.
      if (Math.abs(y - last) < 6) return;
      setTucked(y > last && y > 80);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter,translate] duration-300 max-md:focus-within:translate-y-0 ${
        scrolled || open ? "border-line bg-bg/85 backdrop-blur-md" : "border-transparent bg-transparent"
      } ${tucked && !open ? "max-md:-translate-y-full" : ""}`}
    >
      <div className="wrap flex h-16 items-center justify-between">
        <a
          href="#top"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 font-semibold tracking-tight"
          aria-label={`${site.name}, back to top`}
        >
          <span
            aria-hidden
            className="grid h-9 place-items-center rounded-lg bg-accent px-2.5 font-mono text-sm font-bold tracking-tight text-accent-ink"
          >
            NK
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className="group relative px-3 py-2 text-[0.95rem] text-muted transition-colors hover:text-ink aria-[current=location]:text-ink"
            >
              {item.label}
              <span
                aria-hidden
                className="absolute inset-x-3 -bottom-px h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-aria-[current=location]:scale-x-100"
              />
            </a>
          ))}
          <a
            href="#contact"
            className="ml-3 inline-flex min-h-10 items-center rounded-full bg-ink px-5 text-[0.9rem] font-semibold text-bg transition-colors hover:bg-accent hover:text-accent-ink"
          >
            Let&rsquo;s talk
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          className="grid size-11 place-items-center rounded-lg border border-line"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="wrap flex flex-col pb-6 pt-2 md:hidden"
          >
            {[...nav, { id: "contact", label: "Contact" }].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center justify-between border-b border-line text-lg"
              >
                {item.label}
                <span aria-hidden className="font-mono text-sm text-faint">
                  /{item.id}
                </span>
              </a>
            ))}
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
