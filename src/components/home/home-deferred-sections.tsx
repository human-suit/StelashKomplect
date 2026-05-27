import { AboutSection } from "@/components/home/about-section";
import { CtaBlock } from "@/components/home/cta-block";
import { IndustrySolutions } from "@/components/home/industry-solutions";
import { KnowledgeStrip } from "@/components/home/knowledge-strip";
import { NewsStrip } from "@/components/home/news-strip";
import { PdfCatalogs } from "@/components/home/pdf-catalogs";
import { ProjectsStrip } from "@/components/home/projects-strip";
import { WhyUs } from "@/components/home/why-us";
import { Reveal } from "@/components/ui/reveal";
import { listIndustrySolutions } from "@/lib/content/industry-solutions";
import { listKnowledge } from "@/lib/content/knowledge";
import { listNews } from "@/lib/content/news";
import { listProjects } from "@/lib/content/projects";
import dynamic from "next/dynamic";
import { SectionSkeleton } from "@/components/ui/section-skeleton";

const WhereToBuy = dynamic(
  () =>
    import("@/components/home/where-to-buy").then((m) => ({
      default: m.WhereToBuy,
    })),
  { loading: () => <SectionSkeleton minHeight={360} /> },
);

const ConsultationForm = dynamic(
  () =>
    import("@/components/home/consultation-form").then((m) => ({
      default: m.ConsultationForm,
    })),
  { loading: () => <SectionSkeleton minHeight={280} /> },
);

export async function HomeMidSections() {
  const [solutions, news] = await Promise.all([
    listIndustrySolutions(),
    listNews(),
  ]);

  return (
    <>
      <Reveal delay={40}>
        <IndustrySolutions items={solutions} />
      </Reveal>
      <Reveal delay={40}>
        <NewsStrip items={news} />
      </Reveal>
      <Reveal delay={40}>
        <AboutSection />
      </Reveal>
      <Reveal delay={40}>
        <WhereToBuy />
      </Reveal>
    </>
  );
}

export async function HomeBottomSections() {
  const [knowledge, projects] = await Promise.all([
    listKnowledge(),
    listProjects(),
  ]);

  return (
    <>
      <Reveal delay={40}>
        <ConsultationForm />
      </Reveal>
      <Reveal delay={40}>
        <KnowledgeStrip items={knowledge} />
      </Reveal>
      <Reveal delay={40}>
        <ProjectsStrip projects={projects} />
      </Reveal>
      <Reveal delay={40}>
        <PdfCatalogs />
      </Reveal>
      <Reveal delay={40}>
        <WhyUs />
      </Reveal>
      <Reveal delay={40}>
        <CtaBlock />
      </Reveal>
    </>
  );
}
