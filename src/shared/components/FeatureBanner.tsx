"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cva, type VariantProps } from "class-variance-authority";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export type FeatureBannerAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  icon?: ReactNode;
};

export type FeatureBannerStat = {
  label: string;
  value: string;
  tone?: string;
};

const bannerVariants = cva(
  "relative isolate flex w-full overflow-hidden border-b border-border/60",
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

interface FeatureBannerProps extends VariantProps<typeof bannerVariants> {
  eyebrow?: string;
  title: string;
  description: string;
  supportingCopy?: string;
  chips?: string[];
  actions?: FeatureBannerAction[];
  stats?: FeatureBannerStat[];
  icon?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  imagePriority?: boolean;
  imagePosition?: string;
  videoSrc?: string;
  videoPoster?: string;
  className?: string;
}

export function FeatureBanner({
  variant = "splitInline",
  theme = "light",
  eyebrow,
  title,
  description,
  supportingCopy,
  chips = [],
  actions = [],
  stats = [],
  icon,
  imageSrc,
  imageAlt = "",
  imagePriority = false,
  imagePosition = "center",
  videoSrc,
  videoPoster,
  className,
}: FeatureBannerProps) {
  const router = useRouter();

  const isCenter = variant === "center";
  const isSplitInline = variant === "splitInline";
  const isMinimal = variant === "minimal";
  const isSplit = variant === "split";

  const handleNavigation = (href: string) => {
    if (/^https?:\/\//i.test(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
  };

  return (
    <section className={cn(bannerVariants({ variant, theme }), className)}>
      {/* 🟢 1. Background Image Asset (Crisp & High Visibility) */}
      {imageSrc && !isMinimal && (
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden text-[0px]">
          <Image
            src={imageSrc}
            alt={imageAlt || "Banner background"}
            fill
            unoptimized
            priority={imagePriority}
            className="object-cover opacity-85 dark:opacity-70"
            style={{ objectPosition: imagePosition }}
          />
          {/* Subtle bottom fade to seamlessly blend into page background */}
          <div className="from-transparent via-background/20 to-background absolute inset-0 bg-gradient-to-b" />
        </div>
      )}

      {/* 🟢 2. Video Background */}
      {videoSrc && !isMinimal && (
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
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

      {/* 🟢 3. Glow & Grid (Fallback when no media) */}
      {!imageSrc && !videoSrc && !isMinimal && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="bg-primary/10 absolute top-0 left-1/2 h-44 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
      )}

      {/* 🟢 4. Main Banner Container */}
      <div className="container-custom relative z-10 w-full">
        <ScrollReveal className="w-full">
          <div
            className={cn(
              "flex w-full gap-8",
              isCenter && "mx-auto max-w-3xl flex-col items-center text-center",
              (variant === "stacked" || isMinimal) && "max-w-3xl flex-col items-start text-left",
              isSplit && "flex-col md:flex-row md:items-start md:justify-between text-left",
              isSplitInline && "grid grid-cols-1 md:grid-cols-2 items-start gap-8 lg:gap-12 text-left"
            )}
          >
            {/* 📝 Left Side: Eyebrow + Headline */}
            <div className={cn("flex flex-col gap-4", !isSplit && !isSplitInline ? "w-full" : "flex-1")}>
              {eyebrow && (
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase text-muted-foreground select-none backdrop-blur-md shadow-2xs">
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

              <h1 className="text-foreground font-sans text-2xl leading-[1.15] font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                {title}
              </h1>

              {!isSplitInline && (
                <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed sm:text-base">
                  {description}
                </p>
              )}

              {supportingCopy && !isSplitInline && (
                <p className="text-muted-foreground/80 max-w-xl text-xs leading-relaxed sm:text-sm">
                  {supportingCopy}
                </p>
              )}
            </div>

            {/* ⚡ Right Side: Description, Stats & Actions */}
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
                  <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                    {description}
                  </p>
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
                  {stats.slice(0, 4).map((stat) => (
                    <div key={`${stat.label}-${stat.value}`} className="flex flex-col">
                      <span className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                        {stat.value}
                      </span>
                      <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {chips.length > 0 && !isMinimal && (
                <div className={cn("flex flex-wrap gap-1.5", isSplit ? "md:justify-end" : "justify-start")}>
                  {chips.slice(0, 5).map((chip) => (
                    <Badge
                      key={chip}
                      variant="outline"
                      className="border-border/80 bg-background/80 text-muted-foreground hover:text-foreground cursor-default rounded-full px-3 py-0.5 text-[11px] font-semibold backdrop-blur-xs transition-all"
                    >
                      #{chip}
                    </Badge>
                  ))}
                </div>
              )}

              {actions.length > 0 && (
                <div
                  className={cn(
                    "flex flex-wrap gap-3 pt-1",
                    isCenter ? "justify-center" : "justify-start",
                    isSplit && "md:justify-end"
                  )}
                >
                  {actions.slice(0, 2).map((action) => {
                    const isPrimary = action.variant !== "secondary";
                    return (
                      <Button
                        key={`${action.label}-${action.href}`}
                        onClick={() => handleNavigation(action.href)}
                        className={cn(
                          "h-10 cursor-pointer rounded-full px-5 text-xs font-semibold tracking-wide transition-all duration-200 hover:-translate-y-0.5",
                          isPrimary
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
                            : "border-border/80 bg-background/90 text-foreground hover:bg-muted/60 border backdrop-blur-xs"
                        )}
                      >
                        <span>{action.label}</span>
                        {action.icon ? (
                          <span className="ml-2">{action.icon}</span>
                        ) : (
                          <span className="ml-1.5 opacity-70">→</span>
                        )}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}