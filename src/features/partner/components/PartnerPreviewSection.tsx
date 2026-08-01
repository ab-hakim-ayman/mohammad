"use client";

import I18n from "@/shared/components/I18n";
import { useMemo, useState } from "react";
import Image from "next/image";
import { PreviewSectionHeader } from "@/shared/components";
import { Skeleton } from "@/components/ui/skeleton";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

import { Marquee } from "@/components/ui/marquee";
import { usePublishedPartners } from "../hooks/usePartner";
import { Partner } from "../types/partner.types";

const sectionVariants = cva(
  "relative w-full transition-all duration-300 overflow-hidden flex justify-center items-center mx-auto",
  {
    variants: {
      variant: {
        classic: "bg-background border-border shadow-2xs",
        glassmorphic: "bg-card/40 backdrop-blur-md border-border shadow-xs",
        minimal: "bg-transparent border-0 shadow-none py-0",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

const containerVariants = cva(
  "container-custom flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        sm: "py-8",
        default: "py-12",
        lg: "py-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface PartnerPreviewSectionProps
  extends VariantProps<typeof sectionVariants>, VariantProps<typeof containerVariants> {
  limit?: number;

  // 🟢 ১. কাস্টম ডাটা পাস করার প্রপস
  items?: Partner[];
  partners?: Partner[]; // Legacy prop alias

  // 🟢 ২. কাস্টম হেডার কনফিগারেশন প্রপস
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

function normalizeWebsite(url: string | null | undefined) {
  if (!url) return null;
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
}

function PartnerLogoCard({ partner }: { partner: Partner }) {
  const website = normalizeWebsite(partner.website);
  const [imageFailed, setImageFailed] = useState(false);

  const content = (
    <div className="group border-border bg-card/50 shadow-3xs hover:border-primary/40 hover:bg-card flex h-[100px] w-36 shrink-0 cursor-pointer flex-col items-center justify-center gap-2 rounded-none border px-3 py-4 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xs sm:w-40 sm:rounded-lg">
      <div className="relative flex h-10 w-full items-center justify-center">
        {partner.logo && !imageFailed ? (
          <Image
            src={partner.logo}
            alt={partner.title}
            width={160}
            height={48}
            unoptimized
            sizes="120px"
            className="h-auto max-h-[32px] w-auto max-w-full object-contain opacity-65 grayscale transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 dark:brightness-110"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="text-muted-foreground/80 group-hover:text-primary truncate px-1 text-xs font-bold transition-colors">
            {partner.title}
          </span>
        )}
      </div>

      <p className="text-muted-foreground group-hover:text-primary mt-1 line-clamp-1 max-w-full text-xs font-bold tracking-wider uppercase transition-colors duration-300">
        {partner.title}
      </p>
    </div>
  );

  if (!website) return <div className="mx-auto inline-flex">{content}</div>;

  return (
    <a
      href={website}
      target="_blank"
      rel="noreferrer"
      className="focus-visible:ring-primary/20 mx-auto inline-flex rounded-none outline-hidden focus-visible:ring-2 sm:rounded-lg"
    >
      {content}
    </a>
  );
}

export function PartnerPreviewSection({
  limit = 16,
  items: externalItems,
  partners: legacyPartners,
  eyebrow = "Our partners",
  title = "Stronger outcomes through meaningful partnerships",
  description = "We collaborate with trusted organizations, platforms, and ecosystem partners to deliver greater value.",
  href = "/partners",
  ctaLabel = "View all partners",
  hideHeader = false,
  variant,
  size,
}: PartnerPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyPartners;

  // 🎯 বাইর থেকে items পাস করা থাকলে API ফেচ স্কিপ হবে
  const shouldFetch = !initialItems;

  const {
    data,
    isLoading: isApiLoading,
    error,
  } = usePublishedPartners(shouldFetch ? { limit: requestedLimit } : undefined);

  const partners = useMemo<Partner[]>(() => {
    if (initialItems) {
      return [...initialItems]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .slice(0, requestedLimit);
    }

    const rawList = (data?.data || (Array.isArray(data) ? data : [])) as Partner[];
    return [...rawList].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, requestedLimit);
  }, [initialItems, data, requestedLimit]);

  const isLoading = shouldFetch && isApiLoading;

  if (isLoading) {
    return (
      <section className={sectionVariants({ variant })}>
        <div className={containerVariants({ size })}>
          {!hideHeader && (
            <div className="flex flex-col items-center justify-center space-y-3">
              <Skeleton className="h-5 w-28 self-center rounded" />
              <Skeleton className="h-11 w-full max-w-2xl self-center rounded" />
            </div>
          )}
          <div className="mt-10 flex w-full justify-center gap-3 overflow-hidden py-1">
            {Array.from({ length: Math.min(requestedLimit, 6) }).map((_, index) => (
              <Skeleton key={index} className="h-[100px] w-40 shrink-0 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🎯 ডাটা না থাকলে অটোমেটিক সেকশন লুকানো থাকবে
  if ((shouldFetch && error) || partners.length === 0) return null;

  return (
    <section
      className={cn(
        "relative isolate mx-auto w-full justify-center overflow-hidden",
        sectionVariants({ variant })
      )}
    >
      <div className={containerVariants({ size })}>
        <div
          aria-hidden="true"
          className="bg-primary/5 pointer-events-none absolute top-12 -left-28 h-64 w-64 rounded-full blur-3xl"
        />
        <div
          aria-hidden="true"
          className="bg-primary/5 pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full blur-3xl"
        />

        {!hideHeader && (
          <div className="flex w-full flex-col items-center justify-center text-center">
            <PreviewSectionHeader
              variant="center"
              eyebrow={eyebrow}
              title={title}
              description={description}
              href={href}
              ctaLabel={ctaLabel}
            />
          </div>
        )}

        <div className="relative mx-auto mt-10 flex w-full flex-col items-center justify-center overflow-hidden py-1">
          <div className="from-background via-background/40 pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r to-transparent lg:w-24" />
          <div className="from-background via-background/40 pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l to-transparent lg:w-24" />

          <div className="flex w-full flex-col items-center justify-center">
            <Marquee
              pauseOnHover
              className="w-full justify-center [--duration:40s] [--gap:0.75rem]"
            >
              {partners.map((partner, index) => (
                <PartnerLogoCard key={partner.id ? String(partner.id) : index} partner={partner} />
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
}
