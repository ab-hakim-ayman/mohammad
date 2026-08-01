import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { skillService } from "@/features/skill/server";
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
import { TechnologyPreviewSection } from "@/features/technology/components/TechnologyPreviewSection";
import { BlogPreviewSection } from "@/features/blog/components/BlogPreviewSection";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

async function getSkill(id: string) {
  const skill = await skillService.getById(id);
  if (!skill || skill.status !== "PUBLISHED") notFound();
  return skill;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const skill = await getSkill(id);
    const description =
      skill.shortDesc ||
      `Explore technical capabilities, implementation patterns, and engineering standards for ${skill.title}.`;
    return {
      title: `${skill.title} | Engineering Skill Profile`,
      description,
      openGraph: {
        title: `${skill.title} - Capability Matrix`,
        description,
        images: skill.icon ? [skill.icon] : [],
      },
    };
  } catch {
    return { title: "Skill Details" };
  }
}

export default async function PublicSkillDetailPage({ params }: PageProps) {
  const { id } = await params;
  const skill: any = await getSkill(id).catch(() => notFound());

  const isImage = skill.icon ? /^(https?:\/\/|\/)/i.test(skill.icon) : false;

  const json = skill.contentJson || {};
  const rawTocItems = extractToc(json, "SKILL") || [];
  const tocItems = rawTocItems.length >= 2 ? rawTocItems : [];

  const shareUrl = `https://a2icoders.com/skills/${skill.slug || skill.id}`;
  const shareTitle = encodeURIComponent(`Engineering Capability & Skill Matrix: ${skill.title}`);

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      {/* 🟢 1. Hero Feature Details Banner */}
      <FeatureDetailsBanner
        variant="gradient-glow"
        backHref="/skills"
        backLabel="All Capabilities"
        eyebrow="Skill Profile & Matrix"
        title={skill.title}
        description={
          skill.shortDesc ||
          `Production-proven expertise, deployment architectures, and implementation patterns around ${skill.title}.`
        }
        badges={
          skill.categories && skill.categories.length > 0
            ? skill.categories.map((c: any) => c.title)
            : ["Technical Capability"]
        }
        stats={[
          { label: "Proficiency", value: "Enterprise Level" },
          { label: "Domain", value: skill.categories?.[0]?.title || "Engineering" },
        ]}
        videoSrc={undefined}
        imageSrc={isImage ? skill.icon || undefined : undefined}
        imageAlt={`${skill.title} capability icon`}
        imagePosition="center"
      >
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
          >
            <I18n>Hire Specialist Team</I18n>
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
                <Code2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Capability</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">{skill.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Award className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Mastery</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  <I18n>Production Verified</I18n>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <FolderOpen className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Domain</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  {skill.categories?.[0]?.title || "Core Tech"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-success/10 text-success rounded-lg p-2.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>SLA Status</I18n>
                </p>
                <p className="text-foreground text-xs font-bold">
                  <I18n>Active Standard</I18n>
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 🟢 3. Main Reading & Skill Architecture View */}
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
                <I18n>Share Matrix</I18n>
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
                  <I18n>Consult Expert</I18n>
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
            {((skill.categories && skill.categories.length > 0) ||
              (skill.tags && skill.tags.length > 0)) && (
              <div className="border-border mt-12 flex flex-col gap-4 border-t pt-8">
                {skill.categories && skill.categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-muted-foreground mr-2 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase select-none">
                      <FolderOpen className="text-primary h-3.5 w-3.5" />
                      <I18n>Categories:</I18n>
                    </div>
                    <BadgeList items={skill.categories} hrefPrefix="/skills?category=" />
                  </div>
                )}

                {skill.tags && skill.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-muted-foreground mr-2 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase select-none">
                      <TagIcon className="text-primary h-3.5 w-3.5" />
                      <I18n>Tags:</I18n>
                    </div>
                    <BadgeList items={skill.tags} hrefPrefix="/skills?tag=" />
                  </div>
                )}
              </div>
            )}

            {/* Mobile Share Bar */}
            <div className="border-border mt-8 flex items-center justify-between border-t pt-8 lg:hidden">
              <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase select-none">
                <I18n>Share Matrix:</I18n>
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

      {/* 🟢 4. Systems & Projects Built with This Skill */}
      <ProjectPreviewSection
        limit={4}
        eyebrow="Applied Work"
        title={`Projects engineered using ${skill.title}`}
        description="High-availability software systems, cloud architectures, and digital products deployed using this expertise."
      />

      {/* 🟢 5. Related Technology Stacks & Tools */}
      <TechnologyPreviewSection
        limit={12}
        eyebrow="Tech Ecosystem"
        title={`Technologies & tools aligned with ${skill.title}`}
      />


      {/* 🟢 7. Architectural Dispatches & Technical Guides */}
      <BlogPreviewSection
        limit={4}
        eyebrow="Engineering Insights"
        title={`Technical guides & benchmarks on ${skill.title}`}
        description="Deep dive articles, architectural guidelines, and technical dispatches."
        href="/blogs"
        ctaLabel="Explore all insights"
      />


      {/* 🟢 9. Final Action CTA */}
      <section className="container-custom mt-16 px-4 text-center sm:px-6">
        <ScrollReveal>
          <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 text-center shadow-xl sm:p-14">
            <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-4xl">
                <I18n>Need this capability for your product?</I18n>
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                <I18n>
                  Schedule an engineering assessment with our senior architects to discuss your
                  specific infrastructure, software development, and deployment goals.
                </I18n>
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                >
                  <I18n>Hire Our Engineers</I18n>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/skills"
                  className="bg-surface-elevated border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg border px-8 py-3 text-xs font-bold tracking-wider uppercase transition-all"
                >
                  <I18n>Explore All Capabilities</I18n>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </article>
  );
}
