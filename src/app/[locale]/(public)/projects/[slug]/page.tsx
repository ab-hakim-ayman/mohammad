import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectService } from "@/features/project/server";
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
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import I18n from "@/shared/components/I18n";
import { FaGithub } from "react-icons/fa";

// 🎯 Universal Ecosystem Components Integration
import { ServicePreviewSection } from "@/features/service/components/ServicePreviewSection";
import { TechnologyPreviewSection } from "@/features/technology/components/TechnologyPreviewSection";
import { ProjectPreviewSection } from "@/features/project/components/ProjectPreviewSection";
import { TestimonialPreviewSection } from "@/features/testimonial/components/TestimonialPreviewSection";

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
    const project = await projectService.getPublicBySlug(slug);
    const description = project.seoDescription ?? project.shortDesc ?? "";

    return {
      title: `${project.seoTitle || project.title} | Software Engineering Showcase`,
      description: truncate(description, 160),
      openGraph: {
        title: `${project.seoTitle || project.title} - Enterprise Product Showcase`,
        description: truncate(description, 160),
        images:
          (project.ogImage ?? project.cardImage)
            ? [project.ogImage ?? project.cardImage ?? ""]
            : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: project.seoTitle || project.title,
        description: truncate(description, 160),
        images:
          (project.ogImage ?? project.cardImage)
            ? [project.ogImage ?? project.cardImage ?? ""]
            : [],
      },
    };
  } catch {
    return { title: "Project Not Found" };
  }
}

