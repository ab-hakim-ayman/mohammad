import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { testimonialService } from "@/features/testimonial/server";
import { StickyTableOfContents } from "@/components/content/details";
import { ContentRenderer, extractToc } from "@/components/content";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Link } from "@/shared/i18n";
import {
  ArrowUpRight,
  ArrowRight,
  Star,
  Quote as QuoteIcon,
  User as UserIcon,
  Building2,
  CheckCircle2,
  Award,
  Sparkles,
} from "lucide-react";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import I18n from "@/shared/components/I18n";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

// 🎯 Universal Ecosystem Components Integration
import { TestimonialPreviewSection } from "@/features/testimonial/components/TestimonialPreviewSection";
import { ProjectPreviewSection } from "@/features/project/components/ProjectPreviewSection";
import { ServicePreviewSection } from "@/features/service/components/ServicePreviewSection";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

async function getTestimonial(id: string) {
  const testimonial = await testimonialService.getById(id);
  if (!testimonial || testimonial.status !== "PUBLISHED") notFound();
  return testimonial;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const testimonial = await getTestimonial(id);
    const authorName = testimonial.authorName || "Client";
    return {
      title: `${authorName} - Client Endorsement & Review | A2ICoders`,
      description:
        testimonial.message || `Read the official endorsement and feedback from ${authorName}.`,
      openGraph: {
        title: `${authorName} - Verified Endorsement`,
        description: testimonial.message || `Read the official feedback from ${authorName}.`,
        images: testimonial.authorImage ? [testimonial.authorImage] : [],
      },
    };
  } catch {
    return { title: "Testimonial Details" };
  }
}

export default async function PublicTestimonialDetailPage({ params }: PageProps) {
  const { id } = await params;
  const testimonial: any = await getTestimonial(id).catch(() => notFound());

  const authorName = testimonial.authorName || testimonial.client?.title || "Enterprise Partner";
  const authorPosition = testimonial.authorPosition || "Technology Leader";
  const authorPhoto = testimonial.authorImage || testimonial.client?.logo;
  const rating = testimonial.rating ?? 5;

  const json = testimonial.contentJson || {};
  const rawTocItems = extractToc(json, "TESTIMONIAL") || [];
  const tocItems = rawTocItems.length >= 2 ? rawTocItems : [];

  const shareUrl = `https://a2icoders.com/testimonials/${testimonial.id}`;
  const shareTitle = encodeURIComponent(`Verified Review by ${authorName} at A2ICoders`);

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      {/* 🟢 1. Hero Feature Details Banner */}
      <FeatureDetailsBanner
        variant="gradient-glow"
        backHref="/testimonials"
        backLabel="All Testimonials"
        eyebrow="Verified Client Voice"
        title={authorName}
        description={
          testimonial.message ||
          `Explore how A2ICoders delivered critical value and technical excellence for ${authorName}.`
        }
        badges={[testimonial.type || "Client Partner", `${rating} ★ Rating`]}
        stats={[
          { label: "Rating Metric", value: `${rating}.0 / 5.0` },
          { label: "Designation", value: authorPosition },
        ]}
        videoSrc={undefined}
        imageSrc={authorPhoto || undefined}
        imageAlt={`${authorName} portrait`}
        imagePosition="center"
      >
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="bg-card/60 border-border inline-flex items-center gap-2 rounded-lg border p-2.5 px-4 backdrop-blur-md">
            <div className="text-warning flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < rating ? "fill-warning text-warning" : "text-muted opacity-40"}`}
                />
              ))}
            </div>
            <span className="text-foreground ml-1 text-xs font-bold">{rating}.0 Rating</span>
          </div>

          <Link
            href="/contact"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
          >
            <I18n>Start Your Success Story</I18n>
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
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Client</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">{authorName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Award className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Position</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">{authorPosition}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Star className="fill-warning text-warning h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Satisfaction</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  {rating} / 5 <I18n>Stars</I18n>
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
                  <I18n>Verified Feedback</I18n>
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 🟢 3. Editorial Quote Focus & Detailed Review Content */}
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
                <I18n>Share Review</I18n>
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
                  <I18n>Talk to Team</I18n>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </aside>

          {/* Reading Column */}
          <div className="w-full min-w-0">
            {/* Spotlight Endorsement Box */}
            <div className="bg-card/80 border-primary border-border relative mb-12 overflow-hidden rounded-r-xl border-y border-r border-l-4 p-8 shadow-xs sm:p-10">
              <QuoteIcon className="text-primary/5 pointer-events-none absolute -right-6 -bottom-6 h-32 w-32" />
              <p className="text-foreground text-xl leading-relaxed font-semibold tracking-tight italic sm:text-2xl">
                &ldquo;{testimonial.message}&rdquo;
              </p>
              <div className="border-border mt-6 flex items-center justify-between border-t pt-4">
                <div>
                  <p className="text-foreground text-xs font-bold tracking-wider uppercase">
                    — {authorName}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs font-medium">
                    {authorPosition}
                  </p>
                </div>
                <div className="text-warning flex items-center gap-1">
                  {Array.from({ length: rating }).map((_, idx) => (
                    <Star key={idx} className="fill-warning h-3.5 w-3.5" />
                  ))}
                </div>
              </div>
            </div>

            {tocItems.length > 0 && (
              <div className="border-border mb-8 border-l-2 pl-4 lg:hidden">
                <p className="text-muted-foreground mb-3 text-xs font-black tracking-widest uppercase select-none">
                  <I18n>On This Page</I18n>
                </p>
                <StickyTableOfContents items={tocItems} />
              </div>
            )}

            {/* Mobile Share Bar */}
            <div className="border-border mt-8 flex items-center justify-between border-t pt-8 lg:hidden">
              <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase select-none">
                <I18n>Share Review:</I18n>
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

      {/* 🟢 4. Related High-Impact Projects */}
      <ProjectPreviewSection
        limit={4}
        eyebrow="Proven Engineering"
        title="Software projects delivering measurable business outcome"
      />

      {/* 🟢 5. Core Capabilities & Services Leveraged */}
      <ServicePreviewSection
        limit={3}
        eyebrow="Capabilities Leveraged"
        title="Services behind client transformation"
      />

      {/* 🟢 6. Other Verified Endorsements */}
      <TestimonialPreviewSection
        limit={3}
        eyebrow="More Endorsements"
        title="What other global leaders say about A2ICoders"
      />


      {/* 🟢 8. Final High-Conversion Enterprise CTA */}
      <section className="container-custom mt-16 px-4 text-center sm:px-6">
        <ScrollReveal>
          <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 text-center shadow-xl sm:p-14">
            <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-4xl">
                <I18n>Ready to become our next success story?</I18n>
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                <I18n>
                  Partner with our senior cloud architects and software engineers to design, build,
                  and deploy high-performing digital systems.
                </I18n>
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                >
                  <I18n>Initiate Consultation</I18n>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/testimonials"
                  className="bg-surface-elevated border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg border px-8 py-3 text-xs font-bold tracking-wider uppercase transition-all"
                >
                  <I18n>Browse All Reviews</I18n>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </article>
  );
}
