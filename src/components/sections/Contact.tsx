import { ArrowUpRight } from "lucide-react";
import { RevealOnScroll } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { CopyEmail } from "./CopyEmail";

const { contact } = site;

const channels = [
  { label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, "")}`, external: false },
  { label: "WhatsApp", value: "Message me", href: `https://wa.me/${contact.whatsapp}`, external: true },
  { label: "LinkedIn", value: "Nirmal Kumar G", href: contact.linkedin, external: true },
  { label: "GitHub", value: "Nirmalnio", href: contact.github, external: true },
] as const;

export function Contact() {
  return (
    <section id="contact" className="section border-t border-line">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-14 sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 -right-24 size-[28rem] rounded-full bg-accent/10 blur-3xl"
          />
          <RevealOnScroll>
            <p className="eyebrow">
              <span className="text-accent">06</span> &nbsp;/&nbsp; Contact
            </p>
          </RevealOnScroll>
          <RevealOnScroll as="h2" delay={0.06} className="display mt-5 max-w-[16ch] text-[clamp(2.25rem,6vw,4.5rem)]">
            Have a product to build or fix?
          </RevealOnScroll>
          <RevealOnScroll as="p" delay={0.12} className="mt-6 max-w-[54ch] text-lg text-muted">
            I&rsquo;m taking on freelance projects, contract roles, remote positions and technical consulting. Tell me
            what you&rsquo;re working on and what your timeline looks like, and I&rsquo;ll reply with questions or a
            time to talk.
          </RevealOnScroll>

          <RevealOnScroll delay={0.18} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${contact.email}?subject=${encodeURIComponent("Project enquiry")}`}
              className="group inline-flex items-center gap-3 break-all text-xl font-semibold text-accent underline decoration-accent/40 decoration-2 underline-offset-8 transition-[text-decoration-color] hover:decoration-accent sm:text-3xl"
            >
              {contact.email}
              <ArrowUpRight
                aria-hidden
                className="size-6 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </a>
            <CopyEmail email={contact.email} />
          </RevealOnScroll>

          <RevealOnScroll delay={0.24}>
            <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {channels.map((c) => (
                <li key={c.label} className="bg-surface">
                  <a
                    href={c.href}
                    {...(c.external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="group flex h-full flex-col gap-1 p-5 transition-colors hover:bg-raised"
                  >
                    <span className="eyebrow">{c.label}</span>
                    <span className="flex items-center justify-between gap-2 font-medium">
                      {c.value}
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 shrink-0 text-faint transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                    </span>
                    {c.external && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
