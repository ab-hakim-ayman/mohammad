"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bannerVariants = cva(
  "relative isolate flex w-full overflow-hidden border-b border-border/60 transition-all duration-300",
  {
    variants: {
      variant: {
        split: "py-10 sm:py-14",
        splitInline: "py-10 sm:py-14",
        center: "py-10 sm:py-14",
        stacked: "py-8 sm:py-12",
        minimal: "py-6 sm:py-8",
      },
      theme: {
        light: "bg-background text-foreground",
        dark: "bg-card text-foreground",
      },
    },
    defaultVariants: {
      variant: "splitInline",
      theme: "light",
    },
  }
);

export type FeatureDetailsBannerStat = {
  label: string;
  value: string;
  tone?: string;
};

interface FeatureDetailsBannerProps extends VariantProps<typeof bannerVariants> {
  backHref?: string;
  backLabel?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  supportingCopy?: string;
  stats?: FeatureDetailsBannerStat[];
  badges?: string[];
  chips?: string[];
  icon?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  imagePriority?: boolean;
  imagePosition?: string;
  videoSrc?: string;
  videoPoster?: string;
  children?: ReactNode;
  className?: string;
}

export function FeatureDetailsBanner({
  variant = "splitInline",
  theme = "light",
  backHref,
  backLabel = "Back",
  eyebrow,
  title,
  description,
  supportingCopy,
  stats = [],
  badges = [],
  chips = [],
  icon,
  imageSrc,
  imageAlt = "Details asset thumbnail",
  imagePriority = true,
  imagePosition = "center",
  videoSrc,
  videoPoster,
  children,
  className,
}: FeatureDetailsBannerProps) {
  const router = useRouter();

  const isMinimal = variant === "minimal";
  const isCenter = variant === "center";
  const isStacked = variant === "stacked";
  const isSplit = variant === "split";
  const isSplitInline = variant === "splitInline";

  const allBadges = Array.from(new Set([...badges, ...chips]));

  return (
    <section className={cn(bannerVariants({ variant, theme }), className)}>
      {/* 🟢 1. Media Asset Layer */}
      {imageSrc && !isMinimal && (
        <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden text-[0px]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            unoptimized
            priority={imagePriority}
            className={cn(
              "object-cover transition-opacity duration-300",
              theme === "dark" ? "opacity-70 dark:opacity-60" : "opacity-85 dark:opacity-70"
            )}
            style={{ objectPosition: imagePosition }}
          />
          <div className="from-transparent via-background/30 to-background absolute inset-0 bg-gradient-to-b" />
        </div>
      )}

      {/* 🟢 2. Video Background Layer */}
      {videoSrc && !isMinimal && (
        <div className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
          <video
            src={videoSrc}
            poster={videoPoster}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-25 dark:opacity-35"
            style={{ objectPosition: imagePosition }}
          />
          <div className="from-transparent via-background/40 to-background absolute inset-0 bg-gradient-to-b" />
        </div>
      )}

      {/* 🟢 3. Glow & Grid Mesh Background (Fallback) */}
      {!imageSrc && !videoSrc && !isMinimal && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="bg-primary/10 absolute top-0 left-1/2 h-44 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
      )}

      {/* 🟢 4. Main Content Container */}
      <div className="container-custom relative z-10 w-full">
        <ScrollReveal className="w-full">
          <div
            className={cn(
              "flex w-full gap-8",
              isCenter && "mx-auto max-w-3xl flex-col items-center text-center",
              (isStacked || isMinimal) && "max-w-3xl flex-col items-start text-left",
              isSplit && "flex-col md:flex-row md:items-start md:justify-between text-left",
              isSplitInline && "grid grid-cols-1 md:grid-cols-2 items-start gap-8 lg:gap-12 text-left"
            )}
          >
            {/* 📝 Left Column */}
            <div
              className={cn(
                "flex flex-col gap-4",
                !isSplit && !isSplitInline ? "w-full" : "flex-1"
              )}
            >
              {backHref && (
                <Button
                  variant="ghost"
                  onClick={() => router.push(backHref)}
                  className="hover:bg-background/80 bg-background/60 text-foreground -ml-2.5 h-8 w-fit cursor-pointer rounded-full border border-border/60 px-3 text-xs font-semibold tracking-wide shadow-2xs backdrop-blur-md transition-all"
                >
                  <span className="inline-flex items-center">
                    <ArrowLeft className="text-primary mr-1.5 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                    {backLabel}
                  </span>
                </Button>
              )}

              {(eyebrow || allBadges.length > 0) && (
                <div className={cn("flex flex-wrap items-center gap-2", isCenter && "justify-center")}>
                  {eyebrow && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase text-muted-foreground select-none backdrop-blur-md shadow-2xs">
                      {icon ? (
                        <span className="text-primary flex h-3.5 w-3.5 items-center justify-center">
                          {icon}
                        </span>
                      ) : (
                        <span className="bg-primary h-1.5 w-1.5 rounded-full animate-pulse" />
                      )}
                      <span>{eyebrow}</span>
                    </div>
                  )}

                  {allBadges.map((badge, idx) => (
                    <Badge
                      key={`${badge}-${idx}`}
                      variant="outline"
                      className="border-border/80 bg-background/70 text-foreground rounded-full px-3 py-0.5 text-[11px] font-semibold backdrop-blur-md shadow-2xs"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}

              <h1 className="text-foreground text-2xl leading-[1.15] font-extrabold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                {title}
              </h1>

              {!isSplitInline && description && (
                <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed sm:text-base font-normal">
                  {description}
                </p>
              )}

              {!isSplitInline && supportingCopy && (
                <p className="text-muted-foreground/80 max-w-xl text-xs leading-relaxed sm:text-sm">
                  {supportingCopy}
                </p>
              )}

              {children && <div className="pt-2">{children}</div>}
            </div>

            {/* ⚡ Right Column */}
            <div
              className={cn(
                "flex flex-col gap-5 items-start",
                isCenter && "items-center w-full",
                isSplit && "shrink-0 md:items-end",
                isSplitInline && "w-full"
              )}
            >
              {isSplitInline && (
                <div className="flex flex-col gap-2 w-full">
                  {description && (
                    <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                      {description}
                    </p>
                  )}
                  {supportingCopy && (
                    <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
                      {supportingCopy}
                    </p>
                  )}
                </div>
              )}

              {stats.length > 0 && !isMinimal && (
                <div
                  className={cn(
                    "flex flex-wrap gap-x-8 gap-y-3 pt-1",
                    isCenter ? "justify-center" : "justify-start",
                    isSplit && "md:justify-end"
                  )}
                >
                  {stats.slice(0, 4).map((stat, idx) => (
                    <div key={`${stat.label}-${idx}`} className="flex flex-col space-y-1">
                      {/* 🏷️ Heading (উপরে, বোল্ড ও সাইজে বড়) */}
                      <span className="text-foreground text-xs sm:text-sm font-bold tracking-wider uppercase">
                        {stat.label}
                      </span>
                      <span className="text-muted-foreground text-[11px] sm:text-xs font-medium">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}