export default async function PublicProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let project: any;
  try {
    project = await projectService.getPublicBySlug(slug);
  } catch {
    notFound();
  }

  const json = project.contentJson || {};

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.seoTitle || project.title,
    description: project.seoDescription || project.shortDesc || project.title,
    image: project.cardImage ? [project.cardImage] : [],
  };

  let timelineValue = "";
  if (project.startDate && project.endDate) {
    timelineValue = `${new Date(project.startDate).getFullYear()} - ${new Date(project.endDate).getFullYear()}`;
  } else if (project.startDate) {
    const month = new Date(project.startDate).toLocaleString("en-US", { month: "short" });
    const year = new Date(project.startDate).getFullYear();
    timelineValue = `Active from ${month} ${year}`;
  } else if (project.endDate) {
    timelineValue = `Delivered ${new Date(project.endDate).getFullYear()}`;
  }

  const mainImage = project.cardImage || project.ogImage;
  const uniqueImages = (project.galleryImages || []).filter((img: string) => img !== mainImage);

  const rawTocItems = extractToc(json, "project") || [];
  const tocItems = rawTocItems.length >= 1 ? rawTocItems : [];
  const shareUrl = `https://a2icoders.com/projects/${project.slug}`;

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 🟢 1. Hero Feature Banner */}
      <FeatureDetailsBanner
        variant="split"
        backHref="/projects"
        backLabel="All Projects"
        eyebrow={project.isFeatured ? "Featured Product" : "Software Architecture"}
        title={project.title}
        description={project.shortDesc || `Production software platform engineered by A2ICoders.`}
        badges={[...(project.industry ? [project.industry.title] : []), "Production Systems"]}
        stats={[
          { label: "Timeline", value: timelineValue || "Active Lifecycle" },
          {
            label: "Client Partner",
            value: project.client?.title ? project.client.title.split(" ")[0] : "Internal Node",
          },
        ]}
        videoSrc={project.demoVideoUrl || undefined}
        imageSrc={mainImage || undefined}
        imageAlt={`${project.title} project banner`}
        imagePosition="center"
      />

      {/* 🟢 2. Unified Responsive Main Reading Layout */}
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
              {project.categories && project.categories.length > 0 && (
                <div className="border-border/60 border-t pt-6">
                  <CategoryWidget
                    items={project.categories}
                    label="Categories"
                    itemPattern="listRow"
                    hrefPrefix="/projects?category="
                    showCount={false}
                  />
                </div>
              )}

              {/* 3. Tags Widget */}
              {project.tags && project.tags.length > 0 && (
                <div className="border-border/60 border-t pt-6">
                  <TagWidget
                    items={project.tags}
                    label="Tags"
                    itemPattern="capsulePill"
                    hrefPrefix="/projects?tag="
                  />
                </div>
              )}

              {/* 4. Share Widget */}
              <div className="border-border/60 border-t pt-6">
                <ShareWidget
                  url={shareUrl}
                  title={project.title}
                  label="Share Product"
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
            {/* Core Rich Text Content */}
            <div className="prose prose-base sm:prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-img:rounded-xl max-w-none font-medium">
              {json && Object.keys(json).length > 0 ? (
                <ContentRenderer variant="project" content={json} />
              ) : (
                <p className="text-muted-foreground leading-relaxed">{project.shortDesc}</p>
              )}
            </div>

            {/* Demo Video Embed */}
            {project.demoVideoUrl && (
              <div className="border-border mt-14 border-t pt-10">
                <h3 className="mb-6 text-xl font-bold tracking-tight">
                  <I18n>Product Demonstration</I18n>
                </h3>
                <div className="border-border bg-muted relative aspect-video w-full overflow-hidden rounded-xl border shadow-md">
                  <iframe
                    src={project.demoVideoUrl.replace("watch?v=", "embed/")}
                    className="h-full w-full border-0"
                    allowFullScreen
                    title="Demo Video"
                  />
                </div>
              </div>
            )}

            {/* Deep Dive Case Study Banner Card */}
            {project.caseStudy && (
              <div className="bg-card/60 border-primary/30 relative mt-12 overflow-hidden rounded-xl border p-8 shadow-xs">
                <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full blur-2xl" />
                <div className="relative z-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                  <div className="max-w-lg space-y-2">
                    <span className="text-primary flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] uppercase">
                      <BookOpen className="h-3.5 w-3.5" />
                      <I18n>Case Study Available</I18n>
                    </span>
                    <h3 className="text-foreground text-xl font-bold">
                      <I18n>Deep Dive into the Architecture</I18n>
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      <I18n>
                        Read the full case study exploring technical constraints, business
                        requirements, and operational benchmarks.
                      </I18n>
                    </p>
                  </div>
                  <Link
                    href={`/case-studies/${project.caseStudy.slug}`}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex shrink-0 items-center gap-2 rounded-lg px-6 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <I18n>Read Case Study</I18n>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 🟢 3. Visual Gallery */}
      {uniqueImages.length > 0 && (
        <section className="bg-card/40 border-border border-y py-16 sm:py-20">
          <div className="container-custom mx-auto px-4 sm:px-6">
            <ScrollReveal className="mb-10 text-center">
              <p className="text-primary mb-2 text-xs font-bold tracking-[0.2em] uppercase">
                <I18n>Interface Exhibits</I18n>
              </p>
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                <I18n>Screenshots & Media Gallery</I18n>
              </h2>
            </ScrollReveal>
            <ImageGallery images={uniqueImages} />
          </div>
        </section>
      )}

      {/* 🟢 4. Capabilities & Services Provided */}
      {project.services && project.services.length > 0 ? (
        <ServicePreviewSection
          items={project.services as any}
          limit={4}
          eyebrow="Capabilities Delivered"
          title="Services executed for this software system"
        />
      ) : (
        <ServicePreviewSection
          limit={3}
          eyebrow="Core Services"
          title="Engineering capabilities behind our product development"
        />
      )}

      {/* 🟢 5. Technology Stack Used */}
      {project.technologies && project.technologies.length > 0 ? (
        <TechnologyPreviewSection
          items={project.technologies as any}
          limit={12}
          eyebrow="Engine Stack"
          title="Technologies powering this application"
        />
      ) : (
        <TechnologyPreviewSection
          limit={12}
          eyebrow="Tech Engine"
          title="Production frameworks & cloud platforms"
        />
      )}

      {/* 🟢 6. Client Testimonials & Endorsements */}
      <TestimonialPreviewSection
        limit={3}
        eyebrow="Client Verification"
        title="Partner feedback on system performance & delivery"
      />

      {/* 🟢 7. Similar Projects & Deliveries */}
      <ProjectPreviewSection
        limit={3}
        eyebrow="Portfolio Systems"
        title="Explore similar engineering projects"
      />

      {/* 🟢 8. Final Action CTA */}
      <section className="container-custom mt-16 px-4 text-center sm:px-6">
        <ScrollReveal>
          <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 text-center shadow-xl sm:p-14">
            <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-4xl">
                <I18n>Have a similar system in mind?</I18n>
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                <I18n>
                  Let&apos;s discuss how our senior engineers can design, build, and deploy custom
                  software solutions tailored to your operational needs.
                </I18n>
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                >
                  <I18n>Schedule Engineering Consultation</I18n>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="bg-surface-elevated border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg border px-8 py-3 text-xs font-bold tracking-wider uppercase transition-all"
                >
                  <I18n>Explore Services</I18n>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </article>
  );
}