import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { blogService } from "@/features/blog/server";
import {
  StickyTableOfContents,
  ImageGallery,
} from "@/components/content/details";
import {
  CategoryWidget,
  TagWidget,
  ShareWidget,
} from "@/shared/components";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { ContentRenderer, extractToc, extractFaqJsonLd } from "@/components/content";
import { Link } from "@/shared/i18n";
import { ArrowUpRight, User } from "lucide-react";
import I18n from "@/shared/components/I18n";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";

// 🎯 Universal Ecosystem Components Integration
import { BlogPreviewSection } from "@/features/blog/components/BlogPreviewSection";
import { ServicePreviewSection } from "@/features/service/components/ServicePreviewSection";
import { TechnologyPreviewSection } from "@/features/technology/components/TechnologyPreviewSection";
import { ProjectPreviewSection } from "@/features/project/components/ProjectPreviewSection";
import { TestimonialPreviewSection } from "@/features/testimonial/components/TestimonialPreviewSection";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blog = await blogService.getPublicBySlug(slug);
    const description = blog.seoDescription || blog.excerpt || blog.title;
    return {
      title: `${blog.seoTitle || blog.title} | Insights & Architecture`,
      description,
      openGraph: {
        title: blog.seoTitle || blog.title,
        description,
        images:
          blog.heroImage || blog.cardImage || blog.ogImage
            ? [blog.heroImage || blog.cardImage || blog.ogImage || ""]
            : [],
        type: "article",
        publishedTime: blog.publishedAt?.toISOString() || blog.createdAt.toISOString(),
        modifiedTime: blog.updatedAt.toISOString(),
      },
      twitter: {
        card: "summary_large_image",
        title: blog.seoTitle || blog.title,
        description,
        images:
          blog.heroImage || blog.cardImage || blog.ogImage
            ? [blog.heroImage || blog.cardImage || blog.ogImage || ""]
            : [],
      },
    };
  } catch {
    return { title: "Article Not Found" };
  }
}

