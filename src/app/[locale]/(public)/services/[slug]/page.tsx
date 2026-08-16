import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { serviceService } from "@/features/service/server";
import { StickyTableOfContents, FaqAccordion } from "@/components/content/details";
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
  Briefcase,
  CheckCircle2,
} from "lucide-react";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import I18n from "@/shared/components/I18n";

// 🎯 Universal Ecosystem Components Integration
import { ProjectPreviewSection } from "@/features/project/components/ProjectPreviewSection";
import { TechnologyPreviewSection } from "@/features/technology/components/TechnologyPreviewSection";
import { TestimonialPreviewSection } from "@/features/testimonial/components/TestimonialPreviewSection";
import { BlogPreviewSection } from "@/features/blog/components/BlogPreviewSection";

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
    const service = await serviceService.getPublicBySlug(slug);
    const description =
      service.seoDescription || service.shortDesc || stripHtml(JSON.stringify(service.contentJson));
    return {
      title: `${service.seoTitle || service.title} | Engineering Capability`,
      description: truncate(description, 160),
      openGraph: {
        title: `${service.seoTitle || service.title} - Service Offering`,
        description: truncate(description, 160),
        images:
          service.ogImage || service.heroImage ? [service.ogImage || service.heroImage || ""] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: service.seoTitle || service.title,
        description: truncate(description, 160),
        images:
          service.ogImage || service.heroImage ? [service.ogImage || service.heroImage || ""] : [],
      },
    };
  } catch {
    return { title: "Service Not Found" };
  }
}

