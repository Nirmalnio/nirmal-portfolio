import { ArrowUp } from "lucide-react";
import { nav, site } from "@/content/site";
import { Year } from "@/components/Year";

const link = "transition-colors hover:text-ink";

export function Footer() {
  return (
    <footer className="border-t border-line py-10 text-sm text-muted">
      <div className="wrap flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <p>
          &copy; <Year /> {site.name}. {site.location}.
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className={link}>
              {n.label}
            </a>
          ))}
          <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer" className={link}>
            LinkedIn
          </a>
          <a href={site.contact.github} target="_blank" rel="noopener noreferrer" className={link}>
            GitHub
          </a>
        </nav>
        <a href="#top" className={`group inline-flex items-center gap-2 ${link}`}>
          Back to top
          <ArrowUp aria-hidden className="size-4 transition-transform duration-300 group-hover:-translate-y-1" />
        </a>
      </div>
    </footer>
  );
}
