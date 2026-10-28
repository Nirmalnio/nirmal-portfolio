import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { RevealOnScroll } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { education } from "@/content/experience";
import { site } from "@/content/site";

const facts = [
  { value: "8+", label: "Years building for the web" },
  { value: "4", label: "Companies, from fintech to enterprise" },
  { value: "2", label: "Countries of teams worked with: India and Canada" },
] as const;

export function About() {
  return (
    <section id="about" className="section border-t border-line">
      <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div>
          <SectionHeading index="01" label="About" title="Product-minded engineering, not just pixels." />
          <RevealOnScroll delay={0.1} className="mt-10 max-w-sm">
            <div className="overflow-hidden rounded-2xl border border-line">
              <ParallaxImage
                src="/images/portrait-full.jpg"
                alt={`Portrait of ${site.name} sitting at a seaside café`}
                width={864}
                height={1536}
                sizes="(min-width: 1024px) 24rem, 80vw"
                className="aspect-[4/5] w-full object-cover object-[50%_88%]"
              />
            </div>
          </RevealOnScroll>
        </div>

        <div className="space-y-6 text-muted lg:pt-16">
          <RevealOnScroll as="p" className="text-2xl font-medium leading-snug text-ink">
            I&rsquo;ve spent my career on high-traffic web apps, SaaS products and enterprise platforms, working
            closely with product owners, designers and backend teams.
          </RevealOnScroll>
          <RevealOnScroll as="p">
            My focus is code a team can live with: clear frontend architecture, predictable state, sensible APIs and
            pages that stay fast as features pile up. A quicker checkout or a cleaner dashboard is what actually moves
            the numbers, so I care about the business side too.
          </RevealOnScroll>
          <RevealOnScroll as="p">
            Alongside hands-on development, I lead and mentor engineers, review code and help teams make architecture
            calls they won&rsquo;t regret six months later.
          </RevealOnScroll>

          <RevealOnScroll>
            <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-line pt-8 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-4xl font-bold tracking-tight text-accent">{f.value}</dt>
                  <dd className="mt-1 text-sm leading-snug">{f.label}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-sm">
              Education: <span className="text-ink">{education.school}</span>
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
