import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Approach } from "@/components/sections/Approach";
import { ScrollMarquee } from "@/components/sections/ScrollMarquee";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Contact } from "@/components/sections/Contact";
import { jobs } from "@/content/experience";
import { site } from "@/content/site";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  description: site.description,
  email: `mailto:${site.contact.email}`,
  image: site.url ? `${site.url}/images/portrait.jpg` : undefined,
  url: site.url,
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
  sameAs: [site.contact.linkedin, site.contact.github],
  worksFor: { "@type": "Organization", name: jobs[0].company },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Bishop Heber College" },
};

const marquee = ["React", "Next.js", "TypeScript", "Node.js", "Express", "Redux Toolkit", "Zustand", "Tailwind CSS", "MongoDB", "REST APIs"];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify drops undefined fields; "<" is escaped so content can't close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <a
        href="#main"
        className="fixed left-4 top-4 z-[70] -translate-y-20 rounded-full bg-accent px-4 py-2 font-semibold text-accent-ink transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <CustomCursor />
      <ScrollProgress />
      <Header />
      <main id="main">
        <Hero />
        <ScrollMarquee items={marquee} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Approach />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
