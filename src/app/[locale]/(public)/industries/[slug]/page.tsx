import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { industryService } from "@/features/industry/server";
import { blogService } from "@/features/blog/server";
import { StickyTableOfContents, ImageGallery } from "@/components/content/details";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { ContentRenderer, extractToc } from "@/components/content";
import { Link } from "@/shared/i18n";
import {
  ArrowUpRight,
  ArrowRight,
  Layers,
  FileText,
  LayoutTemplate,
  Building2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import I18n from "@/shared/components/I18n";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

// 🎯 Universal Ecosystem Components Integration
import { ServicePreviewSection } from "@/features/service/components/ServicePreviewSection";
import { ProjectPreviewSection } from "@/features/project/components/ProjectPreviewSection";
import { BlogPreviewSection } from "@/features/blog/components/BlogPreviewSection";
import { TechnologyPreviewSection } from "@/features/technology/components/TechnologyPreviewSection";
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
    const industry = await industryService.getPublicBySlug(slug);
    const description =
      industry.seoDescription ||
      industry.shortDesc ||
      `${industry.title} enterprise industry solutions`;
    return {
      title: `${industry.seoTitle || industry.title} | Industry Solutions`,
      description: truncate(description, 160),
      openGraph: {
        title: `${industry.seoTitle || industry.title} - Industry Architecture`,
        description: truncate(description, 160),
        images:
          industry.ogImage || industry.cardImage
            ? [industry.ogImage || industry.cardImage || ""]
            : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: industry.seoTitle || industry.title,
        description: truncate(description, 160),
        images:
          industry.ogImage || industry.cardImage
            ? [industry.ogImage || industry.cardImage || ""]
            : [],
      },
    };
  } catch {
    return { title: "Industry Not Found" };
  }
}

