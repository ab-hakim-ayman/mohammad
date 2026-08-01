import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/shared/i18n";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Ticket,
  Clock,
  Video,
  Users,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { eventService } from "@/features/event/server";
import { ContentRenderer, extractToc, extractPlainText } from "@/components/content";
import { StickyTableOfContents, FaqAccordion, ImageGallery } from "@/components/content/details";
import { FeatureDetailsBanner } from "@/shared/components/FeatureDetailsBanner";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import I18n from "@/shared/components/I18n";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

// 🎯 Universal Ecosystem Components Integration
import { TechnologyPreviewSection } from "@/features/technology/components/TechnologyPreviewSection";
import { ServicePreviewSection } from "@/features/service/components/ServicePreviewSection";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const event = await eventService.getPublicBySlug(slug);
    const plainContent = event.contentJson ? extractPlainText(event.contentJson) : "";
    const description =
      event.seoDescription ||
      event.shortDesc ||
      (plainContent.length > 160 ? plainContent.substring(0, 160) + "..." : plainContent);

    return {
      title: `${event.seoTitle || event.title} | Events & Keynotes`,
      description,
      openGraph: {
        title: event.seoTitle || event.title,
        description,
        images:
          event.ogImage || event.heroImage || event.cardImage
            ? [event.ogImage || event.heroImage || event.cardImage || ""]
            : [],
        type: "website",
      },
      alternates: {
        canonical: `/events/${event.slug}`,
      },
    };
  } catch {
    return { title: "Event Not Found" };
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let event: any;
  try {
    event = await eventService.getPublicBySlug(slug);
  } catch {
    notFound();
  }

  const now = new Date();
  const startsAt = new Date(event.startsAt);
  const endsAt = event.endsAt ? new Date(event.endsAt) : undefined;

  const isPast = endsAt ? endsAt < now : startsAt < now;
  const isLive = startsAt <= now && (endsAt ? endsAt >= now : false);

  let eventStatusLabel = "Upcoming Session";
  if (isLive) {
    eventStatusLabel = "Live Stream Active";
  } else if (isPast) {
    eventStatusLabel = "Concluded Session";
  }

  const dateOpts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const timeOpts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };

  const formattedStartDate = new Intl.DateTimeFormat("en-US", dateOpts).format(startsAt);
  const formattedStartTime = new Intl.DateTimeFormat("en-US", timeOpts).format(startsAt);
  const formattedEndDate = endsAt
    ? new Intl.DateTimeFormat("en-US", dateOpts).format(endsAt)
    : null;
  const formattedEndTime = endsAt
    ? new Intl.DateTimeFormat("en-US", timeOpts).format(endsAt)
    : null;

  let displayDate = "";
  if (formattedEndDate && formattedStartDate !== formattedEndDate) {
    displayDate = `${formattedStartDate}, ${formattedStartTime} – ${formattedEndDate}, ${formattedEndTime}`;
  } else if (formattedEndTime) {
    displayDate = `${formattedStartDate} · ${formattedStartTime} – ${formattedEndTime}`;
  } else {
    displayDate = `${formattedStartDate} @ ${formattedStartTime}`;
  }

  // TOC Extraction
  const toc = extractToc(event.contentJson, "event") || [];
  const showToc = toc.length >= 2;

  const mainImage = event.heroImage || event.cardImage;
  const uniqueImages = (event.galleryImages || []).filter((img: string) => img !== mainImage);

  const shareUrl = `https://a2icoders.com/events/${event.slug}`;
  const shareTitle = encodeURIComponent(event.title);

  // Schema.org Event JSON-LD
  const plainContent = event.contentJson ? extractPlainText(event.contentJson) : "";
  const description = event.seoDescription || event.shortDesc || plainContent.substring(0, 160);

  let attendanceMode = "https://schema.org/OfflineEventAttendanceMode";
  if (event.format === "ONLINE") attendanceMode = "https://schema.org/OnlineEventAttendanceMode";
  else if (event.format === "HYBRID")
    attendanceMode = "https://schema.org/MixedEventAttendanceMode";

  const eventJsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: description,
    startDate: startsAt.toISOString(),
    ...(endsAt && { endDate: endsAt.toISOString() }),
    eventAttendanceMode: attendanceMode,
    eventStatus: "https://schema.org/EventScheduled",
  };

  if (mainImage) eventJsonLd.image = [mainImage];

  if (event.format !== "ONLINE" && event.location) {
    eventJsonLd.location = {
      "@type": "Place",
      name: event.location,
      address: event.location,
    };
  }

  if (event.registrationUrl) {
    eventJsonLd.offers = {
      "@type": "Offer",
      url: event.registrationUrl,
      price: event.isFree ? "0" : "Registration Required",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    };
  }

  const faqs = event.faqs || [];

  return (
    <article className="bg-background text-foreground selection:bg-primary/15 min-h-screen w-full pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      {/* 🟢 1. Hero Feature Banner */}
      <FeatureDetailsBanner
        variant="gradient-glow"
        backHref="/events"
        backLabel="All Events"
        eyebrow="Keynote & Summit"
        title={event.title}
        description={
          event.shortDesc || `Join our system architects and engineers for ${event.title}.`
        }
        badges={[
          eventStatusLabel,
          event.format === "ONLINE"
            ? "Global Virtual Stream"
            : event.format === "HYBRID"
              ? "Hybrid Format"
              : "In-Person Keynote",
        ]}
        stats={[
          { label: "Date", value: formattedStartDate },
          { label: "Status", value: isLive ? "LIVE NOW" : isPast ? "Ended" : "Open Pass" },
        ]}
        videoSrc={event.heroVideoUrl || undefined}
        imageSrc={mainImage || undefined}
        imageAlt={`${event.title} event banner`}
        imagePosition="center"
      >
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {!isPast && event.registrationUrl ? (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
            >
              <I18n>Claim Event Pass</I18n>
              <Ticket className="h-4 w-4" />
            </a>
          ) : isPast ? (
            <Link
              href="/events"
              className="bg-surface-elevated border-border hover:bg-card text-foreground inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-xs font-bold tracking-wider uppercase transition-all"
            >
              <I18n>Browse Upcoming Summits</I18n>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </FeatureDetailsBanner>

      {/* 🟢 2. At-A-Glance Telemetry Metric Strip */}
      <section className="container-custom mx-auto mt-8 mb-16 px-4 sm:px-6">
        <ScrollReveal delay={150}>
          <div className="bg-card/60 border-border grid grid-cols-2 gap-4 rounded-xl border p-6 shadow-xs backdrop-blur-md sm:grid-cols-4 lg:grid-cols-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Clock className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Timing</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">{formattedStartTime}</p>
              </div>
            </div>

            {event.format !== "ONLINE" && event.location ? (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                    <I18n>Location</I18n>
                  </p>
                  <p className="text-foreground truncate text-xs font-bold">{event.location}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                  <Video className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                    <I18n>Virtual Hub</I18n>
                  </p>
                  <p className="text-foreground truncate text-xs font-bold">
                    <I18n>Live Webcast</I18n>
                  </p>
                </div>
              </div>
            )}

            {event.capacity && (
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                  <Users className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                    <I18n>Capacity</I18n>
                  </p>
                  <p className="text-foreground truncate text-xs font-bold">
                    {event.capacity} <I18n>Seats</I18n>
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                <Ticket className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Access Model</I18n>
                </p>
                <p className="text-foreground truncate text-xs font-bold">
                  {event.isFree ? "Complimentary Pass" : "Invite Only"}
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <div className="bg-success/10 text-success rounded-lg p-2.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                  <I18n>Protocol</I18n>
                </p>
                <p className="text-foreground text-xs font-bold">
                  <I18n>Confirmed Event</I18n>
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 🟢 3. Main Reading Area & Event Content */}
      <section className="container-custom mb-20 px-4 sm:px-6">
        <div className="3xl:grid-cols-[260px_1fr] grid items-start gap-12 lg:grid-cols-[240px_1fr] xl:gap-16">
          {/* Sticky Sidebar */}
          <aside className="sticky top-28 hidden space-y-10 self-start lg:block">
            {showToc && (
              <div className="border-border border-l-2 pl-4">
                <p className="text-muted-foreground mb-4 text-xs font-black tracking-widest uppercase select-none">
                  <I18n>Event Agenda</I18n>
                </p>
                <StickyTableOfContents items={toc} />
              </div>
            )}

            <div className="border-border space-y-4 border-l-2 pl-4">
              <p className="text-muted-foreground mb-3 text-xs font-black tracking-widest uppercase select-none">
                <I18n>Share Keynote</I18n>
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

              {!isPast && event.registrationUrl && (
                <div className="border-border border-t pt-4">
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-bold tracking-wider uppercase shadow-xs transition-all"
                  >
                    <I18n>Reserve Pass</I18n>
                    <Ticket className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          </aside>

          {/* Core Content Renderer */}
          <div className="w-full min-w-0">
            {showToc && (
              <div className="border-border mb-8 border-l-2 pl-4 lg:hidden">
                <p className="text-muted-foreground mb-3 text-xs font-black tracking-widest uppercase select-none">
                  <I18n>Event Agenda</I18n>
                </p>
                <StickyTableOfContents items={toc} />
              </div>
            )}

            <div className="prose prose-base sm:prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-img:rounded-xl max-w-none font-medium">
              {event.contentJson ? (
                <ContentRenderer content={event.contentJson} variant="event" />
              ) : (
                <p className="text-muted-foreground leading-relaxed">{event.shortDesc}</p>
              )}
            </div>

            {/* Event Video Walkthrough */}
            {event.demoVideoUrl && (
              <div className="border-border mt-14 border-t pt-10">
                <h3 className="mb-6 text-xl font-bold tracking-tight">
                  <I18n>Keynote Teaser & Preview</I18n>
                </h3>
                <div className="border-border bg-muted relative aspect-video w-full overflow-hidden rounded-xl border shadow-md">
                  <iframe
                    src={event.demoVideoUrl.replace("watch?v=", "embed/")}
                    className="h-full w-full border-0"
                    allowFullScreen
                    title="Event Teaser"
                  />
                </div>
              </div>
            )}

            {/* Mobile Share Bar */}
            <div className="border-border mt-8 flex items-center justify-between border-t pt-8 lg:hidden">
              <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase select-none">
                <I18n>Share Keynote:</I18n>
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


      {/* 🟢 5. Technologies & Ecosystem (Prisma Technology Model) */}
      <TechnologyPreviewSection
        limit={12}
        eyebrow="Tech Stack"
        title="Technologies & architecture covered in this session"
      />

      {/* 🟢 6. Visual Gallery */}
      {uniqueImages.length > 0 && (
        <section className="bg-card/40 border-border border-y py-16 sm:py-20">
          <div className="container-custom mx-auto px-4 sm:px-6">
            <ScrollReveal className="mb-10 text-center">
              <p className="text-primary mb-2 text-xs font-bold tracking-[0.2em] uppercase">
                <I18n>Visual Archives</I18n>
              </p>
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                <I18n>Event Highlights Gallery</I18n>
              </h2>
            </ScrollReveal>
            <ImageGallery images={uniqueImages} />
          </div>
        </section>
      )}

      {/* 🟢 7. FAQ Section */}
      {faqs && faqs.length > 0 && (
        <section className="border-border border-t py-20 sm:py-24">
          <div className="container-custom mx-auto max-w-4xl px-4 sm:px-6">
            <ScrollReveal className="mb-12 text-center">
              <span className="text-primary mb-2 inline-block text-xs font-bold tracking-[0.2em] uppercase">
                <I18n>Need Assistance?</I18n>
              </span>
              <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                <I18n>Frequently Asked Questions</I18n>
              </h2>
            </ScrollReveal>
            <ScrollReveal>
              <FaqAccordion items={faqs} />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 🟢 8. Related Capabilities / Execution Services */}
      <ServicePreviewSection
        limit={3}
        eyebrow="Related Services"
        title="Architectural solutions discussed in this summit"
      />


      {/* 🟢 10. Final Action CTA */}
      <section className="container-custom mt-16 px-4 text-center sm:px-6">
        <ScrollReveal>
          <div className="bg-card border-border relative overflow-hidden rounded-2xl border p-10 text-center shadow-xl sm:p-14">
            <div className="bg-primary/5 pointer-events-none absolute -top-10 -right-10 h-64 w-64 rounded-full blur-3xl" />
            <div className="relative z-10 mx-auto max-w-2xl space-y-5">
              {!isPast && event.registrationUrl ? (
                <>
                  <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-4xl">
                    <I18n>Reserve your seat today</I18n>
                  </h2>
                  <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                    <I18n>
                      Register now to join software architects, developers, and technology leaders.
                      Registration is limited.
                    </I18n>
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 pt-2">
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                    >
                      <I18n>Register Now</I18n>
                      <Ticket className="h-4 w-4" />
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-4xl">
                    <I18n>This event has concluded</I18n>
                  </h2>
                  <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                    <I18n>
                      Don't miss our upcoming technical sessions. Explore future events or read our
                      engineering blogs.
                    </I18n>
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 pt-2">
                    <Link
                      href="/events"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-8 py-3 text-xs font-bold tracking-wider uppercase shadow-md transition-all hover:-translate-y-0.5"
                    >
                      <I18n>Browse Upcoming Events</I18n>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>
    </article>
  );
}