export default async function PublicBlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let blog: any;
  try {
    blog = await blogService.getPublicBySlug(slug);
  } catch {
    notFound();
  }

  const categorySlugs = (blog.categories || []).map((c: any) => c.slug);
  const tagSlugs = (blog.tags || []).map((t: any) => t.slug);

  const relatedResponse = await blogService.getRelatedBlogs(blog.id, categorySlugs, tagSlugs);
  const relatedBlogs = relatedResponse?.slice(0, 4) || [];

  const json = blog.contentJson || {};

  const profile = blog.createdBy?.profile;
  const authorName = profile?.fullName || blog.createdBy?.name || "Editorial Team";
  const authorRole = profile?.designation || profile?.headline || "Senior Systems Architect";
  const authorAvatar = profile?.avatar || blog.createdBy?.avatar || null;

  const rawTocItems = extractToc(json, "BLOG") || [];
  const tocItems = rawTocItems.length >= 1 ? rawTocItems : [];
  const extractedFaqLd = extractFaqJsonLd(json, "BLOG");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.seoTitle || blog.title,
    image: blog.heroImage || blog.cardImage ? [blog.heroImage || blog.cardImage] : [],
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt,
    author: [
      {
        "@type": "Person",
        name: authorName,
        jobTitle: authorRole,
      },
    ],
    ...(extractedFaqLd && { mainEntity: extractedFaqLd.mainEntity }),
  };

  const shareUrl = `https://a2icoders.com/blogs/${blog.slug}`;
  const publishedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 🟢 1. Hero Feature Banner (Author Removed & Zero Duplicate Data) */}
      <FeatureDetailsBanner
        variant="split"
        backHref="/blogs"
        backLabel="Blogs"
        eyebrow="Technical Dispatch"
        title={blog.title}
        description={
          blog.excerpt ||
          `Deep dive architecture notes and engineering guidelines on ${blog.title}.`
        }
        badges={(blog.categories || []).slice(0, 2).map((c: any) => c.title)}
        videoSrc={blog.heroVideoUrl || undefined}
        imageSrc={blog.heroImage || blog.cardImage || undefined}
        imageAlt={`${blog.title} cover`}
        imagePosition="center"
        stats={[
          {
            label: "Published",
            value: publishedDate,
          },
          {
            label: "Read Time",
            value: blog.readTime ? `${blog.readTime} mins` : "5 mins",
          },
        ]}
      />

      {/* 🟢 2. Main Reading Section */}
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
              {blog.categories && blog.categories.length > 0 && (
                <div className="border-border/60 border-t pt-6">
                  <CategoryWidget
                    items={blog.categories}
                    label="Categories"
                    itemPattern="listRow"
                    hrefPrefix="/blogs?category="
                    showCount={false}
                  />
                </div>
              )}

              {/* 3. Tags Widget */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="border-border/60 border-t pt-6">
                  <TagWidget
                    items={blog.tags}
                    label="Tags"
                    itemPattern="capsulePill"
                    hrefPrefix="/blogs?tag="
                  />
                </div>
              )}

              {/* 4. Share Widget */}
              <div className="border-border/60 border-t pt-6">
                <ShareWidget
                  url={shareUrl}
                  title={blog.title}
                  label="Share Insight"
                  variant="classic"
                  layout="vertical"
                  showLabels={true}
                  showCopy={true}
                />
              </div>

            </div>
          </aside>

          {/* 📖 Right Reading Column */}
          <div className="w-full min-w-0">
            {/* Core Content Renderer */}
            <div className="prose prose-base sm:prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-img:rounded-xl max-w-none font-medium">
              {json && Object.keys(json).length > 0 ? (
                <ContentRenderer variant="blog" content={json} />
              ) : (
                <p className="text-muted-foreground leading-relaxed">{blog.excerpt}</p>
              )}
            </div>

            {/* Visual Exhibits Gallery */}
            {blog.galleryImages && blog.galleryImages.length > 0 && (
              <div className="border-border mt-14 border-t pt-10">
                <h3 className="mb-6 text-xl font-bold tracking-tight">
                  <I18n>Visual Exhibits</I18n>
                </h3>
                <ImageGallery images={blog.galleryImages} />
              </div>
            )}

            {/* Technical Walkthrough Video Embed */}
            {blog.demoVideoUrl && (
              <div className="border-border mt-14 border-t pt-10">
                <h3 className="mb-6 text-xl font-bold tracking-tight">
                  <I18n>Technical Walkthrough</I18n>
                </h3>
                <div className="border-border bg-muted relative aspect-video w-full overflow-hidden rounded-xl border shadow-md">
                  <iframe
                    src={blog.demoVideoUrl.replace("watch?v=", "embed/")}
                    className="h-full w-full border-0"
                    allowFullScreen
                    title="Demo Video"
                  />
                </div>
              </div>
            )}

            {/* Author Bio Box */}
            <div className="bg-card/60 border-border hover:bg-card shadow-xs mt-12 rounded-xl border p-6 transition-colors sm:p-8">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
                {authorAvatar ? (
                  <Image
                    src={authorAvatar}
                    alt={authorName}
                    width={72}
                    height={72}
                    className="bg-muted border-border shadow-xs h-16 w-16 shrink-0 rounded-full border object-cover sm:h-18 sm:w-18"
                  />
                ) : (
                  <div className="bg-primary/10 text-primary shadow-xs flex h-14 w-14 shrink-0 items-center justify-center rounded-full sm:h-16 sm:w-16">
                    <User className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                )}
                <div>
                  <p className="text-primary mb-1 text-xs font-bold tracking-widest uppercase">
                    <I18n>Written By</I18n>
                  </p>
                  <h3 className="text-foreground mb-1 text-lg font-bold">{authorName}</h3>
                  <p className="text-muted-foreground mb-2.5 text-xs font-semibold">{authorRole}</p>
                  {profile?.headline && (
                    <p className="text-muted-foreground max-w-lg text-xs leading-relaxed">
                      {profile.headline}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🟢 3. Technology Stack Ecosystem */}
      <TechnologyPreviewSection
        limit={12}
        eyebrow="Tech Ecosystem"
        title="Technologies & tools highlighted in this insight"
      />

      {/* 🟢 4. Related Execution Offerings */}
      <ServicePreviewSection
        limit={3}
        eyebrow="Execution Offerings"
        title="Explore services related to this topic"
        description="Our engineering teams help bring these architectural principles to production."
      />

      {/* 🟢 5. Applied Projects & Case Studies */}
      <ProjectPreviewSection
        limit={3}
        eyebrow="Applied Work"
        title="Real-world implementations of these concepts"
      />

      {/* 🟢 6. Social Proof & Endorsements */}
      <TestimonialPreviewSection
        limit={3}
        eyebrow="Social Proof"
        title="What partners say about our architectural rigor"
      />

      {/* 🟢 7. Related Insights */}
      {relatedBlogs.length > 0 && (
        <BlogPreviewSection
          items={relatedBlogs}
          limit={4}
          eyebrow="Keep Reading"
          title="Related technical insights & posts"
          description="Explore complementary engineering guides, architecture patterns, and benchmarks."
          href="/blogs"
          ctaLabel="View all articles"
        />
      )}

      {/* 🟢 8. Final High-Conversion CTA */}
      <section className="container-custom mt-16 px-4 text-center sm:px-6">
        <ScrollReveal>
          <div className="bg-card border-border shadow-xl relative overflow-hidden rounded-2xl border p-10 text-center sm:p-14">
            <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                <I18n>Need help implementing this architecture?</I18n>
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                <I18n>
                  Connect directly with our senior cloud architects and software engineers to review
                  your infrastructure setup.
                </I18n>
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-7 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                >
                  <I18n>Talk to an Architect</I18n>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </article>
  );
}