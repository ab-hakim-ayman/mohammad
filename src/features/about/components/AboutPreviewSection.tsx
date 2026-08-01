import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { Award, BriefcaseBusiness, Building2, Compass, Handshake, UsersRound } from "lucide-react";

import { Link } from "@/shared/i18n";
import { PreviewSectionHeader } from "@/shared/components";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { aboutService } from "../services/about.service";
import { prisma } from "@/core/server/prisma";

import { eventService } from "@/features/event/server";
import I18n from "@/shared/components/I18n";

type ExploreItem = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  layout: string;
  count: string;
};

type EventItem = {
  title?: string | null;
  image?: string | null;
  coverImage?: string | null;
  banner?: string | null;
  featuredImage?: string | null;
};

type GalleryImage = {
  src: string;
  alt: string;
};

function stripHtml(value?: string | null) {
  if (!value) return "";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getListFromResponse<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];

  if (!response || typeof response !== "object") return [];

  const root = response as {
    data?: unknown;
    results?: unknown;
    items?: unknown;
  };

  const payload = root.data ?? root;

  if (Array.isArray(payload)) return payload as T[];

  if (payload && typeof payload === "object") {
    const nested = payload as {
      results?: unknown;
      items?: unknown;
      data?: unknown;
    };

    if (Array.isArray(nested.results)) return nested.results as T[];
    if (Array.isArray(nested.items)) return nested.items as T[];
    if (Array.isArray(nested.data)) return nested.data as T[];
  }

  return [];
}

function getEventImage(event: EventItem) {
  return event.image || event.coverImage || event.banner || event.featuredImage || null;
}

