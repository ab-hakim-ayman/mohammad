import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { serviceService } from "@/features/service/server";
import { StickyTableOfContents, FaqAccordion, BadgeList } from "@/components/content/details";
import { ContentRenderer, extractToc } from "@/components/content";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Link } from "@/shared/i18n";
import {
  ArrowUpRight,
  ArrowRight,
  Code2,
  Briefcase,
  FolderOpen,
  CheckCircle2,
  Layers,
  Sparkles,
  Tag as TagIcon,
} from "lucide-react";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import I18n from "@/shared/components/I18n";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

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
  const tocItems = rawTocItems.length >= 2 ? rawTocItems : [];

  const shareUrl = `https://a2icoders.com/services/${service.slug}`;
  const shareTitle = encodeURIComponent(service.title);

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
        variant="gradient-glow"
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
      >
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href={`/contact?service=${service.slug}`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
          >
            <I18n>Discuss Requirements</I18n>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          {service.projects && service.projects.length > 0 && (
            <a
              href="#deliveries"
              className="bg-surface-elevated/80 border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-xs font-bold tracking-wider uppercase transition-all"
            >
              <I18n>Explore Deliveries</I18n>
              <ArrowRight className="text-primary h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </FeatureDetailsBanner>

      {/* 🟢 2. At-A-Glance Corporate Telemetry Strip */}
      <section className="container-custom mx-auto mt-8 mb-16 px-4 sm:px-6">
        <ScrollReveal delay={150}>
          <div className="bg-card/60 border-border grid grid-cols-2 gap-4 rounded-xl border p-6 shadow-xs backdrop-blur-md sm:grid-cols-4 lg:grid-cols-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Layers className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Practice</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">{service.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Modules</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  {service.specializations?.length || 0} <I18n>Capabilities</I18n>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Briefcase className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Projects</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  {service._count?.projects || 0} <I18n>Delivered</I18n>
                </p>
              </div>
            </div>

            {service.technologies && service.technologies.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                  <Code2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                    <I18n>Tech Stack</I18n>
                  </p>
                  <p className="text-foreground truncate text-xs font-bold">
                    {service.technologies
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
                  <I18n>SLA</I18n>
                </p>
                <p className="text-foreground text-xs font-bold">
                  <I18n>Production Ready</I18n>
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 🟢 3. Main Reading & Service Specification Area */}
      <section className="container-custom mb-20 px-4 sm:px-6">
        <div className="3xl:grid-cols-[260px_1fr] grid items-start gap-12 lg:grid-cols-[240px_1fr] xl:gap-16">
          {/* Sticky Sidebar */}
          <aside className="sticky top-28 hidden space-y-10 self-start lg:block">
            {tocItems.length > 0 && (
              <div className="border-border border-l-2 pl-4">
                <p className="text-muted-foreground mb-4 text-xs font-black tracking-widest uppercase select-none">
                  <I18n>On This Page</I18n>
                </p>
                <StickyTableOfContents items={tocItems} />
              </div>
            )}

            <div className="border-border space-y-4 border-l-2 pl-4">
              <p className="text-muted-foreground mb-3 text-xs font-black tracking-widest uppercase select-none">
                <I18n>Share Capability</I18n>
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

              <div className="border-border border-t pt-4">
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

            {/* Core Rich Text Content */}
            <div className="prose prose-base sm:prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-img:rounded-xl max-w-none font-medium">
              {json && Object.keys(json).length > 0 ? (
                <ContentRenderer variant="service" content={json} />
              ) : (
                <p className="text-muted-foreground leading-relaxed">{service.shortDesc}</p>
              )}
            </div>

            {/* Categories & Tags Cloud */}
            {((service.categories && service.categories.length > 0) ||
              (service.tags && service.tags.length > 0)) && (
              <div className="border-border mt-12 flex flex-col gap-4 border-t pt-8">
                {service.categories && service.categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-muted-foreground mr-2 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase select-none">
                      <FolderOpen className="text-primary h-3.5 w-3.5" />
                      <I18n>Categories:</I18n>
                    </div>
                    <BadgeList items={service.categories} hrefPrefix="/services?category=" />
                  </div>
                )}

                {service.tags && service.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-muted-foreground mr-2 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase select-none">
                      <TagIcon className="text-primary h-3.5 w-3.5" />
                      <I18n>Tags:</I18n>
                    </div>
                    <BadgeList items={service.tags} hrefPrefix="/services?tag=" />
                  </div>
                )}
              </div>
            )}

            {/* Mobile Share Bar */}
            <div className="border-border mt-8 flex items-center justify-between border-t pt-8 lg:hidden">
              <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase select-none">
                <I18n>Share Capability:</I18n>
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

      {/* 🟢 4. Specializations & Core Capabilities (Prisma Relation) */}
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

      {/* 🟢 5. Core Technologies Employed (Prisma `technologies` Relation) */}
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

      {/* 🟢 6. Delivered Systems & Work (Prisma `projects` Relation) */}
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


      {/* 🟢 8. Client Testimonials & Social Proof (Prisma `testimonials` Relation) */}
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

      {/* 🟢 9. Relevant Industry Applications (Prisma `industries` Relation) */}
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

      {/* 🟢 10. Frequently Asked Questions (Prisma `faqs` Relation) */}
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

      {/* 🟢 11. Thought Leadership Dispatches */}
      <BlogPreviewSection
        limit={4}
        eyebrow="Architectural Dispatches"
        title="Technical articles & engineering guides"
        description="Deep dive insights and benchmarks published by our senior architecture team."
        href="/blogs"
        ctaLabel="Explore all articles"
      />

      {/* 🟢 12. Final High-Conversion Enterprise CTA */}
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
