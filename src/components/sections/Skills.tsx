import { RevealGroup, Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { skillGroups } from "@/content/skills";

export function Skills() {
  return (
    <section id="skills" className="section border-t border-line bg-surface/50">
      <div className="wrap">
        <SectionHeading index="02" label="Skills" title="Tools I reach for every day.">
          Grouped by the job they do, not by how impressive they look on a list.
        </SectionHeading>

        <RevealGroup as="ul" gap={0.07} className="mt-16 border-t border-line">
          {skillGroups.map((group) => (
            <Reveal
              as="li"
              key={group.id}
              className="grid gap-5 border-b border-line py-8 transition-colors duration-300 hover:bg-raised/40 md:grid-cols-[1fr_1.6fr] md:gap-12 md:px-4"
            >
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{group.label}</h3>
                <p className="mt-2 max-w-[38ch] text-[0.95rem] text-muted">{group.note}</p>
              </div>
              <ul className="flex flex-wrap content-start gap-2" aria-label={`${group.label} skills`}>
                {group.items.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </ul>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
