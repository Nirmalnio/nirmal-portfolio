import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { RotatingHeadline } from "@/components/ui/RotatingHeadline";
import { site } from "@/content/site";
import { jobs } from "@/content/experience";
import { getWeather } from "@/lib/weather";
import { HeroStage } from "./HeroStage";
import { HeroVisual } from "./HeroVisual";

/** Rotates in the hero. The `accent` ending is shown in lime. The first line is what screen readers announce. */
const headlines = [
  { lead: "Transforming complex ideas into powerful", accent: "digital products." },
  { lead: "I turn ambitious product ideas into", accent: "scalable web experiences." },
  { lead: "Engineering modern web experiences for products", accent: "built to grow." },
  { lead: "I build fast applications that", accent: "scale with your business." },
] as const;

export async function Hero() {
  const weather = await getWeather();
  return (
    <HeroStage>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[36rem] rounded-full bg-accent/10 blur-3xl"
      />
      <div className="wrap grid items-start gap-16 lg:grid-cols-[1.18fr_0.82fr]">
        <RevealGroup mount gap={0.09}>
          <Reveal className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-muted">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {site.availability}
          </Reveal>

          <Reveal as="p" className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
            Hi, I&rsquo;m <span className="text-accent">{site.name}</span>
          </Reveal>
          <Reveal as="p" className="eyebrow mt-1.5">
            {site.role}
          </Reveal>

          <Reveal variant="rise">
            <RotatingHeadline lines={headlines} className="display mt-4 text-[clamp(2.25rem,5vw,4.4rem)]" />
          </Reveal>

          <Reveal as="p" className="mt-6 max-w-[58ch] text-lg text-muted sm:text-xl">
            I build React and Next.js applications, SaaS dashboards and enterprise tools for teams that need
            interfaces to load fast, scale cleanly and stay easy to work on. 7+ years, based in {site.location}.
          </Reveal>

          <Reveal className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Button href="#work" arrow>
                View my work
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="#contact" variant="ghost">
                Let&rsquo;s talk
              </Button>
            </Magnetic>
            {site.resumeUrl && (
              <Button href={site.resumeUrl} variant="ghost" download>
                Resume
              </Button>
            )}
          </Reveal>

          <Reveal className="mt-10 max-w-xl border-t border-line pt-6">
            <p className="eyebrow">Teams I&rsquo;ve built for</p>
            <ul className="mt-3 flex flex-wrap gap-x-7 gap-y-2 text-lg font-semibold tracking-tight text-ink/80">
              {jobs.map((j) => (
                <li key={j.company}>{j.company}</li>
              ))}
            </ul>
          </Reveal>
        </RevealGroup>

        <HeroVisual weather={weather} />
      </div>
    </HeroStage>
  );
}
