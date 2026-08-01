import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/shared/i18n";
import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  CheckCircle2,
  Sparkles,
  Code2,
  Briefcase,
  Building2,
} from "lucide-react";
import prisma from "@/core/server/prisma";
import { StickyTableOfContents, ImageGallery } from "@/components/content/details";
import { ContentRenderer, extractPlainText, extractToc } from "@/components/content";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import I18n from "@/shared/components/I18n";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

// 🎯 Universal Ecosystem Components Integration
import { ServicePreviewSection } from "@/features/service/components/ServicePreviewSection";
import { ProjectPreviewSection } from "@/features/project/components/ProjectPreviewSection";
import { TechnologyPreviewSection } from "@/features/technology/components/TechnologyPreviewSection";
import { TestimonialPreviewSection } from "@/features/testimonial/components/TestimonialPreviewSection";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

async function getSpecialization(id: string) {
  const spec = await prisma.specialization.findFirst({
    where: { id, status: "PUBLISHED" },
    include: {
      services: {
        where: { status: "PUBLISHED" },
      },
    },
  });
  if (!spec) notFound();
  return spec;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const specialization = await getSpecialization(id);
    const description =
      specialization.seoDescription ||
      specialization.shortDesc ||
      extractPlainText(specialization.contentJson) ||
      specialization.title;

    return {
      title: specialization.seoTitle || `${specialization.title} | Specialization Practice`,
      description,
      openGraph: {
        title: specialization.seoTitle || `${specialization.title} - Domain Practice`,
        description,
        images:
          specialization.ogImage || specialization.heroImage || specialization.cardImage
            ? [specialization.ogImage || specialization.heroImage || specialization.cardImage || ""]
            : [],
      },
    };
  } catch {
    return { title: "Specialization Not Found" };
  }
}