export default async function PublicIndustryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let industry: any;
  try {
    industry = await industryService.getPublicBySlug(slug);
  } catch {
    notFound();
  }

  // Fetch Industry specific blogs
  const blogsCatResponse = await blogService.getPublished({ category: slug, limit: 4 });
  let relatedBlogs = blogsCatResponse.data || [];
  if (relatedBlogs.length === 0) {
    const blogsTagResponse = await blogService.getPublished({ tag: slug, limit: 4 });
    relatedBlogs = blogsTagResponse.data || [];
  }

  const sortedServices = [...(industry.services || [])].sort(
    (a: any, b: any) => (a.order || 0) - (b.order || 0)
  );

  const json = industry.contentJson || {};
  const toc = extractToc(json, "industry") || [];
  const showToc = toc.length >= 2;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: industry.seoTitle || industry.title,
    description: industry.seoDescription || industry.shortDesc || industry.title,
    image: industry.cardImage ? [industry.cardImage] : [],
  };

  const mainImage = industry.heroImage || industry.cardImage;
  const uniqueImages = (industry.galleryImages || []).filter((img: string) => img !== mainImage);

  const shareUrl = `https://a2icoders.com/industries/${industry.slug}`;
  const shareTitle = encodeURIComponent(industry.title);

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 🟢 1. Hero Feature Banner */}
      <FeatureDetailsBanner
        variant="gradient-glow"
        backHref="/industries"
        backLabel="All Sectors"
        eyebrow="Industry Practice"
        title={industry.title}
        description={
          industry.shortDesc ||
          `Enterprise technology integration & software solutions tailored for the ${industry.title} sector.`
        }
        badges={[
          industry.isFeatured ? "Featured Domain" : "Industry Practice",
          "Enterprise Solutions",
        ]}
        stats={[
          { label: "Capabilities", value: `${industry._count?.services || 0} Offerings` },
          { label: "Systems Built", value: `${industry._count?.projects || 0} Deployments` },
        ]}
        videoSrc={industry.heroVideoUrl || undefined}
        imageSrc={mainImage || undefined}
        imageAlt={`${industry.title} industry banner`}
        imagePosition="center"
      >
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
          >
            <I18n>Consult Industry Practice</I18n>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </FeatureDetailsBanner>

      {/* 🟢 2. At-A-Glance Telemetry Metric Strip */}
      <section className="container-custom mx-auto mt-8 mb-16 px-4 sm:px-6">
        <ScrollReveal delay={150}>
          <div className="bg-card/60 border-border grid grid-cols-2 gap-4 rounded-xl border p-6 shadow-xs backdrop-blur-md sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Sector</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">{industry.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Layers className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Services</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  {industry._count?.services || 0} <I18n>Modules</I18n>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <LayoutTemplate className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Deployments</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  {industry._count?.projects || 0} <I18n>Products</I18n>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-success/10 text-success rounded-lg p-2.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Compliance</I18n>
                </p>
                <p className="text-foreground text-xs font-bold">
                  <I18n>Enterprise Ready</I18n>
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 🟢 3. Main Reading Area & Industry Blueprint */}
      {(Object.keys(json).length > 0 || industry.shortDesc) && (
        <section className="container-custom mb-20 px-4 sm:px-6">
          <div className="3xl:grid-cols-[260px_1fr] grid items-start gap-12 lg:grid-cols-[240px_1fr] xl:gap-16">
            {/* Sticky Sidebar */}
            <aside className="sticky top-28 hidden space-y-10 self-start lg:block">
              {showToc && (
                <div className="border-border border-l-2 pl-4">
                  <p className="text-muted-foreground mb-4 text-xs font-black tracking-widest uppercase select-none">
                    <I18n>On This Page</I18n>
                  </p>
                  <StickyTableOfContents items={toc} />
                </div>
              )}

              <div className="border-border border-l-2 pl-4">
                <p className="text-muted-foreground mb-4 text-xs font-black tracking-widest uppercase select-none">
                  <I18n>Share Practice</I18n>
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
                    </div>{" "}
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
                    </div>{" "}
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
                    </div>{" "}
                    Facebook
                  </a>
                </div>
              </div>
            </aside>

            {/* Reading Column */}
            <div className="w-full min-w-0">
              {showToc && (
                <div className="border-border mb-8 border-l-2 pl-4 lg:hidden">
                  <p className="text-muted-foreground mb-3 text-xs font-black tracking-widest uppercase select-none">
                    <I18n>On This Page</I18n>
                  </p>
                  <StickyTableOfContents items={toc} />
                </div>
              )}

              <div className="prose prose-base sm:prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-img:rounded-xl max-w-none font-medium">
                {Object.keys(json).length > 0 ? (
                  <ContentRenderer
                    variant="industry"
                    content={json}
                    legacyContent={industry.shortDesc}
                  />
                ) : industry.shortDesc ? (
                  <div dangerouslySetInnerHTML={{ __html: industry.shortDesc }} />
                ) : null}
              </div>

              {/* Demo Video Embed */}
              {industry.demoVideoUrl && (
                <div className="border-border mt-14 border-t pt-10">
                  <h3 className="mb-6 text-xl font-bold tracking-tight">
                    <I18n>Industry Capability Video</I18n>
                  </h3>
                  <div className="border-border bg-muted relative aspect-video w-full overflow-hidden rounded-xl border shadow-md">
                    <iframe
                      src={industry.demoVideoUrl.replace("watch?v=", "embed/")}
                      className="h-full w-full border-0"
                      allowFullScreen
                      title="Demo Video"
                    />
                  </div>
                </div>
              )}

              {/* Mobile Share Bar */}
              <div className="border-border mt-8 flex items-center justify-between border-t pt-8 lg:hidden">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase select-none">
                  <I18n>Share Practice:</I18n>
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
                <I18n>Visual Architecture</I18n>
              </p>
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                <I18n>Industry Solutions Gallery</I18n>
              </h2>
            </ScrollReveal>
            <ImageGallery images={uniqueImages} />
          </div>
        </section>
      )}

      {/* 🟢 5. Services Tailored for this Industry */}
      {sortedServices.length > 0 ? (
        <ServicePreviewSection
          items={sortedServices as any}
          limit={6}
          eyebrow="Targeted Capabilities"
          title={`Services engineered for ${industry.title}`}
          description={`Discover modular software services and cloud solutions optimized specifically for ${industry.title} operations.`}
        />
      ) : (
        <ServicePreviewSection
          limit={4}
          eyebrow="Core Services"
          title="Enterprise capabilities behind our industry delivery"
        />
      )}

      {/* 🟢 6. Delivered Projects & Portfolio (Prisma Projects Relation) */}
      {industry.projects && industry.projects.length > 0 ? (
        <ProjectPreviewSection
          items={industry.projects as any}
          limit={4}
          eyebrow="Sector Deliveries"
          title={`Production systems deployed in ${industry.title}`}
        />
      ) : (
        <ProjectPreviewSection
          limit={4}
          eyebrow="Proven Systems"
          title="Explore our portfolio of high-scale software solutions"
        />
      )}

      {/* 🟢 7. Core Technologies Deployed (Prisma Technology Model) */}
      <TechnologyPreviewSection
        limit={12}
        eyebrow="Tech Engine"
        title="Modern stacks & platforms powering this industry"
      />


      {/* 🟢 9. Social Proof & Client Testimonials */}
      <TestimonialPreviewSection
        limit={3}
        eyebrow="Partner Trust"
        title={`What ${industry.title} leaders say about our execution`}
      />

      {/* 🟢 10. Related Thought Leadership & Insights (Prisma Blog Model) */}
      {relatedBlogs.length > 0 && (
        <BlogPreviewSection
          items={relatedBlogs as any}
          limit={4}
          eyebrow="Thought Leadership"
          title={`Latest insights in ${industry.title}`}
          description="Read architecture analysis, regulatory updates, and software engineering notes."
          href="/blogs"
          ctaLabel="View all insights"
        />
      )}

      {/* 🟢 11. Final High-Conversion Enterprise CTA */}
      <section className="container-custom mt-16 px-4 text-center sm:px-6">
        <ScrollReveal>
          <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 text-center shadow-xl sm:p-14">
            <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-4xl">
                <I18n>Ready to modernize your industry footprint?</I18n>
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                <I18n>
                  Schedule a private architectural consultation with our domain engineers to review
                  your infrastructure and software goals.
                </I18n>
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                >
                  <I18n>Schedule Industry Consultation</I18n>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="bg-surface-elevated border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg border px-8 py-3 text-xs font-bold tracking-wider uppercase transition-all"
                >
                  <I18n>Browse All Capabilities</I18n>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </article>
  );
}
