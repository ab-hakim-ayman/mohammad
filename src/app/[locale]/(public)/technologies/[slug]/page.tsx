import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { technologyService } from "@/features/technology/server";
import { StickyTableOfContents, BadgeList } from "@/components/content/details";
import { ContentRenderer, extractToc } from "@/components/content";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Link } from "@/shared/i18n";
import {
  ArrowUpRight,
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  FolderOpen,
  CheckCircle2,
  Sparkles,
  Award,
  Tag as TagIcon,
} from "lucide-react";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import I18n from "@/shared/components/I18n";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

// 🎯 Universal Ecosystem Components Integration
import { ProjectPreviewSection } from "@/features/project/components/ProjectPreviewSection";
import { ServicePreviewSection } from "@/features/service/components/ServicePreviewSection";
import { BlogPreviewSection } from "@/features/blog/components/BlogPreviewSection";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function getTechnology(slug: string) {
  const technology = await technologyService.getById(slug);
  if (!technology || technology.status !== "PUBLISHED") notFound();
  return technology;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const technology = await getTechnology(slug);
    const description =
      technology.shortDesc ||
      `Explore architecture patterns, frameworks, and deployment capabilities powered by ${technology.title}.`;
    return {
      title: `${technology.title} | Tech Stack & Framework`,
      description,
      openGraph: {
        title: `${technology.title} - Technology Engine`,
        description,
        images: technology.logo ? [technology.logo] : [],
      },
    };
  } catch {
    return { title: "Technology Details" };
  }
}

export default async function PublicTechnologyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const technology: any = await getTechnology(slug).catch(() => notFound());

  const isImage = technology.logo ? /^(https?:\/\/|\/)/i.test(technology.logo) : false;

  const json = technology.contentJson || {};
  const rawTocItems = extractToc(json, "TECHNOLOGY") || [];
  const tocItems = rawTocItems.length >= 2 ? rawTocItems : [];

  const shareUrl = `https://a2icoders.com/technologies/${technology.slug || technology.id}`;
  const shareTitle = encodeURIComponent(`Engineering Tech Stack: ${technology.title}`);

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      {/* 🟢 1. Hero Feature Details Banner */}
      <FeatureDetailsBanner
        variant="split"
        backHref="/technologies"
        backLabel="All Tech Stack"
        eyebrow="Core Framework & Stack"
        title={technology.title}
        description={
          technology.shortDesc ||
          `High-performance software frameworks and cloud engines leveraging ${technology.title} for production excellence.`
        }
        badges={
          technology.categories && technology.categories.length > 0
            ? technology.categories.map((c: any) => c.title)
            : ["Core Engine"]
        }
        stats={[
          { label: "Stack Tier", value: "Primary Architecture" },
          { label: "Category", value: technology.categories?.[0]?.title || "Engine" },
        ]}
        videoSrc={undefined}
        imageSrc={isImage ? technology.logo || undefined : undefined}
        imageAlt={`${technology.title} logo`}
        imagePosition="center"
      >
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
          >
            <I18n>Consult Tech Team</I18n>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </FeatureDetailsBanner>

      {/* 🟢 2. At-A-Glance Telemetry Metric Strip */}
      <section className="container-custom mx-auto mt-8 mb-16 px-4 sm:px-6">
        <ScrollReveal delay={150}>
          <div className="bg-card/60 border-border grid grid-cols-2 gap-4 rounded-xl border p-6 shadow-xs backdrop-blur-md sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Code2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Framework</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">{technology.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Cpu className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Adoption Tier</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  <I18n>Production Proven</I18n>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <FolderOpen className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Category</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  {technology.categories?.[0]?.title || "Core Tech"}
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
                  <I18n>Verified Stack</I18n>
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 🟢 3. Main Reading & Technology Documentation */}
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
                <I18n>Share Stack</I18n>
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
                  href="/contact"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-bold tracking-wider uppercase shadow-xs transition-all"
                >
                  <I18n>Consult Architects</I18n>
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

            {/* Categories & Tags Cloud */}
            {((technology.categories && technology.categories.length > 0) ||
              (technology.tags && technology.tags.length > 0)) && (
              <div className="border-border mt-12 flex flex-col gap-4 border-t pt-8">
                {technology.categories && technology.categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-muted-foreground mr-2 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase select-none">
                      <FolderOpen className="text-primary h-3.5 w-3.5" />
                      <I18n>Categories:</I18n>
                    </div>
                    <BadgeList items={technology.categories} hrefPrefix="/technologies?category=" />
                  </div>
                )}

                {technology.tags && technology.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-muted-foreground mr-2 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase select-none">
                      <TagIcon className="text-primary h-3.5 w-3.5" />
                      <I18n>Tags:</I18n>
                    </div>
                    <BadgeList items={technology.tags} hrefPrefix="/technologies?tag=" />
                  </div>
                )}
              </div>
            )}

            {/* Mobile Share Bar */}
            <div className="border-border mt-8 flex items-center justify-between border-t pt-8 lg:hidden">
              <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase select-none">
                <I18n>Share Stack:</I18n>
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

      {/* 🟢 4. Production Systems Built with This Technology */}
      <ProjectPreviewSection
        limit={4}
        eyebrow="Software Deliveries"
        title={`Systems built using ${technology.title}`}
        description="High-availability applications, microservices, and platforms deployed using this framework."
      />

      {/* 🟢 5. Service Offerings Covering This Technology */}
      <ServicePreviewSection
        limit={3}
        eyebrow="Execution Offerings"
        title={`Services powered by ${technology.title}`}
        description="Consulting, architecture review, and development services using this technology."
      />


      {/* 🟢 7. Thought Leadership Dispatches */}
      <BlogPreviewSection
        limit={4}
        eyebrow="Architectural Notes"
        title={`Technical articles & benchmarks on ${technology.title}`}
        href="/blogs"
        ctaLabel="Explore all articles"
      />


      {/* 🟢 9. Final High-Conversion Action CTA */}
      <section className="container-custom mt-16 px-4 text-center sm:px-6">
        <ScrollReveal>
          <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 text-center shadow-xl sm:p-14">
            <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-4xl">
                <I18n>Build your product with this stack</I18n>
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                <I18n>
                  Schedule an architectural review with our senior team to discuss implementing or
                  optimizing technology in your stack.
                </I18n>
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                >
                  <I18n>Consult Tech Lead</I18n>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/technologies"
                  className="bg-surface-elevated border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg border px-8 py-3 text-xs font-bold tracking-wider uppercase transition-all"
                >
                  <I18n>Explore Full Radar</I18n>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </article>
  );
}
