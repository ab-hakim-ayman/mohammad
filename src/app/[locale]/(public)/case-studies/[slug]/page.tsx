import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { caseStudyService } from "@/features/case-study/server";
import { StickyTableOfContents, BadgeList, ImageGallery } from "@/components/content/details";
import { ContentRenderer, extractToc } from "@/components/content";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Link } from "@/shared/i18n";
import {
  ArrowUpRight,
  ArrowRight,
  Briefcase,
  Layers,
  Code2,
  Calendar,
  Tag,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";
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
  const tocItems = rawTocItems.length >= 2 ? rawTocItems : [];
  const shareUrl = `https://a2icoders.com/case-studies/${study.slug}`;
  const shareTitle = encodeURIComponent(study.title);

  const bannerStats = [
    ...(project?.client
      ? [{ label: "Client Partner", value: project.client.title.split(" ")[0] }]
      : []),
    { label: "Timeline Scope", value: timelineValue },
    ...(project?.technologies && project.technologies.length > 0
      ? [{ label: "Core Stack", value: project.technologies[0].title }]
      : []),
  ].slice(0, 4);

  // 🎯 ১. liveUrl Safe Check (Type error bypass)
  const projectLiveUrl = (project as Record<string, any>)?.liveUrl;

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 🟢 1. Hero Feature Details Banner */}
      <FeatureDetailsBanner
        variant="gradient-glow"
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
      >
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {project && (
            <Link
              href={`/projects/${project.slug}`}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
            >
              <I18n>Explore Active Product</I18n>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          {projectLiveUrl && (
            <a
              href={projectLiveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-elevated/80 border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-xs font-bold tracking-wider uppercase transition-all"
            >
              <I18n>Live Demo</I18n>
              <ExternalLink className="text-primary h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </FeatureDetailsBanner>

      {/* 🟢 2. At-A-Glance Corporate Telemetry Strip */}
      {project && (
        <section className="container-custom mx-auto mt-8 mb-16 px-4 sm:px-6">
          <ScrollReveal delay={150}>
            <div className="bg-card/60 border-border grid grid-cols-2 gap-4 rounded-xl border p-6 shadow-xs backdrop-blur-md sm:grid-cols-4 lg:grid-cols-5">
              {project.client && (
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                      <I18n>Partner</I18n>
                    </p>
                    <p className="text-foreground truncate text-xs font-bold">
                      {project.client.title}
                    </p>
                  </div>
                </div>
              )}

              {project.industry && (
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                      <I18n>Industry</I18n>
                    </p>
                    <p className="text-foreground truncate text-xs font-bold">
                      {project.industry.title}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                    <I18n>Lifecycle</I18n>
                  </p>
                  <p className="text-foreground truncate text-xs font-bold">{timelineValue}</p>
                </div>
              </div>

              {project.technologies && project.technologies.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                    <Code2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                      <I18n>Engine</I18n>
                    </p>
                    <p className="text-foreground truncate text-xs font-bold">
                      {project.technologies
                        .slice(0, 2)
                        .map((t: any) => t.title)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              )}

              <div className="hidden items-center gap-3 lg:flex">
                <div className="bg-success/10 text-success rounded-lg p-2.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                    <I18n>Outcome</I18n>
                  </p>
                  <p className="text-foreground text-xs font-bold">
                    <I18n>Production Verified</I18n>
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* 🟢 3. Main Reading & Architecture Content Area */}
      {Object.keys(json).length > 0 && (
        <section className="container-custom mb-20 px-4 sm:px-6">
          <div className="3xl:grid-cols-[260px_1fr] grid items-start gap-12 lg:grid-cols-[240px_1fr] xl:gap-16">
            {/* Sticky Sidebar (TOC & Share) */}
            <aside className="sticky top-28 hidden space-y-10 self-start lg:block">
              {tocItems.length > 0 && (
                <div className="border-border border-l-2 pl-4">
                  <p className="text-muted-foreground mb-4 text-xs font-black tracking-widest uppercase select-none">
                    <I18n>On This Page</I18n>
                  </p>
                  <StickyTableOfContents items={tocItems} />
                </div>
              )}

              <div className="border-border border-l-2 pl-4">
                <p className="text-muted-foreground mb-4 text-xs font-black tracking-widest uppercase select-none">
                  <I18n>Share Study</I18n>
                </p>
                <div className="flex flex-col gap-2.5">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary flex items-center gap-3 text-xs font-semibold transition-colors"
                  >
                    <div className="bg-surface-elevated border-border flex h-8 w-8 items-center justify-center rounded-full border">
                      <FaTwitter className="h-3.5 w-3.5" />
                    </div>
                    Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary flex items-center gap-3 text-xs font-semibold transition-colors"
                  >
                    <div className="bg-surface-elevated border-border flex h-8 w-8 items-center justify-center rounded-full border">
                      <FaLinkedin className="h-3.5 w-3.5" />
                    </div>
                    LinkedIn
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary flex items-center gap-3 text-xs font-semibold transition-colors"
                  >
                    <div className="bg-surface-elevated border-border flex h-8 w-8 items-center justify-center rounded-full border">
                      <FaFacebook className="h-3.5 w-3.5" />
                    </div>
                    Facebook
                  </a>
                </div>
              </div>
            </aside>

            {/* Reading Column */}
            <div className="w-full min-w-0">
              {tocItems.length > 0 && (
                <div className="border-border mb-8 border-l-2 pl-4 lg:hidden">
                  <p className="text-muted-foreground mb-3 text-xs font-black tracking-widest uppercase select-none">
                    <I18n>On This Page</I18n>
                  </p>
                  <StickyTableOfContents items={tocItems} />
                </div>
              )}

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

              {/* Categories & Tags */}
              {((study.categories && study.categories.length > 0) ||
                (study.tags && study.tags.length > 0)) && (
                <div className="border-border mt-12 flex flex-col gap-4 border-t pt-8">
                  {study.categories && study.categories.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-muted-foreground mr-2 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase select-none">
                        <Layers className="text-primary h-3.5 w-3.5" />
                        <I18n>Categories:</I18n>
                      </div>
                      <BadgeList items={study.categories} hrefPrefix="/case-studies?category=" />
                    </div>
                  )}

                  {study.tags && study.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-muted-foreground mr-2 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase select-none">
                        <Tag className="text-primary h-3.5 w-3.5" />
                        <I18n>Tags:</I18n>
                      </div>
                      <BadgeList items={study.tags} hrefPrefix="/case-studies?tag=" />
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Share Bar */}
              <div className="border-border mt-8 flex items-center justify-between border-t pt-8 lg:hidden">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase select-none">
                  <I18n>Share Study:</I18n>
                </span>
                <div className="flex items-center gap-2.5">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-surface-elevated border-border text-foreground hover:text-primary flex h-9 w-9 items-center justify-center rounded-full border transition-all"
                  >
                    <FaTwitter className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-surface-elevated border-border text-foreground hover:text-primary flex h-9 w-9 items-center justify-center rounded-full border transition-all"
                  >
                    <FaLinkedin className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-surface-elevated border-border text-foreground hover:text-primary flex h-9 w-9 items-center justify-center rounded-full border transition-all"
                  >
                    <FaFacebook className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 🟢 4. Visual Gallery */}
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

      {/* 🟢 5. Applied Services & Capabilities */}
      {project?.services && project.services.length > 0 && (
        <ServicePreviewSection
          items={project.services as any}
          limit={4}
          eyebrow="Capabilities Applied"
          title="Services behind this delivery"
          description="Specific engineering and cloud management services provided to execute this architecture."
        />
      )}

      {/* 🟢 6. Core Technology Stack */}
      {project?.technologies && project.technologies.length > 0 && (
        <TechnologyPreviewSection
          items={project.technologies as any}
          limit={12}
          eyebrow="Engine Stack"
          title="Technologies powering this capability"
        />
      )}


      {/* 🟢 8. Client Endorsements & Social Proof */}
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

      {/* 🟢 9. Related Engineering Work */}
      <ProjectPreviewSection
        limit={3}
        eyebrow="Related Work"
        title="Explore similar delivery case studies"
      />

      {/* 🟢 10. Final High-Conversion Enterprise CTA */}
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
