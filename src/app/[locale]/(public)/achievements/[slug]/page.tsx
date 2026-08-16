import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  FileCheck,
  ArrowUpRight,
  Trophy,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Link } from "@/shared/i18n";
import { achievementService } from "@/features/achievement/server";
import I18n from "@/shared/components/I18n";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { ContentRenderer, extractToc, extractPlainText } from "@/components/content";
import { StickyTableOfContents } from "@/components/content/details";
import {
  CategoryWidget,
  TagWidget,
  ShareWidget,
} from "@/shared/components";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";

// 🎯 Reusable Preview Sections Integration
import { ProjectPreviewSection } from "@/features/project/components/ProjectPreviewSection";
import { TestimonialPreviewSection } from "@/features/testimonial/components/TestimonialPreviewSection";
import { TechnologyPreviewSection } from "@/features/technology/components/TechnologyPreviewSection";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

async function getAchievement(slug: string) {
  const achievement = await achievementService.getBySlug(slug).catch(() => achievementService.getById(slug));
  if (!achievement || achievement.status !== "PUBLISHED") notFound();
  return achievement;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const achievement = await getAchievement(slug);
    const plainContent = achievement.contentJson ? extractPlainText(achievement.contentJson) : "";
    const description =
      achievement.shortDesc ||
      (plainContent.length > 160 ? plainContent.substring(0, 160) + "..." : plainContent) ||
      achievement.issuer;

    return {
      title: `${achievement.title} - ${achievement.issuer}`,
      description,
      openGraph: {
        title: achievement.title,
        description,
        images:
          achievement.ogImage || achievement.heroImage || achievement.cardImage
            ? [achievement.ogImage || achievement.heroImage || achievement.cardImage || ""]
            : [],
      },
    };
  } catch {
    return { title: "Achievement Details" };
  }
}

