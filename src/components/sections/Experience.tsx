import { RevealGroup, Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { TimelineProgress } from "./TimelineProgress";
import { site } from "@/content/site";
import { jobs } from "@/content/experience";

export function Experience() {
  return (
    <section id="experience" className="section border-t border-line bg-surface/50">
      <div className="wrap grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading index="04" label="Experience" title="Where I’ve worked.">
            From a fintech startup to a global IT services company, with remote work for a Canada-based team along the
            way.
          </SectionHeading>
          <div className="mt-8">
            <Button href={site.contact.linkedin} variant="ghost" arrow target="_blank" rel="noopener noreferrer">
              Full profile on LinkedIn
            </Button>
          </div>
        </div>

        <div className="relative border-l border-line-strong">
        <TimelineProgress />
        <RevealGroup as="ol" gap={0.1}>
          {jobs.map((job) => (
            <Reveal as="li" key={job.company} className="relative pb-14 pl-8 last:pb-0 sm:pl-10">
              <span
                aria-hidden
                className={`absolute -left-[5px] top-2 size-[9px] rounded-full ring-4 ring-surface ${
                  job.current ? "bg-accent" : "bg-line-strong"
                }`}
              />
              <p className="flex flex-wrap items-center gap-x-3 font-mono text-xs uppercase tracking-[0.08em] text-muted">
                <time>{job.period}</time>
                {job.current && (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">Current</span>
                )}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">{job.role}</h3>
              <p className="mt-1 font-medium">
                {job.company} <span className="font-normal text-faint">· {job.place}</span>
              </p>
              <p className="mt-3 max-w-[58ch] text-muted">{job.summary}</p>
            </Reveal>
          ))}
        </RevealGroup>
        </div>
      </div>
    </section>
  );
}
