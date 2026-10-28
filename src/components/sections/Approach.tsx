import { RevealGroup, Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { principles } from "@/content/approach";

export function Approach() {
  return (
    <section id="approach" className="section border-t border-line">
      <div className="wrap">
        <SectionHeading index="05" label="Approach" title="How I build.">
          Working principles, each one tied to something I&rsquo;ve actually done.
        </SectionHeading>

        <RevealGroup as="ol" gap={0.07} className="mt-16 grid gap-x-16 md:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal as="li" key={p.title} className="group border-t border-line py-8">
              <div className="flex gap-5">
                <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-accent">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-muted">{p.body}</p>
                  <p className="mt-4 border-l-2 border-line-strong pl-3 text-sm text-faint">{p.evidence}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