export async function AboutPreviewSection() {
  const [
    about,
    eventResponse,
    projectCount,
    achievementCount,
    clientCount,
    partnerCount,
  ] = await Promise.all([
    aboutService.getPublished().catch(() => null),

    eventService.getPublished({}).catch(() => null),

    prisma.project.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
    prisma.achievement.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
    prisma.client.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
    prisma.partner.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
  ]);

  if (!about) return null;

  const description = stripHtml(about.shortDesc);
  const content = stripHtml(typeof about.contentJson === "string" ? about.contentJson : null);

  const exploreItems: ExploreItem[] = [
    {
      href: "/projects",
      title: "Projects",
      description: "Explore the digital products we have delivered.",
      icon: BriefcaseBusiness,
      layout: "lg:col-span-3",
      count: `${projectCount}+`,
    },
    {
      href: "/achievements",
      title: "Achievements",
      description: "Milestones that reflect our growth and impact.",
      icon: Award,
      layout: "lg:col-span-3",
      count: `${achievementCount}+`,
    },
    {
      href: "/clients",
      title: "Clients",
      description: "Brands and organizations that trust our work.",
      icon: Building2,
      layout: "lg:col-span-3",
      count: `${clientCount}+`,
    },
    {
      href: "/partners",
      title: "Partners",
      description: "Stronger solutions through meaningful collaboration.",
      icon: Handshake,
      layout: "lg:col-span-3",
      count: `${partnerCount}+`,
    },
  ];

  const events = getListFromResponse<EventItem>(eventResponse);

  const eventImages: GalleryImage[] = events
    .map((event) => {
      const src = getEventImage(event);

      if (!src) return null;

      return {
        src,
        alt: event.title || "Company event",
      };
    })
    .filter((item): item is GalleryImage => Boolean(item))
    .slice(0, 3);

  const collageImages: GalleryImage[] = [
    ...(about.heroImage
      ? [
        {
          src: about.heroImage,
          alt: about.title,
        },
      ]
      : []),
    ...eventImages,
  ];

  const primaryImage = collageImages[0];
  const secondImage = collageImages[1] || primaryImage;
  const thirdImage = collageImages[2] || primaryImage;
  const fourthImage = collageImages[3] || secondImage || primaryImage;

  const contentBlocks = [
    {
      key: "approach",
      label: "HOW WE WORK",
      title: "Approach",
      value: content,
      icon: Compass,
    },
  ].filter((item) => item.value);

  return (
    // 🎯 Section Padding Standardized to py-12 sm:py-16 lg:py-24
    <section className="bg-background relative w-full overflow-hidden py-12 sm:py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-primary/10 absolute top-20 -left-20 h-72 w-72 blur-3xl" />
        <div className="bg-primary/5 absolute right-0 bottom-0 h-80 w-80 blur-3xl" />
      </div>

      <div className="container-custom">
        <PreviewSectionHeader
          eyebrow={"Who We Are"}
          title={about.title}
          description={description}
          href="/about"
          ctaLabel="Discover Our Story"
        />

        {/* 🎯 Balanced Grid Margin: mt-8 lg:mt-12 */}
        <div className="border-border mt-8 grid border lg:mt-12 lg:grid-cols-12 3xl:grid-cols-8 5xl:grid-cols-8">
          <div className="border-border bg-border border-b lg:col-span-5 lg:border-r lg:border-b-0">
            <div
              className={`grid h-full gap-px ${contentBlocks.length > 1 ? "sm:grid-cols-2" : ""}`}
            >
              {contentBlocks.map((item, index) => {
                const Icon = item.icon;
                const isApproachWide = contentBlocks.length === 3 && index === 0;

                return (
                  <ScrollReveal
                    key={item.key}
                    className={`${isApproachWide ? "sm:col-span-2" : ""} bg-card h-full`}
                  >
                    {/* 🎯 Article Padding Adjusted to p-6 sm:p-8 */}
                    <article className="group hover:bg-primary relative flex h-full flex-col justify-center overflow-hidden p-6 transition duration-300 sm:p-8">
                      <div className="flex items-center gap-3.5">
                        <div className="text-primary group-hover:text-primary-foreground relative flex h-10 w-10 items-center justify-center transition-transform duration-500 group-hover:scale-110">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-primary/80 group-hover:text-primary-foreground/80 text-xs font-bold tracking-widest uppercase transition-colors duration-300">
                          {item.title}
                        </p>
                      </div>

                      <div className="mt-4">
                        <p className="text-muted-foreground group-hover:text-primary-foreground/90 text-base leading-relaxed transition-colors duration-300">
                          {item.value}
                        </p>
                      </div>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

          <ScrollReveal className="lg:col-span-7">
            <div className="bg-border grid min-h-[480px] grid-cols-12 grid-rows-6 gap-px sm:min-h-[560px]">
              {primaryImage ? (
                <div className="group bg-surface-elevated relative col-span-8 row-span-4 overflow-hidden">
                  <Image
                    src={primaryImage.src}
                    alt={primaryImage.alt}
                    fill
                    priority
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                  {/* 🎯 Photo Overlay Padding: p-5 sm:p-6 */}
                  <div className="absolute bottom-0 left-0 p-5 sm:p-6">
                    <p className="text-background/80 text-xs font-bold tracking-widest uppercase">
                      <I18n>Our Story</I18n>
                    </p>

                    <p className="text-background mt-1.5 max-w-sm text-base leading-6 font-bold sm:text-lg">
                      <I18n>People, ideas, and technology united for progress.</I18n>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="from-primary/25 via-card to-primary/5 col-span-8 row-span-4 bg-linear-to-br" />
              )}

              {secondImage ? (
                <div className="group bg-surface-elevated relative col-span-4 row-span-2 overflow-hidden">
                  <Image
                    src={secondImage.src}
                    alt={secondImage.alt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(max-width: 1024px) 45vw, 20vw"
                  />

                  <div className="bg-foreground/15 absolute inset-0 transition group-hover:bg-transparent" />

                  <div className="bg-card text-foreground absolute bottom-3 left-3 px-2.5 py-1.5 text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
                    <I18n>Moments</I18n>
                  </div>
                </div>
              ) : (
                <div className="bg-primary/10 col-span-4 row-span-2" />
              )}

              {thirdImage ? (
                <div className="group bg-surface-elevated relative col-span-4 row-span-2 overflow-hidden">
                  <Image
                    src={thirdImage.src}
                    alt={thirdImage.alt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(max-width: 1024px) 45vw, 20vw"
                  />
                </div>
              ) : (
                <div className="bg-card col-span-4 row-span-2" />
              )}

              {/* 🎯 Primary Card Inner Padding: p-5 sm:p-6 */}
              <div className="bg-primary text-primary-foreground col-span-4 row-span-2 flex flex-col justify-between p-5 sm:p-6">
                <p className="text-primary-foreground/75 text-xs font-bold tracking-widest uppercase">
                  <I18n>Built Together</I18n>
                </p>

                <p className="max-w-44 text-base leading-6 font-bold sm:text-lg">
                  <I18n>Every milestone begins with a shared ambition.</I18n>
                </p>
              </div>

              {fourthImage ? (
                <div className="group bg-surface-elevated relative col-span-4 row-span-2 overflow-hidden">
                  <Image
                    src={fourthImage.src}
                    alt={fourthImage.alt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
                    sizes="(max-width: 1024px) 45vw, 20vw"
                  />
                </div>
              ) : (
                <div className="bg-surface-elevated col-span-4 row-span-2" />
              )}

              <div className="bg-card col-span-4 row-span-2 flex items-end p-5 sm:p-6">
                <p className="text-foreground text-xs leading-5 font-semibold sm:text-sm">
                  <I18n>From vision to measurable digital impact.</I18n>
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* 🎯 Explore Cards Grid Top Margin: mt-8 lg:mt-10 */}
        <ScrollReveal className="mt-8 lg:mt-10">
          <div className="border-border bg-border grid gap-px border sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[170px] 3xl:grid-cols-8 5xl:grid-cols-8">
            {exploreItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group bg-card hover:bg-primary relative flex min-h-[170px] cursor-pointer flex-col justify-between overflow-hidden p-5 sm:p-6 transition duration-300 ${item.layout}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-primary group-hover:text-primary-foreground relative flex h-10 w-10 items-center justify-center transition-transform duration-500 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="border-border bg-surface-elevated text-foreground group-hover:border-primary-foreground/20 group-hover:bg-primary-foreground/15 group-hover:text-primary-foreground flex h-9 items-center rounded-full border px-3 text-xs font-bold transition">
                      {item.count}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-foreground group-hover:text-primary-foreground text-base font-bold transition">
                      {item.title}
                    </p>

                    <p className="text-muted-foreground group-hover:text-primary-foreground/75 mt-1 max-w-sm text-xs leading-5 transition">
                      {item.description}
                    </p>
                  </div>

                  <div className="bg-primary-foreground absolute bottom-0 left-0 h-px w-0 transition-all duration-500 group-hover:w-full" />
                </Link>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}