export default async function PublicAchievementDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const achievement = await getAchievement(slug).catch(() => notFound());

  const achievedOn = achievement.achievedAt
    ? new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(achievement.achievedAt))
    : null;

  const displayDate = achievedOn || "Recognition Date";

  // Table of Contents
  const rawToc = extractToc(achievement.contentJson, "achievement") || [];
  const tocItems = rawToc.length >= 1 ? rawToc : [];

  const mainImage = achievement.heroImage || achievement.image || achievement.cardImage;
  const shareUrl = `https://a2icoders.com/achievements/${achievement.slug || achievement.id}`;

  // Fetch related achievements
  const publishedAchievementsRes = await achievementService.getPublished(4);
  const otherAchievements = (publishedAchievementsRes || [])
    .filter((a: any) => a.id !== achievement.id)
    .slice(0, 3);

  return (
    <article className="bg-background text-foreground min-h-screen pb-24">
      {/* 🟢 1. Hero Feature Banner */}
      <FeatureDetailsBanner
        variant="split"
        backHref="/achievements"
        backLabel="Achievements"
        eyebrow="Official Recognition"
        title={achievement.title}
        description={
          achievement.shortDesc ||
          `Awarded by ${achievement.issuer} for outstanding excellence and technical leadership.`
        }
        badges={[achievement.type || "AWARD"]}
        stats={[
          { label: "Issuer", value: achievement.issuer },
          { label: "Date Received", value: displayDate },
        ]}
        imageSrc={mainImage || undefined}
        imageAlt={`${achievement.title} achievement banner`}
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



              {/* 4. Share Widget */}
              <div className="border-border/60 border-t pt-6">
                <ShareWidget
                  url={shareUrl}
                  title={achievement.title}
                  label="Share Recognition"
                  variant="classic"
                  layout="vertical"
                  showLabels={true}
                  showCopy={true}
                />
              </div>

              {/* 5. Direct Verification Action */}
              {achievement.certificateUrl && (
                <div className="border-border/60 border-t pt-6">
                  <a
                    href={achievement.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-bold tracking-wider uppercase shadow-xs transition-all"
                  >
                    <I18n>Verify Credential</I18n>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}

            </div>
          </aside>

          {/* 📖 Reading Column */}
          <div className="w-full min-w-0">
            <div className="prose prose-base sm:prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary max-w-none font-medium">
              {achievement.contentJson ? (
                <ContentRenderer content={achievement.contentJson} variant="achievement" />
              ) : (
                <p className="text-foreground text-xl leading-relaxed">{achievement.shortDesc}</p>
              )}
            </div>

            {/* Official Certificate Verification Box */}
            {achievement.certificateUrl && (
              <div className="bg-card border-border mt-14 flex flex-col items-center rounded-xl border p-8 text-center shadow-sm">
                <div className="bg-primary/10 mb-5 flex h-14 w-14 items-center justify-center rounded-full">
                  <FileCheck className="text-primary h-7 w-7" />
                </div>
                <h3 className="mb-2 text-xl font-bold">
                  <I18n>Official Verification</I18n>
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md text-sm">
                  <I18n>Validate the authentic credential document issued directly by</I18n>{" "}
                  {achievement.issuer}.
                </p>
                <a
                  href={achievement.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                >
                  <I18n>View Verified Credential</I18n>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 🟢 3. Technology Engines */}
      <TechnologyPreviewSection
        limit={12}
        eyebrow="Core Stack"
        title="Technologies powering this milestone"
      />

      {/* 🟢 4. Applied Deliveries */}
      <ProjectPreviewSection
        limit={4}
        eyebrow="Proven Delivery"
        title="Projects that contributed to this award"
      />

      {/* 🟢 5. Client Endorsements */}
      <TestimonialPreviewSection
        limit={3}
        eyebrow="Endorsements"
        title="Client perspectives on our quality standards"
      />

      {/* 🟢 6. Other Recognitions Section */}
      {otherAchievements.length > 0 && (
        <section className="bg-surface-elevated/30 border-border border-t py-20 sm:py-24">
          <div className="container-custom">
            <ScrollReveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="text-primary mb-2 inline-block text-xs font-bold tracking-[0.2em] uppercase">
                  <I18n>Track Record</I18n>
                </span>
                <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                  <I18n>Other Recognitions & Honors</I18n>
                </h2>
              </div>
              <Link
                href="/achievements"
                className="text-primary hidden items-center gap-1.5 text-xs font-bold tracking-wider uppercase hover:underline sm:flex"
              >
                <I18n>View All Achievements</I18n>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </ScrollReveal>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherAchievements.map((item: any, idx: number) => (
                <ScrollReveal key={item.id} delay={idx * 100}>
                  <Link
                    href={`/achievements/${item.slug || item.id}`}
                    className="group border-border bg-card hover:border-primary/40 flex h-full flex-col overflow-hidden rounded-xl border shadow-xs transition-all duration-300 hover:-translate-y-1"
                  >
                    {item.cardImage ? (
                      <div className="border-border relative aspect-[16/10] w-full overflow-hidden border-b">
                        <Image
                          src={item.cardImage}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="bg-surface-elevated/50 border-border flex aspect-[16/10] w-full items-center justify-center border-b">
                        <Trophy className="text-muted-foreground/30 h-10 w-10" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <span className="text-primary mb-2 text-xs font-bold tracking-widest uppercase">
                        {item.type}
                      </span>
                      <h3 className="text-foreground group-hover:text-primary mb-3 line-clamp-2 text-lg font-bold transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground border-border mt-auto truncate border-t pt-4 text-xs font-medium">
                        {item.issuer}
                      </p>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🟢 7. High-Conversion Final CTA */}
      <section className="container-custom mt-20 px-4 text-center sm:px-6">
        <ScrollReveal>
          <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 text-center shadow-xl sm:p-16">
            <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-6">
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-4xl">
                <I18n>Partner with an award-winning team</I18n>
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                <I18n>
                  Our recognitions are a reflection of the high engineering standards we bring to
                  every client project. Let’s build your next digital capability together.
                </I18n>
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link
                  href="/contact"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                >
                  <I18n>Start a Project</I18n>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="bg-surface-elevated border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg border px-8 py-3.5 text-xs font-bold tracking-wider uppercase transition-all"
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