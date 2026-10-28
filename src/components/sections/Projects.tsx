import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, RevealOnScroll } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { featuredProjects, otherWork, type Project } from "@/content/projects";
import { ProjectVisual } from "./ProjectVisual";

function Frame({ project }: { project: Project }) {
  const body = project.image ? (
    <ParallaxImage
      src={project.image.src}
      alt={project.image.alt}
      width={project.image.width}
      height={project.image.height}
      sizes="(min-width: 1024px) 45rem, 100vw"
      className="h-auto w-full"
    />
  ) : (
    <div className="bg-surface p-5 sm:p-7">
      <ProjectVisual kind={project.visual} label={`Schematic illustration of ${project.name}`} />
    </div>
  );

  const frame = (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface transition-[border-color,transform] duration-500 group-hover:border-accent/50">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span aria-hidden className="size-2.5 rounded-full bg-line-strong" />
        <span aria-hidden className="size-2.5 rounded-full bg-line-strong" />
        <span aria-hidden className="size-2.5 rounded-full bg-line-strong" />
        <span className="ml-3 truncate rounded-md bg-bg px-3 py-0.5 font-mono text-xs text-muted">
          {project.hrefLabel ?? project.name}
        </span>
      </div>
      <div className="overflow-hidden">
        <div className="transition-transform duration-700 ease-out-expo group-hover:scale-[1.025]">{body}</div>
      </div>
    </div>
  );

  return project.href ? (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${project.name} (opens in a new tab)`}
      data-cursor="view"
      className="group block"
    >
      {frame}
    </a>
  ) : (
    <div className="group">{frame}</div>
  );
}

function Case({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  return (
    <article className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
      <RevealOnScroll className={`lg:sticky lg:top-28 lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <Frame project={project} />
        {!project.image && (
          <p className="mt-3 text-xs text-faint">Schematic illustration, not a screenshot.</p>
        )}
      </RevealOnScroll>

      <RevealOnScroll delay={0.1} className="lg:col-span-5">
        <p className="eyebrow text-accent">
          {String(index + 1).padStart(2, "0")} &middot; {project.kind}
        </p>
        <h3 className="display mt-3 text-[clamp(2rem,4vw,3rem)]">{project.name}</h3>
        <p className="mt-1 text-sm text-faint">
          {project.org} &middot; {project.role}
        </p>
        <p className="mt-5 text-muted">{project.summary}</p>

        <dl className="mt-6 space-y-5">
          <div>
            <dt className="eyebrow">The brief</dt>
            <dd className="mt-1.5 text-muted">{project.brief}</dd>
          </div>
          <div>
            <dt className="eyebrow">What I built</dt>
            <dd className="mt-2">
              <ul className="space-y-2">
                {project.built.map((b) => (
                  <li key={b} className="flex gap-3 text-muted">
                    <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-[2px] bg-accent" />
                    {b}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          {project.outcomes && (
            <div>
              <dt className="eyebrow">Outcomes</dt>
              <dd className="mt-1.5 text-muted">{project.outcomes.join(" ")}</dd>
            </div>
          )}
        </dl>

        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
          {project.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </ul>

        {project.href && (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link mt-7 inline-flex items-center gap-2 border-b border-line-strong pb-1 font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            Visit {project.hrefLabel ?? project.name}
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
            />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </RevealOnScroll>
    </article>
  );
}

export function Projects() {
  return (
    <section id="work" className="section border-t border-line">
      <div className="wrap">
        <SectionHeading index="03" label="Selected work" title="Products I’ve helped ship.">
          Two live products I worked on, plus client work that stays under NDA. I&rsquo;m happy to walk through any
          of it on a call.
        </SectionHeading>

        <div className="mt-20 space-y-28 lg:space-y-36">
          {featuredProjects.map((p, i) => (
            <Case key={p.slug} project={p} index={i} />
          ))}
        </div>

        <div className="mt-28 border-t border-line pt-14">
          <RevealOnScroll as="h3" className="eyebrow">
            More client work
          </RevealOnScroll>
          <RevealGroup
            as="ul"
            gap={0.1}
            className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2"
          >
            {otherWork.map((w) => (
              <Reveal key={w.name} as="li" className="bg-bg p-7 sm:p-9">
                <p className="font-mono text-xs text-faint">{w.context}</p>
                <h4 className="mt-3 text-xl font-semibold tracking-tight">{w.name}</h4>
                <p className="mt-3 text-muted">{w.summary}</p>
                <ul className="mt-5 space-y-2 text-[0.95rem] text-muted">
                  {w.points.map((pt) => (
                    <li key={pt} className="flex gap-3">
                      <span aria-hidden className="mt-[0.65em] size-1.5 shrink-0 rounded-[2px] bg-accent" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