export default async function PublicSpecializationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const specialization: any = await getSpecialization(id).catch(() => notFound());

  const otherSpecializations = await prisma.specialization.findMany({
    where: { status: "PUBLISHED", id: { not: specialization.id } },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    take: 3,
  });

  const json = specialization.contentJson || {};
  const rawTocItems = extractToc(json, "specialization") || [];
  const tocItems = rawTocItems.length >= 2 ? rawTocItems : [];

  const mainImage = specialization.heroImage || specialization.cardImage;
  const uniqueImages = (specialization.galleryImages || []).filter(
    (img: string) => img !== mainImage
  );

  const shareUrl = `https://a2icoders.com/specializations/${specialization.id}`;
  const shareTitle = encodeURIComponent(specialization.title);

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      {/* 🟢 1. Hero Feature Details Banner */}
      <FeatureDetailsBanner
        variant="gradient-glow"
        backHref="/specializations"
        backLabel="All Practices"
        eyebrow={specialization.isFeatured ? "Featured Expertise" : "Domain Practice"}
        title={specialization.title}
        description={
          specialization.shortDesc ||
          `Deep architectural capabilities and engineering solutions in ${specialization.title}.`
        }
        badges={[
          specialization.isFeatured ? "Core Specialty" : "Specialized Practice",
          "Enterprise Level",
        ]}
        stats={[
          { label: "Active Services", value: `${specialization.services?.length || 0} Offerings` },
          { label: "Domain Tier", value: "Enterprise" },
        ]}
        videoSrc={specialization.heroVideoUrl || undefined}
        imageSrc={mainImage || undefined}
        imageAlt={`${specialization.title} specialization banner`}
        imagePosition="center"
      >
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
          >
            <I18n>Consult Practice Leads</I18n>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </FeatureDetailsBanner>

      {/* 🟢 2. At-A-Glance Corporate Telemetry Strip */}
      <section className="container-custom mx-auto mt-8 mb-16 px-4 sm:px-6">
        <ScrollReveal delay={150}>
          <div className="bg-card/60 border-border grid grid-cols-2 gap-4 rounded-xl border p-6 shadow-xs backdrop-blur-md sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Specialization</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">{specialization.title}</p>
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
                  {specialization.services?.length || 0} <I18n>Modules</I18n>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Practice Focus</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  <I18n>Deep Architecture</I18n>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-success/10 text-success rounded-lg p-2.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Verification</I18n>
                </p>
                <p className="text-foreground text-xs font-bold">
                  <I18n>Production Verified</I18n>
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 🟢 3. Main Reading & Architectural Domain Overview */}
      {(Object.keys(json).length > 0 || specialization.shortDesc) && (
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
                {Object.keys(json).length > 0 ? (
                  <ContentRenderer variant="specialization" content={json} />
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {specialization.shortDesc}
                  </p>
                )}
              </div>

              {/* Demo Video Embed */}
              {specialization.demoVideoUrl && (
                <div className="border-border mt-14 border-t pt-10">
                  <h3 className="mb-6 text-xl font-bold tracking-tight">
                    <I18n>Practice Demonstration</I18n>
                  </h3>
                  <div className="border-border bg-muted relative aspect-video w-full overflow-hidden rounded-xl border shadow-md">
                    <iframe
                      src={specialization.demoVideoUrl.replace("watch?v=", "embed/")}
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
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&text=${shareTitle}`}
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
                <I18n>Interface & Architecture</I18n>
              </p>
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                <I18n>Specialization Exhibits</I18n>
              </h2>
            </ScrollReveal>
            <ImageGallery images={uniqueImages} />
          </div>
        </section>
      )}

      {/* 🟢 5. Related Services in this Specialization (Prisma Relation) */}
      {specialization.services && specialization.services.length > 0 ? (
        <ServicePreviewSection
          items={specialization.services as any}
          limit={6}
          eyebrow="Specialized Offerings"
          title={`Services engineered under ${specialization.title}`}
          description={`Modular capabilities and engineering services tailored specifically around ${specialization.title}.`}
        />
      ) : (
        <ServicePreviewSection
          limit={4}
          eyebrow="Core Services"
          title="Enterprise capabilities behind our engineering practice"
        />
      )}

      {/* 🟢 6. Applied Systems & Deliveries */}
      <ProjectPreviewSection
        limit={4}
        eyebrow="Applied Deliveries"
        title={`Production products built with ${specialization.title} expertise`}
      />

      {/* 🟢 7. Core Technology Engines */}
      <TechnologyPreviewSection
        limit={12}
        eyebrow="Tech Engine"
        title="Tools & frameworks supporting this specialization"
      />


      {/* 🟢 9. Social Proof & Endorsements */}
      <TestimonialPreviewSection
        limit={3}
        eyebrow="Client Trust"
        title="Partner feedback on our specialized execution"
      />


      {/* 🟢 11. Other Specialization Domains */}
      {otherSpecializations.length > 0 && (
        <section className="bg-card/40 border-border border-t py-16 sm:py-20">
          <div className="container-custom mx-auto px-4 sm:px-6">
            <ScrollReveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-primary mb-2 text-xs font-bold tracking-[0.2em] uppercase">
                  <I18n>Complementary Focus</I18n>
                </p>
                <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                  <I18n>Explore Other Specialization Domains</I18n>
                </h2>
              </div>
              <Link
                href="/specializations"
                className="text-primary hover:text-primary/80 hidden items-center gap-2 text-xs font-bold tracking-wider uppercase transition-colors sm:flex"
              >
                <I18n>View All Practices</I18n>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherSpecializations.map((otherSpec: any, idx: number) => (
                <ScrollReveal key={otherSpec.id} delay={idx * 100}>
                  <Link
                    href={`/specializations/${otherSpec.id}`}
                    className="group border-border bg-card hover:bg-card/80 hover:border-primary/30 flex h-full flex-col justify-between overflow-hidden rounded-xl border p-8 shadow-2xs transition-all hover:-translate-y-0.5"
                  >
                    <div className="space-y-3">
                      <div className="text-primary flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>
                          <I18n>Specialization</I18n>
                        </span>
                      </div>
                      <h3 className="text-foreground group-hover:text-primary text-lg font-bold tracking-tight transition-colors">
                        {otherSpec.title}
                      </h3>
                      {otherSpec.shortDesc && (
                        <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed font-medium">
                          {otherSpec.shortDesc}
                        </p>
                      )}
                    </div>
                    <div className="border-border text-primary mt-6 flex items-center justify-between border-t pt-4 text-xs font-bold tracking-wider uppercase">
                      <span>
                        <I18n>Explore Practice</I18n>
                      </span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🟢 12. Final High-Conversion Enterprise CTA */}
      <section className="container-custom mt-16 px-4 text-center sm:px-6">
        <ScrollReveal>
          <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 text-center shadow-xl sm:p-14">
            <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-4xl">
                <I18n>Need specialized domain engineering?</I18n>
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                <I18n>
                  Schedule an architectural consultation with our senior domain practice leads to
                  discuss your project requirements and infrastructure setup.
                </I18n>
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                >
                  <I18n>Schedule Domain Consultation</I18n>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/specializations"
                  className="bg-surface-elevated border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg border px-8 py-3 text-xs font-bold tracking-wider uppercase transition-all"
                >
                  <I18n>Explore All Practices</I18n>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </article>
  );
}
