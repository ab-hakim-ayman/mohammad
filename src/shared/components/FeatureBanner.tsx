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
  "relative isolate flex w-full items-center overflow-hidden transition-all duration-300 border-b border-border/60",
  {
    variants: {
      variant: {
        classic: "bg-background text-foreground py-14 sm:py-20 lg:py-24",
        glassmorphic: "bg-background/70 text-foreground backdrop-blur-xl py-14 sm:py-20 lg:py-24",
        brutalist:
          "my-4 border-4 border-border-strong bg-card shadow-md text-foreground py-12 sm:py-16",
        "gradient-glow": "bg-background text-foreground py-16 sm:py-24 relative overflow-hidden",
        minimal: "bg-background py-10 sm:py-14 text-foreground",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

interface FeatureBannerProps extends VariantProps<typeof bannerVariants> {
  eyebrow: string;
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
  variant = "classic",
  eyebrow,
  title,
  description,
  supportingCopy,
  chips = [],
  actions = [],
  stats = [],
  icon,
  imageSrc,
  imageAlt = "Feature listing banner",
  imagePriority = false,
  imagePosition = "center",
  videoSrc,
  videoPoster,
  className,
}: FeatureBannerProps) {
  const router = useRouter();

  const isMinimal = variant === "minimal";
  const isBrutalist = variant === "brutalist";
  const isGlass = variant === "glassmorphic";
  const isGlow = variant === "gradient-glow";

  const handleNavigation = (href: string) => {
    if (/^https?:\/\//i.test(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
    } else {
      router.push(href);
    }
  };

  return (
    <section className={cn(bannerVariants({ variant }), className)}>
      {/* 🟢 1. Background Image Asset */}
      {imageSrc && !isMinimal && (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority={imagePriority}
            sizes="100vw"
            className={cn(
              "object-cover opacity-20 transition-all duration-500 select-none dark:opacity-30",
              isBrutalist && "opacity-100 contrast-125 grayscale"
            )}
            style={{ objectPosition: imagePosition }}
          />
          <div className="from-background/40 via-background/80 to-background absolute inset-0 bg-gradient-to-b" />
        </>
      )}

      {/* 🟢 2. Video Background */}
      {videoSrc && !isMinimal && (
        <>
          <video
            src={videoSrc}
            poster={videoPoster}
            autoPlay
            muted
            loop
            playsInline
            className={cn(
              "absolute inset-0 h-full w-full object-cover opacity-20 select-none dark:opacity-30",
              isBrutalist && "opacity-100 contrast-125 grayscale"
            )}
            style={{ objectPosition: imagePosition }}
          />
          <div className="from-background/40 via-background/80 to-background absolute inset-0 bg-gradient-to-b" />
        </>
      )}

      {/* 🟢 3. Vercel Style Glow & Subtle Grid Background */}
      {(isGlow || variant === "classic") && !imageSrc && !videoSrc && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="bg-primary/10 absolute top-0 left-1/2 h-56 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
      )}

      {/* 🟢 4. Main Hero Content Container */}
      <div className="container-custom relative z-10 w-full">
        <ScrollReveal className="w-full">
          <div
            className={cn(
              "flex w-full max-w-3xl flex-col gap-4",
              isBrutalist || isGlass ? "items-start text-left" : "mx-auto items-center text-center"
            )}
          >
            {/* Eyebrow Label Pill */}
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-[11px] font-bold tracking-widest uppercase transition-all select-none",
                isMinimal
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : isBrutalist
                    ? "text-foreground border-border-strong bg-warning rounded-none border-2 shadow-md"
                    : "bg-muted/40 border-border/80 text-primary shadow-2xs backdrop-blur-md"
              )}
            >
              {icon ? (
                <span className="text-primary flex h-3.5 w-3.5 items-center justify-center">
                  {icon}
                </span>
              ) : (
                <span className="bg-primary h-1.5 w-1.5 rounded-full" />
              )}
              <span>{eyebrow}</span>
            </div>

            {/* Main Headline */}
            <h1
              className={cn(
                "text-foreground text-2xl leading-[1.15] font-extrabold tracking-tight sm:text-4xl lg:text-5xl",
                isGlow &&
                  "from-foreground via-foreground/90 to-foreground/60 bg-gradient-to-b bg-clip-text text-transparent",
                isBrutalist && "font-mono text-3xl uppercase sm:text-4xl"
              )}
            >
              {title}
            </h1>

            {/* Lead Description */}
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed sm:text-base">
              {description}
            </p>

            {supportingCopy && (
              <p className="text-muted-foreground/80 max-w-xl text-xs leading-relaxed sm:text-sm">
                {supportingCopy}
              </p>
            )}

            {/* Stats Row */}
            {stats.length > 0 && !isMinimal && (
              <div
                className={cn(
                  "border-border/60 mt-2 flex w-full max-w-xl flex-wrap gap-x-8 gap-y-3 border-t pt-4",
                  isBrutalist || isGlass ? "justify-start" : "justify-center"
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

            {/* Chips & Tags */}
            {chips.length > 0 && !isMinimal && (
              <div
                className={cn(
                  "flex flex-wrap gap-1.5 pt-2",
                  isBrutalist || isGlass ? "justify-start" : "justify-center"
                )}
              >
                {chips.slice(0, 5).map((chip) => (
                  <Badge
                    key={chip}
                    variant="outline"
                    className="border-border/80 bg-muted/30 text-muted-foreground hover:text-foreground cursor-default rounded-full px-3 py-0.5 text-[11px] font-semibold transition-all"
                  >
                    #{chip}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons Toolbar */}
            {actions.length > 0 && (
              <div
                className={cn(
                  "flex w-full flex-wrap gap-3 pt-4",
                  isBrutalist || isGlass ? "justify-start" : "justify-center"
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
                          : "border-border/80 bg-background text-foreground hover:bg-muted/60 border"
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
        </ScrollReveal>
      </div>
    </section>
  );
}
