import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudyService } from "@/features/case-study/server";
import {
  StickyTableOfContents,
  ImageGallery,
} from "@/components/content/details";
import {
  CategoryWidget,
  TagWidget,
  ShareWidget,
} from "@/shared/components";
import { ContentRenderer, extractToc } from "@/components/content";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Link } from "@/shared/i18n";
import {
  ArrowUpRight,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import I18n from "@/shared/components/I18n";

// 🎯 Universal Ecosystem Components Integration
import { TechnologyPreviewSection } from "@/features/technology/components/TechnologyPreviewSection";
import { ServicePreviewSection } from "@/features/service/components/ServicePreviewSection";
import { TestimonialPreviewSection } from "@/features/testimonial/components/TestimonialPreviewSection";
import { ProjectPreviewSection } from "@/features/project/components/ProjectPreviewSection";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function stripHtml(input: string | null | undefined) {
  return (input || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(str: string, length: number) {
  const cleanStr = stripHtml(str);
  if (cleanStr.length <= length) return cleanStr;
  return cleanStr.substring(0, length) + "...";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const study = await caseStudyService.getPublicBySlug(slug);
    const description = study.seoDescription || study.shortDesc || study.project?.shortDesc || "";

    return {
      title: `${study.seoTitle || study.title} | Case Study`,
      description: truncate(description, 160),
      openGraph: {
        title: study.seoTitle || study.title,
        description: truncate(description, 160),
        images:
          study.ogImage || study.cardImage || study.project?.cardImage
            ? [study.ogImage || study.cardImage || study.project?.cardImage || ""]
            : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: study.seoTitle || study.title,
        description: truncate(description, 160),
        images:
          study.ogImage || study.cardImage || study.project?.cardImage
            ? [study.ogImage || study.cardImage || study.project?.cardImage || ""]
            : [],
      },
    };
  } catch {
    return { title: "Case Study Not Found" };
  }
}

export default async function PublicCaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let study: any;
  try {
    study = await caseStudyService.getPublicBySlug(slug);
  } catch {
    notFound();
  }

  const json = study.contentJson || {};
  const project = study.project;
  const mainImage = study.heroImage || study.cardImage || project?.cardImage;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.seoTitle || study.title,
    description: study.seoDescription || study.shortDesc || project?.shortDesc,
    image: mainImage ? [mainImage] : [],
  };

  let timelineValue = "N/A";
  if (project?.startDate && project?.endDate) {
    timelineValue = `${new Date(project.startDate).getFullYear()} - ${new Date(project.endDate).getFullYear()}`;
  } else if (project?.startDate) {
    const month = new Date(project.startDate).toLocaleString("en-US", { month: "short" });
    const year = new Date(project.startDate).getFullYear();
    timelineValue = `Active from ${month} ${year}`;
  } else if (project?.endDate) {
    timelineValue = `Delivered ${new Date(project.endDate).getFullYear()}`;
  }

  const uniqueImages = (study.galleryImages || []).filter((img: string) => img !== mainImage);
  const rawTocItems = extractToc(json, "CASE_STUDY") || [];
  const tocItems = rawTocItems.length >= 1 ? rawTocItems : [];
  const shareUrl = `https://a2icoders.com/case-studies/${study.slug}`;

  const bannerStats = [
    ...(project?.client
      ? [{ label: "Client Partner", value: project.client.title.split(" ")[0] }]
      : []),
    { label: "Timeline Scope", value: timelineValue },
    ...(project?.technologies && project.technologies.length > 0
      ? [{ label: "Core Stack", value: project.technologies[0].title }]
      : []),
  ].slice(0, 4);

  const projectLiveUrl = (project as Record<string, any>)?.liveUrl;

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 🟢 1. Hero Feature Details Banner */}
      <FeatureDetailsBanner
        variant="split"
        backHref="/case-studies"
        backLabel="Case Studies"
        eyebrow={study.isFeatured ? "Featured Solution" : "Case Study Architecture"}
        title={study.title}
        description={
          study.shortDesc ||
          `Explore the architectural implementation and business outcome of ${study.title}.`
        }
        badges={[
          ...(project?.industry ? [project.industry.title] : []),
          ...(study.categories ? study.categories.map((c: any) => c.title) : []),
        ]}
        stats={bannerStats}
        videoSrc={study.heroVideoUrl || undefined}
        imageSrc={mainImage || undefined}
        imageAlt={`${study.title} case study banner`}
        imagePosition="center"
      />

      {/* 🟢 2. Unified Responsive Main Reading Layout */}
      {Object.keys(json).length > 0 && (
        <section className="container-custom mt-12 mb-20 px-4 sm:px-6">
          <div className="3xl:grid-cols-[260px_1fr] flex flex-col items-start gap-10 lg:grid lg:grid-cols-[240px_1fr] xl:gap-16">

            {/* 📊 Left Sticky Sidebar: TOC -> Categories -> Tags -> Share */}
            <aside className="border-border/60 bg-card/40 lg:border-none lg:bg-transparent top-24 w-full rounded-2xl border p-4 backdrop-blur-md sm:p-6 lg:sticky lg:top-28 lg:w-[240px] xl:w-[260px] lg:self-start lg:shrink-0 lg:p-0 lg:backdrop-blur-none">
              <div className="flex flex-col space-y-6">

                {/* 1. Table of Contents */}
                {tocItems.length > 0 && (
                  <div className="relative">
                    <StickyTableOfContents items={tocItems} />
                  </div>
                )}

                {/* 2. Categories Widget */}
                {study.categories && study.categories.length > 0 && (
                  <div className="border-border/60 border-t pt-6">
                    <CategoryWidget
                      items={study.categories}
                      label="Categories"
                      itemPattern="listRow"
                      hrefPrefix="/case-studies?category="
                      showCount={false}
                    />
                  </div>
                )}

                {/* 3. Tags Widget */}
                {study.tags && study.tags.length > 0 && (
                  <div className="border-border/60 border-t pt-6">
                    <TagWidget
                      items={study.tags}
                      label="Tags"
                      itemPattern="capsulePill"
                      hrefPrefix="/case-studies?tag="
                    />
                  </div>
                )}

                {/* 4. Share Widget */}
                <div className="border-border/60 border-t pt-6">
                  <ShareWidget
                    url={shareUrl}
                    title={study.title}
                    label="Share Study"
                    variant="classic"
                    layout="vertical"
                    showLabels={true}
                    showCopy={true}
                  />
                </div>

              </div>
            </aside>

            {/* 📖 Reading Column */}
            <div className="w-full min-w-0">
              {/* Content Renderer */}
              <div className="prose prose-base sm:prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-img:rounded-xl max-w-none font-medium">
                <ContentRenderer variant="caseStudy" content={json} />
              </div>

              {/* Demo Video Embed */}
              {study.demoVideoUrl && (
                <div className="border-border mt-14 border-t pt-10">
                  <h3 className="mb-6 text-xl font-bold tracking-tight">
                    <I18n>Project Demonstration</I18n>
                  </h3>
                  <div className="border-border bg-muted relative aspect-video w-full overflow-hidden rounded-xl border shadow-md">
                    <iframe
                      src={study.demoVideoUrl.replace("watch?v=", "embed/")}
                      className="h-full w-full border-0"
                      allowFullScreen
                      title="Demo Video"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 🟢 3. Visual Gallery */}
      {uniqueImages.length > 0 && (
        <section className="bg-card/40 border-border border-y py-16 sm:py-20">
          <div className="container-custom mx-auto px-4 sm:px-6">
            <ScrollReveal className="mb-10 text-center">
              <p className="text-primary mb-2 text-xs font-bold tracking-[0.2em] uppercase">
                <I18n>Screenshots & Architecture</I18n>
              </p>
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                <I18n>Visual Exhibits</I18n>
              </h2>
            </ScrollReveal>
            <ImageGallery images={uniqueImages} />
          </div>
        </section>
      )}

      {/* 🟢 4. Applied Services & Capabilities */}
      {project?.services && project.services.length > 0 && (
        <ServicePreviewSection
          items={project.services as any}
          limit={4}
          eyebrow="Capabilities Applied"
          title="Services behind this delivery"
          description="Specific engineering and cloud management services provided to execute this architecture."
        />
      )}

      {/* 🟢 5. Core Technology Stack */}
      {project?.technologies && project.technologies.length > 0 && (
        <TechnologyPreviewSection
          items={project.technologies as any}
          limit={12}
          eyebrow="Engine Stack"
          title="Technologies powering this capability"
        />
      )}

      {/* 🟢 6. Client Endorsements & Social Proof */}
      {study.testimonials && study.testimonials.length > 0 ? (
        <TestimonialPreviewSection
          items={study.testimonials as any}
          limit={3}
          eyebrow="Partner Voice"
          title="What the client says about this transformation"
        />
      ) : (
        <TestimonialPreviewSection
          limit={3}
          eyebrow="Social Proof"
          title="Client feedback on our engineering rigor"
        />
      )}

      {/* 🟢 7. Related Engineering Work */}
      <ProjectPreviewSection
        limit={3}
        eyebrow="Related Work"
        title="Explore similar delivery case studies"
      />

      {/* 🟢 8. Final High-Conversion Enterprise CTA */}
      <section className="container-custom mt-16 px-4 text-center sm:px-6">
        <ScrollReveal>
          <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 text-center shadow-xl sm:p-14">
            <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-4xl">
                <I18n>Ready to scale your architecture?</I18n>
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                <I18n>
                  Schedule an engineering assessment with our senior architects to discuss your
                  specific infrastructure and software goals.
                </I18n>
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                >
                  <I18n>Talk to an Architect</I18n>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/case-studies"
                  className="bg-surface-elevated border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg border px-8 py-3 text-xs font-bold tracking-wider uppercase transition-all"
                >
                  <I18n>View All Case Studies</I18n>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </article>
  );
}