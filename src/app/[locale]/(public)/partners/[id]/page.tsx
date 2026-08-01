import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { partnerService } from "@/features/partner/server";
import { StickyTableOfContents } from "@/components/content/details";
import { ContentRenderer, extractToc } from "@/components/content";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Link } from "@/shared/i18n";
import {
  ArrowUpRight,
  Globe,
  ArrowRight,
  Building2,
  CheckCircle2,
  Layers,
  Handshake,
  Cpu,
} from "lucide-react";
import I18n from "@/shared/components/I18n";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

// 🎯 Universal Ecosystem Components Integration
import { ServicePreviewSection } from "@/features/service/components/ServicePreviewSection";
import { TechnologyPreviewSection } from "@/features/technology/components/TechnologyPreviewSection";
import { ProjectPreviewSection } from "@/features/project/components/ProjectPreviewSection";
import { TestimonialPreviewSection } from "@/features/testimonial/components/TestimonialPreviewSection";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

async function getPartner(id: string) {
  const partner = await partnerService.getById(id);
  if (!partner || partner.status !== "PUBLISHED") notFound();
  return partner;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const partner = await getPartner(id);
    const description =
      partner.shortDesc ||
      `Learn more about our technology alliance and partnership with ${partner.title}.`;
    return {
      title: `${partner.title} | Official Alliance Partner`,
      description,
      openGraph: {
        title: `${partner.title} - Official Technology Partner`,
        description,
        images: partner.logo ? [partner.logo] : [],
      },
    };
  } catch {
    return { title: "Partner Details" };
  }
}

export default async function PublicPartnerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const partner: any = await getPartner(id).catch(() => notFound());

  const website = partner.website?.startsWith("http")
    ? partner.website
    : partner.website
      ? `https://${partner.website}`
      : null;

  const json = partner.contentJson || {};
  const rawTocItems = extractToc(json, "PARTNER") || [];
  const tocItems = rawTocItems.length >= 2 ? rawTocItems : [];

  const shareUrl = `https://a2icoders.com/partners/${partner.slug || partner.id}`;
  const shareTitle = encodeURIComponent(`Strategic Technology Alliance with ${partner.title}`);

  // Fetch related published partners
  const publishedPartnersRes = await partnerService.getPublished(4);
  const otherPartners = (publishedPartnersRes || [])
    .filter((p: any) => p.id !== partner.id)
    .slice(0, 3);

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      {/* 🟢 1. Hero Feature Details Banner */}
      <FeatureDetailsBanner
        variant="gradient-glow"
        backHref="/partners"
        backLabel="All Partners"
        eyebrow="Official Alliance"
        title={partner.title}
        description={
          partner.shortDesc ||
          `Strategic enterprise alliance and technology ecosystem integration with ${partner.title}.`
        }
        badges={[partner.type || "Strategic Alliance", "Verified Partner"]}
        stats={[
          { label: "Partner Tier", value: "Strategic" },
          { label: "Category", value: partner.type || "Technology" },
        ]}
        videoSrc={undefined}
        imageSrc={partner.logo || undefined}
        imageAlt={`${partner.title} logo`}
        imagePosition="center"
      >
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {website ? (
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
            >
              <Globe className="h-4 w-4" />
              <I18n>Visit Official Website</I18n>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : (
            <Link
              href="/contact"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
            >
              <I18n>Discuss Joint Integration</I18n>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </FeatureDetailsBanner>

      {/* 🟢 2. At-A-Glance Corporate Telemetry Strip */}
      <section className="container-custom mx-auto mt-8 mb-16 px-4 sm:px-6">
        <ScrollReveal delay={150}>
          <div className="bg-card/60 border-border grid grid-cols-2 gap-4 rounded-xl border p-6 shadow-xs backdrop-blur-md sm:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Partner</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">{partner.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Handshake className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Alliance Type</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  {partner.type || "Technology"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Globe className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Integration</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  {website ? "Active Endpoint" : "Private SLA"}
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
                  <I18n>100% Certified</I18n>
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 🟢 3. Main Reading & Alliance Overview */}
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
                <I18n>Share Alliance</I18n>
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
                <I18n>Share Alliance:</I18n>
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

      {/* 🟢 4. Joint Capabilities & Services */}
      <ServicePreviewSection
        limit={3}
        eyebrow="Co-Engineered Capabilities"
        title="Solutions & services enabled through this alliance"
      />

      {/* 🟢 5. Technology Stack Ecosystem */}
      <TechnologyPreviewSection
        limit={12}
        eyebrow="Integration Engine"
        title="Platforms & frameworks powering this partnership"
      />

      {/* 🟢 6. Joint Projects & Portfolio */}
      <ProjectPreviewSection
        limit={4}
        eyebrow="Integrated Deliveries"
        title="Joint systems built using this integration"
      />


      {/* 🟢 8. Social Proof & Endorsements */}
      <TestimonialPreviewSection
        limit={3}
        eyebrow="Alliance Trust"
        title="What partners say about building together"
      />

      {/* 🟢 9. Other Ecosystem Partnerships Section */}
      {otherPartners.length > 0 && (
        <section className="bg-card/40 border-border border-t py-16 sm:py-20">
          <div className="container-custom mx-auto px-4 sm:px-6">
            <ScrollReveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-primary mb-2 text-xs font-bold tracking-[0.2em] uppercase">
                  <I18n>Global Alliance Network</I18n>
                </p>
                <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                  <I18n>Explore Complementary Partnerships</I18n>
                </h2>
              </div>
              <Link
                href="/partners"
                className="text-primary hover:text-primary/80 hidden items-center gap-2 text-xs font-bold tracking-wider uppercase transition-colors sm:flex"
              >
                <I18n>View All Partners</I18n>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherPartners.map((otherPartner: any, idx: number) => (
                <ScrollReveal key={otherPartner.id} delay={idx * 100}>
                  <Link
                    href={`/partners/${otherPartner.id}`}
                    className="group border-border bg-card hover:bg-card/80 hover:border-primary/30 flex h-full flex-col items-center justify-center overflow-hidden rounded-xl border p-8 text-center shadow-2xs transition-all hover:-translate-y-0.5"
                  >
                    <div className="relative mb-6 aspect-[2/1] w-full max-w-[140px]">
                      {otherPartner.logo ? (
                        <Image
                          src={otherPartner.logo}
                          alt={otherPartner.title}
                          fill
                          sizes="140px"
                          unoptimized
                          className="object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Building2 className="text-muted-foreground/30 h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="text-primary border-primary/20 bg-primary/5 mb-2 rounded-md border px-3 py-0.5 text-xs font-bold tracking-widest uppercase">
                      {otherPartner.type || "Alliance"}
                    </div>
                    <h3 className="text-foreground group-hover:text-primary text-base font-bold tracking-tight transition-colors">
                      {otherPartner.title}
                    </h3>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 🟢 10. Final Action CTA */}
      <section className="container-custom mt-16 px-4 text-center sm:px-6">
        <ScrollReveal>
          <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 text-center shadow-xl sm:p-14">
            <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-4xl">
                <I18n>Become a Technology Partner</I18n>
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                <I18n>
                  Join our global alliance ecosystem to co-engineer digital software, integrate
                  APIs, and deliver high-scale solutions together.
                </I18n>
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                >
                  <I18n>Apply for Partnership</I18n>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/partners"
                  className="bg-surface-elevated border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg border px-8 py-3 text-xs font-bold tracking-wider uppercase transition-all"
                >
                  <I18n>View All Partners</I18n>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </article>
  );
}
