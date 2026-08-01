"use client";

import Image from "next/image";
import { ChevronRight, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { Link } from "@/shared/i18n";
import I18n from "@/shared/components/I18n";
import { usePublishedServices } from "../hooks/useService";
import type { Service } from "../types/service.types"; // 👈 আপনার প্রজেক্টের Service টাইপ নিশ্চিত করুন

function cleanExcerpt(input: string | null | undefined) {
  return (input || "")
    .replace(/<img\b[^>]*>/gi, "")
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\((?:https?:\/\/|\/)[^)]+\)/gi, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/\b(?:https?:\/\/|www\.)[^\s<]+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(input: string, maxLength: number) {
  if (input.length <= maxLength) return input;
  return `${input.slice(0, maxLength).trimEnd()}...`;
}

function isMediaUrl(value?: string | null) {
  if (!value) return false;
  return /^(https?:\/\/|\/|data:image\/)/i.test(value.trim());
}

interface ServicePreviewSectionProps {
  limit?: number;

  // 🟢 ১. যেকোনো Details Page থেকে কাস্টম সার্ভিস অ্যারে পাস করার প্রপ্স
  items?: Service[];
  services?: Service[]; // Legacy prop alias

  // 🟢 ২. কাস্টম হেডার কনফিগারেশন প্রপ্স
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

export function ServicePreviewSection({
  limit = 4,
  items: externalItems,
  services: legacyServices,
  eyebrow = "Services",
  title = "How we can help",
  description = "Explore the service pillars we use to shape reliable launches, faster iteration cycles, and cleaner product operations.",
  href = "/services",
  ctaLabel = "All services",
  hideHeader = false,
}: ServicePreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyServices;

  // 🎯 যদি বাইর থেকে items/services না আসে, কেবল তখনই API ফেচ হবে
  const shouldFetch = !initialItems;

  const { data, isLoading: isApiLoading, error } = usePublishedServices(
    shouldFetch ? { page: 1, limit: requestedLimit } : undefined
  );

  const services = useMemo<Service[]>(() => {
    if (initialItems) {
      return [...initialItems]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .slice(0, requestedLimit);
    }

    const rawList = (data?.data?.data || (Array.isArray(data) ? data : [])) as Service[];
    return [...rawList]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .slice(0, requestedLimit);
  }, [initialItems, data, requestedLimit]);

  const isLoading = shouldFetch && isApiLoading;

  if (isLoading) {
    return (
      <section className="bg-background relative isolate overflow-hidden py-14 sm:py-20 lg:py-24">
        <div className="container-custom">
          {!hideHeader && (
            <div className="bg-surface-elevated/50 mb-10 h-10 w-56 animate-pulse rounded-none sm:rounded-lg" />
          )}

          <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-4">
            {Array.from({ length: Math.min(requestedLimit, 4) }).map((_, index) => (
              <div
                key={index}
                className="border-border bg-surface-elevated/50 h-[430px] w-full shrink-0 animate-pulse rounded-none border sm:w-[calc(50%-12px)] sm:rounded-xl lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🎯 এরর থাকলে বা কোনো সার্ভিস ডাটা না থাকলে পুরো সেকশনটি অটোমেটিক হাইড থাকবে
  if ((shouldFetch && error) || services.length === 0) return null;

  return (
    <section className="bg-background relative isolate overflow-hidden py-14 sm:py-20 lg:py-24">
      <div className="container-custom">
        {!hideHeader && (
          <PreviewSectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            href={href}
            ctaLabel={ctaLabel}
          />
        )}

        <div className="mt-10 flex w-full flex-wrap items-stretch justify-center gap-4">
          {services.map((service, index) => {
            const excerpt = cleanExcerpt(service.shortDesc);

            const rawImage = service.heroImage?.trim();
            const imageUrl = rawImage && isMediaUrl(rawImage) ? rawImage : null;

            const rawIcon = service.icon?.trim();
            const iconText = rawIcon && !isMediaUrl(rawIcon) ? rawIcon : null;

            const serviceHref = service.slug ? `/services/${service.slug}` : "/services";
            const imageAlt = (service as any).heroImageAlt || service.title;

            return (
              <article
                key={service.id ? String(service.id) : index}
                className="group border-border bg-card relative isolate z-0 h-[430px] w-full shrink-0 cursor-pointer overflow-hidden rounded-none border transition-all duration-500 ease-out focus-within:z-10 hover:z-10 sm:w-[calc(50%-12px)] sm:rounded-lg lg:w-[calc(33.333%-16px)] lg:focus-within:scale-[1.025] lg:focus-within:shadow-2xl lg:hover:scale-[1.025] lg:hover:shadow-2xl xl:w-[calc(25%-18px)]"
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-all duration-700 ease-out motion-reduce:transition-none lg:group-focus-within:scale-105 lg:group-focus-within:opacity-0 lg:group-focus-within:blur-xs lg:group-hover:scale-105 lg:group-hover:opacity-0 lg:group-hover:blur-xs"
                  />
                ) : (
                  <div className="bg-surface-elevated/40 absolute inset-0 transition-all duration-700 ease-out lg:group-focus-within:scale-105 lg:group-focus-within:opacity-0 lg:group-focus-within:blur-xs lg:group-hover:scale-105 lg:group-hover:opacity-0 lg:group-hover:blur-xs" />
                )}

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-b from-black/40 via-black/10 to-black/85 transition-opacity duration-500 lg:group-focus-within:opacity-0 lg:group-hover:opacity-0"
                />

                {!imageUrl ? (
                  <Sparkles className="text-background/20 absolute right-6 bottom-6 h-9 w-9 transition-opacity duration-500 lg:group-focus-within:opacity-0 lg:group-hover:opacity-0" />
                ) : null}

                <div className="relative flex h-full flex-col p-6 sm:p-7">
                  <div>
                    <p className="lg:group-hover:text-muted-foreground lg:group-focus-within:text-muted-foreground text-xs font-semibold tracking-[0.18em] text-white/75 uppercase transition-colors duration-500">
                      {iconText || "Service"}
                    </p>

                    <h3 className="lg:group-hover:text-foreground lg:group-focus-within:text-foreground mt-5 text-2xl leading-[1.12] font-semibold tracking-[-0.045em] text-white transition-colors duration-500 sm:text-[1.7rem]">
                      {service.title}
                    </h3>
                  </div>

                  <div className="mt-auto">
                    <div className="transition-all duration-500 ease-out motion-reduce:transition-none lg:translate-y-6 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                      <p className="lg:group-hover:text-muted-foreground lg:group-focus-within:text-muted-foreground text-sm leading-6 text-white/80 transition-colors duration-500">
                        {truncate(excerpt || "No Description", 160)}
                      </p>

                      <div className="lg:group-hover:text-muted-foreground lg:group-focus-within:text-muted-foreground mt-4 flex flex-wrap gap-2 text-xs font-medium text-white/70 transition-colors duration-500">
                        <span className="lg:group-hover:border-border lg:group-focus-within:border-border border border-white/20 px-3 py-1 transition-colors duration-500">
                          <I18n>Responsive-ready</I18n>
                        </span>

                        <span className="lg:group-hover:border-border lg:group-focus-within:border-border border border-white/20 px-3 py-1 transition-colors duration-500">
                          <I18n>Scalable system</I18n>
                        </span>
                      </div>
                    </div>

                    <Link
                      href={serviceHref}
                      className="group/expand lg:group-hover:text-foreground lg:group-focus-within:text-foreground focus-visible:ring-primary focus-visible:ring-offset-background mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white outline-hidden transition-all duration-500 focus-visible:ring-2 focus-visible:ring-offset-4 lg:translate-y-4 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
                    >
                      <span className="relative">
                        <I18n>View details</I18n>
                        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/expand:scale-x-100 group-focus-visible/expand:scale-x-100" />
                      </span>

                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/expand:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}