import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { galleryService } from "@/features/gallery/server";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { ContentRenderer, extractToc } from "@/components/content";
import { StickyTableOfContents } from "@/components/content/details";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import { GalleryCinemaViewer } from "@/features/gallery";
import { Link } from "@/shared/i18n";
import { Suspense } from "react";
import {
  ArrowUpRight,
  Image as ImageIcon,
  Layers,
  CheckCircle2,
  Eye,
  Sparkles,
} from "lucide-react";
import I18n from "@/shared/components/I18n";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

// 🎯 Universal Ecosystem Components Integration
import { ProjectPreviewSection } from "@/features/project/components/ProjectPreviewSection";
import { ServicePreviewSection } from "@/features/service/components/ServicePreviewSection";
import { TechnologyPreviewSection } from "@/features/technology/components/TechnologyPreviewSection";
import { TestimonialPreviewSection } from "@/features/testimonial/components/TestimonialPreviewSection";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const gallery = await galleryService.getBySlug(slug);
    return {
      title: `${gallery.title} | Visual Gallery`,
      description: gallery.shortDesc || `Explore the curated ${gallery.title} media collection.`,
      openGraph: {
        title: `${gallery.title} - Visual Collection`,
        description: gallery.shortDesc || `Explore the curated ${gallery.title} media collection.`,
        images:
          gallery.coverImage || gallery.ogImage
            ? [gallery.coverImage || gallery.ogImage || ""]
            : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: gallery.title,
        description: gallery.shortDesc || `Explore the curated ${gallery.title} media collection.`,
        images:
          gallery.coverImage || gallery.ogImage
            ? [gallery.coverImage || gallery.ogImage || ""]
            : [],
      },
    };
  } catch {
    return { title: "Gallery Not Found" };
  }
}

export default async function GalleryDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let gallery: any;
  try {
    gallery = await galleryService.getBySlug(slug);
  } catch {
    notFound();
  }

  const items = gallery?.items || [];
  const itemCount = items.length;
  const json = gallery.contentJson || {};
  const toc = extractToc(json, "gallery") || [];
  const showToc = toc.length >= 2;
  const shareUrl = `https://a2icoders.com/galleries/${gallery.slug}`;
  const shareTitle = encodeURIComponent(gallery.title);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: gallery.title,
    description: gallery.shortDesc || `${gallery.title} collection`,
    image: gallery.coverImage ? [gallery.coverImage] : [],
  };

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 🟢 1. Hero Feature Banner */}
      <FeatureDetailsBanner
        variant="gradient-glow"
        backHref="/galleries"
        backLabel="All Collections"
        eyebrow="Visual Portfolio"
        title={gallery.title}
        description={
          gallery.shortDesc ||
          `Curated media exhibits and visual documentation for ${gallery.title}.`
        }
        badges={[`${itemCount} Media Assets`, "Curated Archives"]}
        stats={[
          { label: "Assets", value: `${itemCount} Items` },
          { label: "Format", value: "Cinema View" },
        ]}
        videoSrc={undefined}
        imageSrc={gallery.coverImage || undefined}
        imageAlt={`${gallery.title} gallery cover`}
        imagePosition="center"
      />

      {/* 🟢 2. At-A-Glance Asset Telemetry Strip */}
      <section className="container-custom mx-auto mt-8 mb-16 px-4 sm:px-6">
        <ScrollReveal delay={150}>
          <div className="bg-card/60 border-border grid grid-cols-2 gap-4 rounded-xl border p-6 shadow-xs backdrop-blur-md sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <ImageIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Total Assets</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  {itemCount} <I18n>Files</I18n>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Layers className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Category</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  <I18n>Media Showcase</I18n>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Eye className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Presentation</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  <I18n>Interactive Cinema</I18n>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-success/10 text-success rounded-lg p-2.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Status</I18n>
                </p>
                <p className="text-foreground text-xs font-bold">
                  <I18n>Verified Gallery</I18n>
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 🟢 3. Main Reading & Editorial Content */}
      {Object.keys(json).length > 0 && (
        <section className="container-custom mb-20 px-4 sm:px-6">
          <div className="3xl:grid-cols-[260px_1fr] grid items-start gap-12 lg:grid-cols-[240px_1fr] xl:gap-16">
            {/* Sticky Sidebar */}
            <aside className="sticky top-28 hidden space-y-10 self-start lg:block">
              {showToc && (
                <div className="border-border border-l-2 pl-4">
                  <p className="text-muted-foreground mb-4 text-xs font-black tracking-widest uppercase select-none">
                    <I18n>Contents</I18n>
                  </p>
                  <StickyTableOfContents items={toc} />
                </div>
              )}

              <div className="border-border border-l-2 pl-4">
                <p className="text-muted-foreground mb-4 text-xs font-black tracking-widest uppercase select-none">
                  <I18n>Share Collection</I18n>
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
              {showToc && (
                <div className="border-border mb-8 border-l-2 pl-4 lg:hidden">
                  <p className="text-muted-foreground mb-3 text-xs font-black tracking-widest uppercase select-none">
                    <I18n>Contents</I18n>
                  </p>
                  <StickyTableOfContents items={toc} />
                </div>
              )}

              <div className="prose prose-base sm:prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-img:rounded-xl max-w-none font-medium">
                <ContentRenderer variant="gallery" content={json} />
              </div>

              {/* Mobile Share Bar */}
              <div className="border-border mt-8 flex items-center justify-between border-t pt-8 lg:hidden">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase select-none">
                  <I18n>Share Collection:</I18n>
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

      {/* 🟢 4. Cinema Viewer Component */}
      <section className="container-custom mx-auto mb-20 px-4 sm:px-6">
        <ScrollReveal>
          <Suspense
            fallback={
              <div className="bg-card border-border h-64 w-full animate-pulse rounded-xl border" />
            }
          >
            <GalleryCinemaViewer
              items={items}
              coverImage={gallery.coverImage}
              hasContent={Object.keys(json).length > 0}
            />
          </Suspense>
        </ScrollReveal>
      </section>

      {/* 🟢 5. Related Projects & Work */}
      <ProjectPreviewSection
        limit={3}
        eyebrow="Portfolio Systems"
        title="Projects linked to this visual showcase"
      />

      {/* 🟢 6. Capabilities & Services */}
      <ServicePreviewSection
        limit={3}
        eyebrow="Creative Capabilities"
        title="Services powering our digital deliveries"
      />

      {/* 🟢 7. Core Tools & Stack */}
      <TechnologyPreviewSection
        limit={12}
        eyebrow="Design & Tech Stack"
        title="Tools leveraged to craft these assets"
      />

      {/* 🟢 8. Social Proof & Endorsements */}
      <TestimonialPreviewSection
        limit={3}
        eyebrow="Client Trust"
        title="Feedback on our design & engineering craftsmanship"
      />

      {/* 🟢 9. High-Conversion Final CTA */}
      <section className="container-custom mt-16 px-4 text-center sm:px-6">
        <ScrollReveal>
          <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 text-center shadow-xl sm:p-14">
            <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-4xl">
                <I18n>Bring Your Vision to Life</I18n>
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                <I18n>
                  Inspired by our work? Let&apos;s discuss how we can engineer the next software
                  breakthrough or visual brand for your business.
                </I18n>
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                >
                  <I18n>Start a Conversation</I18n>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/galleries"
                  className="bg-surface-elevated border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg border px-8 py-3 text-xs font-bold tracking-wider uppercase transition-all"
                >
                  <I18n>Explore More Galleries</I18n>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </article>
  );
}
