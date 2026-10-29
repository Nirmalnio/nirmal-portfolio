import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { siFacebook, siInstagram, siReddit } from "simple-icons";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { socialAccounts, socialLabel, type Platform } from "@/content/social";

const brand = {
  instagram: { icon: siInstagram, name: "Instagram", prefix: "@", cta: "Follow", blurb: "Photos, reels and the odd coffee shot." },
  facebook: { icon: siFacebook, name: "Facebook", prefix: "", cta: "Say hi", blurb: "Where the friends and family are." },
  reddit: { icon: siReddit, name: "Reddit", prefix: "u/", cta: "Visit profile", blurb: "Threads, rabbit holes and hot takes." },
} as const satisfies Record<
  Platform,
  { icon: { path: string; hex: string }; name: string; prefix: string; cta: string; blurb: string }
>;

export function Social() {
  const accounts = socialAccounts.filter((a) => a.handle && a.url);
  if (accounts.length === 0) return null;

  return (
    <section id="social" className="section border-t border-line bg-surface/50">
      <div className="wrap">
        <SectionHeading index="06" label="Social" title={`${socialLabel}.`}>
          When I&rsquo;m not shipping code, you&rsquo;ll find me on these. Say hi.
        </SectionHeading>

        <RevealGroup as="ul" gap={0.12} className="mt-14 grid gap-6 md:grid-cols-3">
          {accounts.map((a) => {
            const b = brand[a.platform];
            const colour = `#${b.icon.hex}`;
            return (
              <Reveal as="li" key={a.platform}>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-bg transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:border-[var(--brand)] hover:shadow-[0_24px_60px_-24px_var(--brand)]"
                  style={{ ["--brand" as string]: colour }}
                >
                  {/* banner: brand glow, a faint oversized logo, and a dot grid */}
                  <div className="relative h-28 overflow-hidden" aria-hidden>
                    <div
                      className="absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: `radial-gradient(120% 140% at 20% 0%, ${colour}66, transparent 70%)` }}
                    />
                    <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(var(--color-line-strong)_1px,transparent_1.2px)] [background-size:16px_16px]" />
                    <svg
                      viewBox="0 0 24 24"
                      className="absolute -right-4 -top-4 size-36 rotate-12 transition-transform duration-700 group-hover:rotate-[20deg] group-hover:scale-110"
                      fill={colour}
                      opacity=".16"
                    >
                      <path d={b.icon.path} />
                    </svg>
                  </div>

                  <div className="relative flex flex-1 flex-col px-6 pb-6">
                    <span className="relative -mt-10 block size-20">
                      {a.avatar ? (
                        <Image
                          src={a.avatar}
                          alt=""
                          width={80}
                          height={80}
                          className="size-20 rounded-full border-4 border-bg object-cover"
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="grid size-20 place-items-center rounded-full border-4 border-bg bg-raised text-3xl font-bold uppercase text-muted"
                        >
                          {a.handle[0]}
                        </span>
                      )}
                      <span
                        aria-hidden
                        className="absolute -bottom-0.5 -right-0.5 grid size-7 place-items-center rounded-full ring-4 ring-bg"
                        style={{ background: colour }}
                      >
                        <svg viewBox="0 0 24 24" className="size-4" fill="#fff">
                          <path d={b.icon.path} />
                        </svg>
                      </span>
                    </span>

                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-muted">{b.name}</p>
                    {a.name && <p className="mt-1 text-lg font-bold leading-tight">{a.name}</p>}
                    <p className={`${a.name ? "text-sm" : "mt-1 text-xl font-bold"} break-all text-muted transition-colors group-hover:text-ink`}>
                      {b.prefix}
                      {a.handle}
                    </p>

                    <p className="mt-3 text-[0.95rem] leading-snug text-muted">{a.bio ?? b.blurb}</p>

                    {a.stats && a.stats.length > 0 && (
                      <dl className="mt-5 grid grid-flow-col auto-cols-fr gap-3 border-t border-line pt-4">
                        {a.stats.map((s) => (
                          <div key={s.label}>
                            <dd className="text-xl font-bold tabular-nums leading-none">{s.value}</dd>
                            <dt className="mt-1 text-[0.7rem] uppercase tracking-wider text-muted">{s.label}</dt>
                          </div>
                        ))}
                      </dl>
                    )}

                    <span
                      className="mt-6 inline-flex items-center justify-between gap-2 self-stretch rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-colors duration-300 group-hover:border-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-white"
                      style={{ ["--brand" as string]: colour }}
                    >
                      <span>{b.cta}</span>
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </div>

                </a>
              </Reveal>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