export default async function PublicServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let service: any;
  try {
    service = await serviceService.getPublicBySlug(slug);
  } catch {
    notFound();
  }

  const json = service.contentJson || {};

  // 🟢 1. Table of Contents Safe Initialization
  const rawTocItems = extractToc(json, "service") || [];
  const tocItems = rawTocItems.length >= 1 ? rawTocItems : [];

  const shareUrl = `https://a2icoders.com/services/${service.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.seoTitle || service.title,
    description: service.seoDescription || service.shortDesc || service.title,
    provider: {
      "@type": "Organization",
      name: "A2ICoders",
      sameAs: "https://a2icoders.com",
    },
    image: service.heroImage ? [service.heroImage] : [],
  };

  const faqs = service.faqs || [];

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq: any) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}

      {/* 🟢 1. Hero Feature Banner */}
      <FeatureDetailsBanner
        variant="split"
        backHref="/services"
        backLabel="All Capabilities"
        eyebrow={service.isFeatured ? "Featured Capability" : "Core Offering"}
        title={service.title}
        description={
          service.shortDesc ||
          `Enterprise-grade ${service.title} services designed for mission-critical digital systems.`
        }
        badges={
          service.categories && service.categories.length > 0
            ? service.categories.map((c: any) => c.title)
            : ["Production Service"]
        }
        stats={[
          { label: "Deployments", value: `${service._count?.projects || 0} Systems` },
          { label: "Modules", value: `${service.specializations?.length || 0} Capabilities` },
        ]}
        videoSrc={service.heroVideoUrl || undefined}
        imageSrc={service.heroImage || undefined}
        imageAlt={`${service.title} service banner`}
        imagePosition="center"
      />

      {/* 🟢 2. Unified Responsive Main Reading Layout */}
      <section className="container-custom mt-12 mb-20 px-4 sm:px-6">
        <div className="3xl:grid-cols-[260px_1fr] flex flex-col items-start gap-10 lg:grid lg:grid-cols-[240px_1fr] xl:gap-16">

          {/* 📊 Left Sticky Sidebar: TOC -> Categories -> Tags -> Share -> Action */}
          <aside className="border-border/60 bg-card/40 lg:border-none lg:bg-transparent top-24 w-full rounded-2xl border p-4 backdrop-blur-md sm:p-6 lg:sticky lg:top-28 lg:w-[240px] xl:w-[260px] lg:self-start lg:shrink-0 lg:p-0 lg:backdrop-blur-none">
            <div className="flex flex-col space-y-6">

              {/* 1. Table of Contents */}
              {tocItems.length > 0 && (
                <div className="relative">
                  <StickyTableOfContents items={tocItems} />
                </div>
              )}

              {/* 2. Categories Widget */}
              {service.categories && service.categories.length > 0 && (
                <div className="border-border/60 border-t pt-6">
                  <CategoryWidget
                    items={service.categories}
                    label="Categories"
                    itemPattern="listRow"
                    hrefPrefix="/services?category="
                    showCount={false}
                  />
                </div>
              )}

              {/* 3. Tags Widget */}
              {service.tags && service.tags.length > 0 && (
                <div className="border-border/60 border-t pt-6">
                  <TagWidget
                    items={service.tags}
                    label="Tags"
                    itemPattern="capsulePill"
                    hrefPrefix="/services?tag="
                  />
                </div>
              )}

              {/* 4. Share Widget */}
              <div className="border-border/60 border-t pt-6">
                <ShareWidget
                  url={shareUrl}
                  title={service.title}
                  label="Share Capability"
                  variant="classic"
                  layout="vertical"
                  showLabels={true}
                  showCopy={true}
                />
              </div>

              {/* 5. Direct Action Link */}
              <div className="border-border/60 border-t pt-6">
                <Link
                  href={`/contact?service=${service.slug}`}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-bold tracking-wider uppercase shadow-xs transition-all"
                >
                  <I18n>Consult Team</I18n>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

            </div>
          </aside>

          {/* 📖 Reading Column */}
          <div className="w-full min-w-0">
            {/* Core Rich Text Content */}
            <div className="prose prose-base sm:prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-img:rounded-xl max-w-none font-medium">
              {json && Object.keys(json).length > 0 ? (
                <ContentRenderer variant="service" content={json} />
              ) : (
                <p className="text-muted-foreground leading-relaxed">{service.shortDesc}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 🟢 3. Specializations & Core Capabilities (Prisma Relation) */}
      {service.specializations && service.specializations.length > 0 && (
        <section className="bg-card/40 border-border border-y py-16 sm:py-20">
          <div className="container-custom mx-auto px-4 sm:px-6">
            <ScrollReveal className="mb-10 text-center">
              <p className="text-primary mb-2 text-xs font-bold tracking-[0.2em] uppercase">
                <I18n>Specialization Matrix</I18n>
              </p>
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                <I18n>Core Architectural Capabilities</I18n>
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {service.specializations.map((spec: any, idx: number) => (
                <ScrollReveal key={spec.id} delay={idx * 80}>
                  <div className="bg-card border-border hover:border-primary/30 flex h-full flex-col justify-between rounded-xl border p-6 shadow-2xs transition-all hover:-translate-y-0.5">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {spec.icon ? (
                          <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                            <Image
                              src={spec.icon}
                              alt={spec.title}
                              width={20}
                              height={20}
                              className="opacity-90"
                            />
                          </div>
                        ) : (
                          <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                        )}
                        <h3 className="text-foreground text-base leading-snug font-bold tracking-tight">
                          {spec.title}
                        </h3>
                      </div>
                      {spec.shortDesc && (
                        <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                          {spec.shortDesc}
                        </p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🟢 4. Core Technologies Employed (Prisma `technologies` Relation) */}
      {service.technologies && service.technologies.length > 0 ? (
        <TechnologyPreviewSection
          items={service.technologies as any}
          limit={12}
          eyebrow="Tech Engine"
          title={`Technologies & tools powering ${service.title}`}
        />
      ) : (
        <TechnologyPreviewSection
          limit={12}
          eyebrow="Tech Engine"
          title="Enterprise stacks & cloud frameworks"
        />
      )}

      {/* 🟢 5. Delivered Systems & Work (Prisma `projects` Relation) */}
      <section id="deliveries">
        {service.projects && service.projects.length > 0 ? (
          <ProjectPreviewSection
            items={service.projects as any}
            limit={4}
            eyebrow="Proven Deliveries"
            title={`Software systems built using ${service.title}`}
          />
        ) : (
          <ProjectPreviewSection
            limit={4}
            eyebrow="Proven Deliveries"
            title="Explore our portfolio of high-scale software solutions"
          />
        )}
      </section>

      {/* 🟢 6. Client Testimonials & Social Proof (Prisma `testimonials` Relation) */}
      {service.testimonials && service.testimonials.length > 0 ? (
        <TestimonialPreviewSection
          items={service.testimonials as any}
          limit={3}
          eyebrow="Client Endorsements"
          title={`What partners say about our ${service.title} services`}
        />
      ) : (
        <TestimonialPreviewSection
          limit={3}
          eyebrow="Client Trust"
          title="Endorsements on our engineering execution"
        />
      )}

      {/* 🟢 7. Relevant Industry Applications (Prisma `industries` Relation) */}
      {service.industries && service.industries.length > 0 && (
        <section className="bg-card/40 border-border border-t py-16 sm:py-20">
          <div className="container-custom mx-auto px-4 sm:px-6">
            <ScrollReveal className="mb-10 text-center">
              <p className="text-primary mb-2 text-xs font-bold tracking-[0.2em] uppercase">
                <I18n>Sector Applicability</I18n>
              </p>
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                <I18n>Industries Leveraging This Capability</I18n>
              </h2>
            </ScrollReveal>

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.industries.map((ind: any) => (
                <Link
                  key={ind.id}
                  href={`/industries/${ind.slug}`}
                  className="group bg-card border-border hover:border-primary/40 flex items-center justify-between rounded-xl border p-6 shadow-2xs transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-lg p-2">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <span className="text-foreground group-hover:text-primary text-sm font-bold transition-colors">
                      {ind.title}
                    </span>
                  </div>
                  <ArrowRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🟢 8. Frequently Asked Questions (Prisma `faqs` Relation) */}
      {faqs.length > 0 && (
        <section className="border-border border-t py-20 sm:py-24">
          <div className="container-custom mx-auto max-w-4xl px-4 sm:px-6">
            <ScrollReveal className="mb-12 text-center">
              <span className="text-primary mb-2 inline-block text-xs font-bold tracking-[0.2em] uppercase">
                <I18n>Need Clarification?</I18n>
              </span>
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                <I18n>Frequently Asked Questions</I18n>
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <FaqAccordion items={faqs} />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 🟢 9. Thought Leadership Dispatches */}
      <BlogPreviewSection
        limit={4}
        eyebrow="Architectural Dispatches"
        title="Technical articles & engineering guides"
        description="Deep dive insights and benchmarks published by our senior architecture team."
        href="/blogs"
        ctaLabel="Explore all articles"
      />

      {/* 🟢 10. Final High-Conversion Enterprise CTA */}
      <section className="container-custom mt-16 px-4 text-center sm:px-6">
        <ScrollReveal>
          <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 text-center shadow-xl sm:p-14">
            <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-4xl">
                <I18n>Ready to leverage this capability?</I18n>
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                <I18n>
                  Schedule an engineering assessment with our senior architects to discuss your
                  specific infrastructure, software, and deployment goals.
                </I18n>
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link
                  href={`/contact?service=${service.slug}`}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                >
                  <I18n>Consult an Architect</I18n>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="bg-surface-elevated border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg border px-8 py-3 text-xs font-bold tracking-wider uppercase transition-all"
                >
                  <I18n>Explore All Services</I18n>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </article>
  );
}