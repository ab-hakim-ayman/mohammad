import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { blogService } from "@/features/blog/server";
import { StickyTableOfContents, BadgeList, ImageGallery } from "@/components/content/details";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { ContentRenderer, extractToc, extractFaqJsonLd } from "@/components/content";
import { Link } from "@/shared/i18n";
import { ArrowUpRight, Calendar, Clock, User, Share2, Tag, BookOpen, Layers, Sparkles } from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

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
        images: blog.heroImage || blog.cardImage || blog.ogImage ? [blog.heroImage || blog.cardImage || blog.ogImage || ""] : [],
        type: "article",
        publishedTime: blog.publishedAt?.toISOString() || blog.createdAt.toISOString(),
        modifiedTime: blog.updatedAt.toISOString(),
      },
      twitter: {
        card: "summary_large_image",
        title: blog.seoTitle || blog.title,
        description,
        images: blog.heroImage || blog.cardImage || blog.ogImage ? [blog.heroImage || blog.cardImage || blog.ogImage || ""] : [],
      },
    };
  } catch {
    return { title: "Article Not Found" };
  }
}

export default async function PublicBlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let blog;
  try {
    blog = await blogService.getPublicBySlug(slug);
  } catch {
    notFound();
  }

  const categorySlugs = blog.categories.map((c: any) => c.slug);
  const tagSlugs = blog.tags.map((t: any) => t.slug);

  // Fetch Related Blogs
  const relatedResponse = await blogService.getRelatedBlogs(blog.id, categorySlugs, tagSlugs);
  const relatedBlogs = relatedResponse?.slice(0, 4) || [];

  const json = blog.contentJson || {};

  const profile = blog.createdBy?.profile;
  const authorName = profile?.fullName || blog.createdBy?.name || "Editorial Team";
  const authorRole = profile?.designation || profile?.headline || "Senior Systems Architect";
  const authorAvatar = profile?.avatar || blog.createdBy?.avatar || null;

  const rawTocItems = extractToc(json, "BLOG") || [];
  const tocItems = rawTocItems.length >= 2 ? rawTocItems : [];
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
  const shareTitle = encodeURIComponent(blog.title);

  const publishedDate = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 🟢 1. Hero Feature Banner */}
      <FeatureDetailsBanner
        variant="gradient-glow"
        backHref="/blogs"
        backLabel="Insights"
        eyebrow="Technical Dispatch"
        title={blog.title}
        description={blog.excerpt || `Deep dive architecture notes and engineering guidelines on ${blog.title}.`}
        badges={[
          ...blog.categories.slice(0, 2).map((c: any) => c.title),
          ...(blog.readTime ? [`${blog.readTime} min read`] : [])
        ]}
        videoSrc={blog.heroVideoUrl || undefined}
        imageSrc={blog.heroImage || blog.cardImage || undefined}
        imageAlt={`${blog.title} cover`}
        imagePosition="center"
        stats={[
          {
            label: "Published",
            value: publishedDate
          },
          {
            label: "Read Time",
            value: blog.readTime ? `${blog.readTime} mins` : "5 mins"
          }
        ]}
      >
        <div className="flex items-center gap-3 pt-3 border-t border-white/10 mt-2">
          {authorAvatar ? (
            <Image
              src={authorAvatar}
              alt={authorName}
              width={36}
              height={36}
              className="bg-muted border border-white/20 shadow-xs rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="bg-white/10 text-white flex h-9 w-9 items-center justify-center rounded-full shadow-xs">
              <User className="h-4 w-4" />
            </div>
          )}
          <div className="text-left">
            <p className="text-white text-xs font-bold leading-none">{authorName}</p>
            <p className="text-white/70 mt-1 text-xs font-medium">{authorRole}</p>
          </div>
        </div>
      </FeatureDetailsBanner>

      {/* 🟢 2. At-A-Glance Meta Bar */}
      <section className="container-custom mx-auto mb-16 mt-8 px-4 sm:px-6">
        <ScrollReveal delay={150}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-card/60 border border-border backdrop-blur-md rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase"><I18n>Date</I18n></p>
                <p className="text-foreground text-xs font-bold truncate">{publishedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                <Clock className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase"><I18n>Est. Read</I18n></p>
                <p className="text-foreground text-xs font-bold">{blog.readTime || 5} <I18n>mins</I18n></p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                <Layers className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase"><I18n>Category</I18n></p>
                <p className="text-foreground text-xs font-bold truncate">
                  {blog.categories[0]?.title || "Engineering"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase"><I18n>Level</I18n></p>
                <p className="text-foreground text-xs font-bold"><I18n>Technical</I18n></p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 🟢 3. Main Reading Area (Two-Column Layout) */}
      <section className="container-custom px-4 sm:px-6 mb-20">
        <div className="grid items-start gap-12 lg:grid-cols-[240px_1fr] xl:gap-16 3xl:grid-cols-[260px_1fr]">

          {/* 📊 Left Sticky Rail (TOC & Share) */}
          <aside className="hidden lg:block sticky top-28 self-start space-y-10">
            {tocItems.length > 0 && (
              <div className="border-l-2 border-border pl-4">
                <p className="text-muted-foreground mb-4 text-xs font-black tracking-widest uppercase select-none">
                  <I18n>On This Page</I18n>
                </p>
                <StickyTableOfContents items={tocItems} />
              </div>
            )}

            <div className="border-l-2 border-border pl-4">
              <p className="text-muted-foreground mb-4 text-xs font-black tracking-widest uppercase select-none">
                <I18n>Share Insight</I18n>
              </p>
              <div className="flex flex-col gap-2.5">
                <a
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-xs font-semibold"
                >
                  <div className="bg-surface-elevated w-8 h-8 rounded-full flex items-center justify-center border border-border"><FaTwitter className="w-3.5 h-3.5" /></div>
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-xs font-semibold"
                >
                  <div className="bg-surface-elevated w-8 h-8 rounded-full flex items-center justify-center border border-border"><FaLinkedin className="w-3.5 h-3.5" /></div>
                  LinkedIn
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-xs font-semibold"
                >
                  <div className="bg-surface-elevated w-8 h-8 rounded-full flex items-center justify-center border border-border"><FaFacebook className="w-3.5 h-3.5" /></div>
                  Facebook
                </a>
              </div>
            </div>
          </aside>

          {/* Reading Column */}
          <div className="w-full min-w-0">
            {/* Mobile TOC */}
            {tocItems.length > 0 && (
              <div className="mb-8 lg:hidden border-l-2 border-border pl-4">
                <p className="text-muted-foreground mb-3 text-xs font-black tracking-widest uppercase select-none">
                  <I18n>On This Page</I18n>
                </p>
                <StickyTableOfContents items={tocItems} />
              </div>
            )}

            {/* Content Renderer */}
            <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none font-medium prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-img:rounded-xl">
              {json && Object.keys(json).length > 0 && (
                <ContentRenderer variant="blog" content={json} />
              )}
            </div>

            {/* Gallery Images */}
            {blog.galleryImages && blog.galleryImages.length > 0 && (
              <div className="mt-14 pt-10 border-t border-border">
                <h3 className="text-xl font-bold tracking-tight mb-6"><I18n>Visual Exhibits</I18n></h3>
                <ImageGallery images={blog.galleryImages} />
              </div>
            )}

            {/* Demo Video Embed */}
            {blog.demoVideoUrl && (
              <div className="mt-14 pt-10 border-t border-border">
                <h3 className="text-xl font-bold tracking-tight mb-6"><I18n>Technical Walkthrough</I18n></h3>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-md border border-border bg-muted">
                  <iframe
                    src={blog.demoVideoUrl.replace("watch?v=", "embed/")}
                    className="w-full h-full border-0"
                    allowFullScreen
                    title="Demo Video"
                  />
                </div>
              </div>
            )}

            {/* Categories & Tags Cloud (Prisma Category & Tag Model) */}
            {(blog.categories.length > 0 || blog.tags.length > 0) && (
              <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8">
                {blog.categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold tracking-wider uppercase select-none mr-2">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      <I18n>Categories:</I18n>
                    </div>
                    <BadgeList items={blog.categories} hrefPrefix="/blogs?category=" />
                  </div>
                )}

                {blog.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-bold tracking-wider uppercase select-none mr-2">
                      <Tag className="h-3.5 w-3.5 text-primary" />
                      <I18n>Topics:</I18n>
                    </div>
                    <BadgeList items={blog.tags} hrefPrefix="/blogs?tag=" />
                  </div>
                )}
              </div>
            )}

            {/* Mobile Share Bar */}
            <div className="mt-8 pt-8 border-t border-border flex lg:hidden items-center justify-between">
              <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase select-none flex items-center gap-2">
                <Share2 className="h-3.5 w-3.5" />
                <I18n>Share Insight:</I18n>
              </span>
              <div className="flex items-center gap-2.5">
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="bg-surface-elevated w-9 h-9 rounded-full flex items-center justify-center border border-border text-foreground hover:text-primary transition-all"><FaTwitter className="w-3.5 h-3.5" /></a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="bg-surface-elevated w-9 h-9 rounded-full flex items-center justify-center border border-border text-foreground hover:text-primary transition-all"><FaLinkedin className="w-3.5 h-3.5" /></a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="bg-surface-elevated w-9 h-9 rounded-full flex items-center justify-center border border-border text-foreground hover:text-primary transition-all"><FaFacebook className="w-3.5 h-3.5" /></a>
              </div>
            </div>

            {/* Author Bio Box */}
            <div className="mt-12 bg-card/60 border border-border shadow-xs rounded-xl p-6 sm:p-8 transition-colors hover:bg-card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {authorAvatar ? (
                  <Image
                    src={authorAvatar}
                    alt={authorName}
                    width={72}
                    height={72}
                    className="bg-muted border border-border shadow-xs rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="bg-primary/10 text-primary flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-xs">
                    <User className="h-7 w-7" />
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1"><I18n>Written By</I18n></p>
                  <h3 className="text-foreground text-lg font-bold mb-1">{authorName}</h3>
                  <p className="text-muted-foreground text-xs font-semibold mb-2.5">{authorRole}</p>
                  {profile?.headline && (
                    <p className="text-muted-foreground text-xs leading-relaxed max-w-lg">{profile.headline}</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 🟢 5. Technology Stack Ecosystem (Prisma Technology Model) */}
      <TechnologyPreviewSection
        limit={12}
        eyebrow="Tech Ecosystem"
        title="Technologies & tools highlighted in this insight"
      />

      {/* 🟢 6. Related Execution Offerings (Prisma Service Model) */}
      <ServicePreviewSection
        limit={3}
        eyebrow="Execution Offerings"
        title="Explore services related to this topic"
        description="Our engineering teams help bring these architectural principles to production."
      />

      {/* 🟢 7. Applied Projects & Case Studies (Prisma Project Model) */}
      <ProjectPreviewSection
        limit={3}
        eyebrow="Applied Work"
        title="Real-world implementations of these concepts"
      />

      {/* 🟢 8. Social Proof & Endorsements (Prisma Testimonial Model) */}
      <TestimonialPreviewSection
        limit={3}
        eyebrow="Social Proof"
        title="What partners say about our architectural rigor"
      />


      {/* 🟢 10. Related Insights (Using Universal Preview Component) */}
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

      {/* 🟢 11. Final High-Conversion CTA */}
      <section className="container-custom px-4 sm:px-6 mt-16 text-center">
        <ScrollReveal>
          <div className="bg-card border border-border shadow-xl rounded-2xl p-10 sm:p-14 relative overflow-hidden text-center">
            <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                <I18n>Need help implementing this architecture?</I18n>
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                <I18n>Connect directly with our senior cloud architects and software engineers to review your infrastructure setup.</I18n>
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-7 py-3 text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:-translate-y-0.5"
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