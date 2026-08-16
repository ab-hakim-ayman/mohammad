import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/core/server/prisma";
import { StickyTableOfContents, ImageGallery } from "@/components/content/details";
import {
  CategoryWidget,
  TagWidget,
  ShareWidget,
} from "@/shared/components";
import { ContentRenderer, extractPlainText, extractToc } from "@/components/content";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Link } from "@/shared/i18n";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import I18n from "@/shared/components/I18n";

// 🎯 Universal Ecosystem Components Integration
import { ServicePreviewSection } from "@/features/service/components/ServicePreviewSection";
import { ProjectPreviewSection } from "@/features/project/components/ProjectPreviewSection";
import { TechnologyPreviewSection } from "@/features/technology/components/TechnologyPreviewSection";
import { TestimonialPreviewSection } from "@/features/testimonial/components/TestimonialPreviewSection";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function getSpecialization(slug: string) {
  const spec = await prisma.specialization.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      status: "PUBLISHED",
    },
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
  const { slug } = await params;
  try {
    const specialization = await getSpecialization(slug);
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
      twitter: {
        card: "summary_large_image",
        title: specialization.seoTitle || specialization.title,
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
  const { slug } = await params;
  const specialization: any = await getSpecialization(slug).catch(() => notFound());

  const otherSpecializations = await prisma.specialization.findMany({
    where: { status: "PUBLISHED", id: { not: specialization.id } },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    take: 3,
  });

  const json = specialization.contentJson || {};
  const rawTocItems = extractToc(json, "specialization") || [];
  const tocItems = rawTocItems.length >= 1 ? rawTocItems : [];

  const mainImage = specialization.heroImage || specialization.cardImage;
  const uniqueImages = (specialization.galleryImages || []).filter(
    (img: string) => img !== mainImage
  );

  const shareUrl = `https://a2icoders.com/specializations/${specialization.slug || specialization.id}`;

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      {/* 🟢 1. Hero Feature Details Banner */}
      <FeatureDetailsBanner
        variant="split"
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
      />

      {/* 🟢 2. Unified Responsive Main Reading Layout */}
      {(Object.keys(json).length > 0 || specialization.shortDesc) && (
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
                {specialization.categories && specialization.categories.length > 0 && (
                  <div className="border-border/60 border-t pt-6">
                    <CategoryWidget
                      items={specialization.categories}
                      label="Categories"
                      itemPattern="listRow"
                      hrefPrefix="/specializations?category="
                      showCount={false}
                    />
                  </div>
                )}

                {/* 3. Tags Widget */}
                {specialization.tags && specialization.tags.length > 0 && (
                  <div className="border-border/60 border-t pt-6">
                    <TagWidget
                      items={specialization.tags}
                      label="Tags"
                      itemPattern="capsulePill"
                      hrefPrefix="/specializations?tag="
                    />
                  </div>
                )}

                {/* 4. Share Widget */}
                <div className="border-border/60 border-t pt-6">
                  <ShareWidget
                    url={shareUrl}
                    title={specialization.title}
                    label="Share Practice"
                    variant="classic"
                    layout="vertical"
                    showLabels={true}
                    showCopy={true}
                  />
                </div>

                {/* 5. Action Link */}
                <div className="border-border/60 border-t pt-6">
                  <Link
                    href="/contact"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-bold tracking-wider uppercase shadow-xs transition-all"
                  >
                    <I18n>Consult Practice Leads</I18n>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

              </div>
            </aside>

            {/* 📖 Reading Column */}
            <div className="w-full min-w-0">
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

      {/* 🟢 4. Related Services in this Specialization */}
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

      {/* 🟢 5. Applied Systems & Deliveries */}
      <ProjectPreviewSection
        limit={4}
        eyebrow="Applied Deliveries"
        title={`Production products built with ${specialization.title} expertise`}
      />

      {/* 🟢 6. Core Technology Engines */}
      <TechnologyPreviewSection
        limit={12}
        eyebrow="Tech Engine"
        title="Tools & frameworks supporting this specialization"
      />

      {/* 🟢 7. Social Proof & Endorsements */}
      <TestimonialPreviewSection
        limit={3}
        eyebrow="Client Trust"
        title="Partner feedback on our specialized execution"
      />

      {/* 🟢 8. Other Specialization Domains */}
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
                    href={`/specializations/${otherSpec.slug || otherSpec.id}`}
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

      {/* 🟢 9. Final High-Conversion Enterprise CTA */}
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