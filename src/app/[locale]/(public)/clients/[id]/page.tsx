import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { clientService } from "@/features/client/services/client.service";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import { StickyTableOfContents } from "@/components/content/details";
import { ContentRenderer, extractToc } from "@/components/content";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Link } from "@/shared/i18n";
import {
  Globe,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Layers,
  Briefcase,
  MessageSquareQuote,
  ArrowRight,
} from "lucide-react";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";
import I18n from "@/shared/components/I18n";

// 🎯 Universal Ecosystem Components Integration
import { ProjectPreviewSection } from "@/features/project/components/ProjectPreviewSection";
import { TestimonialPreviewSection } from "@/features/testimonial/components/TestimonialPreviewSection";
import { ServicePreviewSection } from "@/features/service/components/ServicePreviewSection";
import { TechnologyPreviewSection } from "@/features/technology/components/TechnologyPreviewSection";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

async function getClient(id: string) {
  const client = await clientService.getById(id);
  if (!client || client.status !== "PUBLISHED") notFound();
  return client;
}

// 🌐 ১. সার্ভার সাইড ডাইনামিক এসইও ইঞ্জিন
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const client = await getClient(id);
    const description =
      client.shortDesc ||
      `${client.title} enterprise client profile, technology integrations, and digital ecosystem delivery by A2ICoders.`;

    return {
      title: `${client.title} | Global Case Partnership`,
      description,
      openGraph: {
        title: `${client.title} - Corporate Alliance Profile`,
        description,
        images:
          client.ogImage || client.heroImage || client.logo
            ? [client.ogImage || client.heroImage || client.logo || ""]
            : [],
      },
    };
  } catch {
    return { title: "Corporate Partner Node" };
  }
}

export default async function PublicClientDetailPage({ params }: PageProps) {
  const { id } = await params;
  const client: any = await getClient(id).catch(() => notFound());

  const website = client.website?.startsWith("http")
    ? client.website
    : client.website
      ? `https://${client.website}`
      : null;

  const json = client.contentJson || {};
  const rawTocItems = extractToc(json, "CLIENT") || [];
  const tocItems = rawTocItems.length >= 2 ? rawTocItems : [];

  const shareUrl = `https://a2icoders.com/clients/${client.slug || client.id}`;
  const shareTitle = encodeURIComponent(`Enterprise Case Study & Partnership with ${client.title}`);

  // ব্যাকগ্রাউন্ড ট্র্যাকিংয়ের জন্য ইমেজ সোর্স সিলেকশন
  const bannerImage =
    client.heroImage ||
    client.ogImage ||
    "https://res.cloudinary.com/a2icoders/image/upload/f_auto,q_auto/banners/clients-global.jpg";

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      {/* 🟢 1. Feature Details Banner */}
      <FeatureDetailsBanner
        variant="gradient-glow"
        backHref="/clients"
        backLabel="Global Partners"
        eyebrow="Strategic Alliance"
        title={client.title}
        description={
          client.shortDesc ||
          "Enterprise integration powered by A2ICoders production infrastructure."
        }
        badges={[client.title || "Enterprise Partner", "Verified Partner"]}
        stats={[
          {
            label: "Partnership Tier",
            value: "Enterprise",
          },
          {
            label: "Verification Status",
            value: "Active SLA",
          },
        ]}
        imageSrc={bannerImage}
        imageAlt={`${client.title} alliance profile configuration telemetry`}
        imagePosition="center"
      >
        {/* 🔧 চাইল্ড হিসেবে CTA একশন বাটন ইন্টিগ্রেশন */}
        {website && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
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
          </div>
        )}
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
                  <I18n>Corporate Partner</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">{client.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Globe className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Domain Status</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  {website ? "Active Endpoint" : "Private Node"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Briefcase className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Projects Delivered</I18n>
                </p>
                <p className="text-foreground text-xs font-bold">
                  {client.projects?.length || 1}+ <I18n>Systems</I18n>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-success/10 text-success rounded-lg p-2.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>SLA Compliance</I18n>
                </p>
                <p className="text-foreground text-xs font-bold">
                  <I18n>100% Verified</I18n>
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 🟢 3. Main Reading & Corporate Detail Area */}
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

            {/* Core Rich Text Content */}
            <div className="prose prose-base sm:prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-img:rounded-xl max-w-none font-medium">
              {json && Object.keys(json).length > 0 ? (
                <ContentRenderer variant="client" content={json} />
              ) : (
                <div className="bg-card/40 border-border space-y-3 rounded-xl border p-8 text-center">
                  <Building2 className="text-primary mx-auto h-8 w-8 opacity-80" />
                  <p className="text-muted-foreground mx-auto max-w-lg text-sm leading-relaxed font-medium">
                    {client.shortDesc ||
                      "This profile represents an active enterprise partner deployment footprint managed under encrypted service level agreements."}
                  </p>
                </div>
              )}
            </div>

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

      {/* 🟢 4. Delivered Systems & Projects (Prisma `projects` Relation) */}
      {client.projects && client.projects.length > 0 ? (
        <ProjectPreviewSection
          items={client.projects as any}
          limit={4}
          eyebrow="Delivered Work"
          title={`Projects built for ${client.title}`}
          description="High-availability software systems, cloud architectures, and digital platforms deployed for this client."
        />
      ) : (
        <ProjectPreviewSection
          limit={4}
          eyebrow="Proven Engineering"
          title="Similar Enterprise System Deliveries"
        />
      )}

      {/* 🟢 5. Client Testimonial & Feedback (Prisma `testimonials` Relation) */}
      {client.testimonials && client.testimonials.length > 0 ? (
        <TestimonialPreviewSection
          items={client.testimonials as any}
          limit={3}
          eyebrow="Partner Voice"
          title={`Endorsement from ${client.title}`}
        />
      ) : (
        <TestimonialPreviewSection
          limit={3}
          eyebrow="Client Trust"
          title="What corporate partners say about our technical execution"
        />
      )}

      {/* 🟢 6. Core Services Provided */}
      <ServicePreviewSection
        limit={3}
        eyebrow="Capabilities Deployed"
        title="Services leveraged by enterprise partners"
      />

      {/* 🟢 7. Core Tech Stack Implemented */}
      <TechnologyPreviewSection
        limit={12}
        eyebrow="Infrastructure Stack"
        title="Technologies & engines powering client systems"
      />


      {/* 🟢 9. High-Conversion Final CTA */}
      <section className="container-custom mt-16 px-4 text-center sm:px-6">
        <ScrollReveal>
          <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 text-center shadow-xl sm:p-14">
            <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-4xl">
                <I18n>Become our next enterprise partner</I18n>
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                <I18n>
                  Let's discuss how our senior architecture team can engineer, deploy, and scale
                  your core digital capabilities.
                </I18n>
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                >
                  <I18n>Start a Partnership</I18n>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/projects"
                  className="bg-surface-elevated border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg border px-8 py-3 text-xs font-bold tracking-wider uppercase transition-all"
                >
                  <I18n>Explore Our Work</I18n>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </article>
  );
}
