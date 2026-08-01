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
  "relative isolate flex w-full items-center overflow-hidden border-b border-border/60 transition-all duration-300",
  {
    variants: {
      variant: {
        classic: "bg-background text-foreground py-12 sm:py-16 lg:py-20",
        glassmorphic: "bg-background/70 text-foreground backdrop-blur-xl py-12 sm:py-16 lg:py-20",
        brutalist:
          "my-4 border-b-4 border-border-strong bg-card shadow-md text-foreground py-10 sm:py-14",
        "gradient-glow": "bg-background text-foreground py-14 sm:py-20 relative overflow-hidden",
        minimal: "bg-background py-8 sm:py-12 text-foreground",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

interface FeatureDetailsBannerProps extends VariantProps<typeof bannerVariants> {
  backHref: string;
  backLabel?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  stats?: { label: string; value: string }[];
  badges?: string[];
  imageSrc?: string;
  imageAlt?: string;
  videoSrc?: string;
  imagePosition?: string;
  children?: ReactNode;
  className?: string;
}

export function FeatureDetailsBanner({
  variant = "classic",
  backHref,
  backLabel = "Back",
  eyebrow,
  title,
  description,
  stats = [],
  badges = [],
  imageSrc,
  imageAlt = "Details asset thumbnail",
  videoSrc,
  imagePosition = "center",
  children,
  className,
}: FeatureDetailsBannerProps) {
  const router = useRouter();

  const isMinimal = variant === "minimal";
  const isBrutalist = variant === "brutalist";
  const isGlass = variant === "glassmorphic";
  const isGlow = variant === "gradient-glow";

  return (
    <section className={cn(bannerVariants({ variant }), className)}>
      {/* 🟢 1. Media Assets Layer (Image / Video with Dark Gradient Blend) */}
      {(videoSrc || imageSrc) && !isMinimal && (
        <>
          {videoSrc ? (
            <video
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className={cn(
                "absolute inset-0 h-full w-full object-cover opacity-20 transition-all duration-700 select-none dark:opacity-30",
                isBrutalist && "opacity-100 contrast-125 grayscale"
              )}
              style={{ objectPosition: imagePosition }}
            />
          ) : (
            imageSrc && (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="100vw"
                className={cn(
                  "object-cover opacity-20 transition-all duration-700 select-none dark:opacity-30",
                  isBrutalist && "opacity-100 contrast-125 grayscale"
                )}
                style={{ objectPosition: imagePosition }}
              />
            )
          )}
          <div className="from-background/40 via-background/80 to-background pointer-events-none absolute inset-0 bg-gradient-to-b" />
        </>
      )}

      {/* 🟢 2. Vercel Ambient Radial Glow & Grid Mesh Background */}
      {(isGlow || variant === "classic") && !imageSrc && !videoSrc && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="bg-primary/10 absolute top-0 right-1/4 h-56 w-96 -translate-y-1/2 rounded-full blur-3xl" />
          <div className="bg-primary/5 absolute bottom-0 left-1/4 h-48 w-72 translate-y-1/2 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
      )}

      {/* 🟢 3. Main Content Container */}
      <div className="container-custom relative z-10 w-full">
        <ScrollReveal className="w-full">
          <div
            className={cn(
              "grid grid-cols-1 gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12 xl:gap-14",
              isGlow || isGlass ? "items-center" : "items-end"
            )}
          >
            {/* Left Header Column */}
            <div className="max-w-3xl space-y-3.5 text-left">
              {/* Back Navigation Button */}
              <Button
                variant="ghost"
                onClick={() => router.push(backHref)}
                className={cn(
                  "group hover:bg-muted/60 text-muted-foreground hover:text-foreground -ml-2.5 h-8 cursor-pointer rounded-full px-3 text-xs font-semibold tracking-wide transition-all",
                  isBrutalist &&
                    "bg-card text-foreground hover:bg-muted border-border-strong rounded-none border-2 shadow-md"
                )}
              >
                <span className="inline-flex items-center">
                  <ArrowLeft className="text-primary mr-1.5 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                  {backLabel}
                </span>
              </Button>

              {/* Eyebrow and Badges Row */}
              {(eyebrow || badges.length > 0) && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {eyebrow && (
                    <Badge
                      className={cn(
                        "px-3 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-2xs",
                        isBrutalist
                          ? "text-foreground border-border-strong bg-info rounded-none border-2 shadow-md"
                          : "bg-primary/10 text-primary border-primary/20 border"
                      )}
                    >
                      {eyebrow}
                    </Badge>
                  )}
                  {badges.map((badge) => (
                    <Badge
                      key={badge}
                      variant="outline"
                      className={cn(
                        "border-border/80 bg-muted/30 text-muted-foreground rounded-full px-3 py-0.5 text-[11px] font-semibold",
                        isBrutalist &&
                          "bg-card text-foreground border-border-strong rounded-none border-2"
                      )}
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Main Headline */}
              <h1
                className={cn(
                  "text-foreground text-2xl leading-[1.15] font-extrabold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl",
                  isGlow &&
                    "from-foreground via-foreground/90 to-foreground/60 bg-gradient-to-b bg-clip-text text-transparent",
                  isBrutalist && "font-mono text-3xl uppercase sm:text-4xl"
                )}
              >
                {title}
              </h1>

              {/* Sub-description */}
              {description && (
                <p className="text-muted-foreground max-w-2xl text-xs leading-relaxed font-normal sm:text-sm md:text-base">
                  {description}
                </p>
              )}

              {children && <div className="pt-2">{children}</div>}
            </div>

            {/* Right Stats Card Column (Vercel Glass Panel Style) */}
            {stats.length > 0 && (
              <div
                className={cn(
                  "border-border/80 bg-card/40 grid grid-cols-2 gap-4 rounded-2xl border p-5 shadow-2xs backdrop-blur-md lg:pl-6",
                  isBrutalist &&
                    "text-foreground border-border-strong bg-card rounded-none border-2 p-6 font-mono shadow-md"
                )}
              >
                {stats.slice(0, 4).map((stat, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-foreground text-xl leading-none font-bold tracking-tight sm:text-2xl">
                      {stat.value}
                    </p>
                    <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
