"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronRight, ChevronLeft, Pause, Play, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import { useActiveHero } from "../hooks/useHero";

const AUTO_CHANGE_MS = 6 * 1000;

type HeroSlide = {
  id?: number | string;
  slug?: string;
  badge?: string | null;
  title?: string | null;
  shortDesc?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  secondaryCtaText?: string | null;
  secondaryCtaLink?: string | null;
  heroVideoUrl?: string | null;
  heroImage?: string | null;
};

function isExternalLink(value: string) {
  return /^https?:\/\//i.test(value);
}

function getHeroKey(hero: HeroSlide, index: number) {
  return `${String(hero.id ?? hero.slug ?? "hero")}-${index}`;
}

function normalizeHeroes(payload: unknown): HeroSlide[] {
  if (Array.isArray(payload)) return payload as HeroSlide[];
  if (!payload || typeof payload !== "object") return [];
  const record = payload as { data?: unknown; results?: unknown; items?: unknown };
  const nestedList = record.data ?? record.results ?? record.items;
  if (Array.isArray(nestedList)) return nestedList as HeroSlide[];
  return [payload as HeroSlide];
}

// 🟢 ফিক্সড ১: min-h-[100vh] এর জায়গায় min-h-[calc(100vh-4rem)] সেট করা হলো
const heroSectionVariants = cva(
  "relative isolate flex min-h-[calc(100vh-4rem)] w-full items-center overflow-hidden transition-colors duration-300",
  {
    variants: {
      variant: {
        classic: "bg-background text-foreground",
        glassmorphic: "bg-background/80 text-foreground backdrop-blur-xs",
        brutalist: "bg-card border-b-4 border-border-strong text-foreground",
        "gradient-glow": "bg-black text-background shadow-inset-bottom",
        minimal: "bg-background text-foreground",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

const overlayVariants = cva("absolute inset-0 -z-10 transition-all duration-300", {
  variants: {
    variant: {
      classic: "bg-gradient-to-r from-black/60 via-black/35 to-transparent",
      glassmorphic: "bg-gradient-to-r from-black/70 via-black/40 to-transparent backdrop-blur-3xs",
      brutalist: "bg-transparent",
      "gradient-glow": "bg-gradient-to-r from-black/70 via-black/30 to-transparent",
      minimal: "bg-gradient-to-r from-black/50 to-transparent",
    },
  },
  defaultVariants: {
    variant: "classic",
  },
});

function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || isVisible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      ].join(" ")}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export interface HeroPreviewSectionProps extends VariantProps<typeof heroSectionVariants> {}

export function HeroPreviewSection({ variant = "classic" }: HeroPreviewSectionProps) {
  const { data, isLoading, error } = useActiveHero();
  const router = useRouter();

  const heroes = useMemo(() => normalizeHeroes(data?.data ?? data), [data]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const safeIndex = activeIndex >= heroes.length ? 0 : Math.max(activeIndex, 0);
  const activeHero = heroes[safeIndex];
  const activeHeroKey = activeHero ? getHeroKey(activeHero, safeIndex) : "";
  const isAutoPaused = isManuallyPaused || isHovered;

  const goToSlide = useCallback(
    (index: number) => {
      if (!heroes.length) return;
      setActiveIndex(index);
    },
    [heroes.length]
  );

  const goNext = useCallback(() => {
    if (heroes.length <= 1) return;
    setActiveIndex((current) => (current >= heroes.length - 1 ? 0 : current + 1));
  }, [heroes.length]);

  const goPrevious = useCallback(() => {
    if (heroes.length <= 1) return;
    setActiveIndex((current) => (current <= 0 ? heroes.length - 1 : current - 1));
  }, [heroes.length]);

  const handleCtaClick = useCallback(
    (url: string) => {
      if (!url) return;
      if (isExternalLink(url)) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        router.push(url);
      }
    },
    [router]
  );

  useEffect(() => {
    setActiveIndex((current) => {
      if (!heroes.length) return 0;
      return current >= heroes.length ? 0 : current;
    });
  }, [heroes.length]);

  useEffect(() => {
    if (heroes.length <= 1 || isAutoPaused) return;
    const timer = window.setTimeout(goNext, AUTO_CHANGE_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, goNext, heroes.length, isAutoPaused]);

  if (isLoading) {
    return (
      <section className="bg-background relative w-full py-20 md:py-28">
        <div className="container-custom mx-auto w-full space-y-6 px-4 sm:px-6">
          <Skeleton className="h-5 w-40 rounded-full" />
          <Skeleton className="h-12 w-full max-w-xl rounded-lg" />
          <Skeleton className="h-8 w-full max-w-lg rounded-lg" />
          <div className="flex gap-4 pt-2">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !heroes.length || !activeHero) return null;

  const hasCta = Boolean(activeHero.ctaText && activeHero.ctaLink);
  const hasSecondaryCta = Boolean(activeHero.secondaryCtaText && activeHero.secondaryCtaLink);
  const isBrutalist = variant === "brutalist";

  return (
    <section
      aria-label="Featured showcase canvas"
      className={heroSectionVariants({ variant })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 -z-20 h-full w-full overflow-hidden select-none">
        {activeHero.heroVideoUrl ? (
          <video
            key={`video-${activeHeroKey}`}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full scale-[1.01] object-cover brightness-[0.85] transition-all duration-1000"
          >
            <source src={activeHero.heroVideoUrl} type="video/mp4" />
          </video>
        ) : activeHero.heroImage ? (
          <div
            key={`image-${activeHeroKey}`}
            className="animate-in fade-in zoom-in-95 absolute inset-0 h-full w-full transition-all duration-1000"
          >
            <Image
              src={activeHero.heroImage}
              alt={activeHero.title || "Hero banner"}
              fill
              priority
              unoptimized
              className="object-cover object-center brightness-[0.85]"
            />
          </div>
        ) : null}
      </div>

      <div
        className={`absolute inset-0 -z-10 ${variant === "gradient-glow" ? "bg-[radial-gradient(circle_at_15%_30%,hsl(var(--primary)/0.15),transparent_50%)]" : "bg-[radial-gradient(circle_at_15%_30%,hsl(var(--primary)/0.06),transparent_50%)]"}`}
      />

      <div className={overlayVariants({ variant })} />

      {/* 🟢 ফিক্সড ২: py-24 sm:py-32 lg:py-40 এর বদলে py-12 sm:py-16 lg:py-20 ব্যবহার করা হলো */}
      <div className="container-custom relative z-10 mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <ScrollReveal
          key={`content-${activeHeroKey}`}
          className="flex w-full max-w-2xl flex-col items-start text-left xl:max-w-3xl"
        >
          {activeHero.badge ? (
            <div
              className={`animate-in fade-in slide-in-from-top-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black tracking-[0.2em] uppercase shadow-2xs backdrop-blur-md duration-300 ${
                isBrutalist
                  ? "bg-card text-foreground border-border-strong border-2 font-mono shadow-md"
                  : "border border-white/15 bg-white/10 font-semibold text-white"
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-80" />
                <span className="bg-primary relative inline-flex h-2 w-2 rounded-full" />
              </span>
              {activeHero.badge}
            </div>
          ) : null}

          {activeHero.title ? (
            <h1
              className={cn(
                "drop-shadow-hero mt-6 max-w-xl text-3xl leading-[1.15] font-black tracking-tight text-white sm:text-4xl lg:text-5xl xl:max-w-2xl xl:text-5xl 2xl:text-5xl",
                isBrutalist &&
                  "shadow-brand border-border-strong bg-warning text-foreground border-2 p-4 font-mono uppercase drop-shadow-none"
              )}
            >
              {activeHero.title}
            </h1>
          ) : null}

          {activeHero.shortDesc ? (
            <p
              className={cn(
                "drop-shadow-hero-sm mt-4 max-w-xl text-sm leading-relaxed font-medium text-white/85 opacity-95 sm:text-base",
                isBrutalist &&
                  "bg-card text-foreground shadow-brand border-border-strong border-2 p-4 font-mono drop-shadow-none"
              )}
            >
              {activeHero.shortDesc}
            </p>
          ) : null}

          {hasCta || hasSecondaryCta ? (
            <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
              {hasCta ? (
                <Button
                  onClick={() => handleCtaClick(activeHero.ctaLink!)}
                  className={cn(
                    "h-10 px-5 text-xs font-bold tracking-wider uppercase shadow-sm transition-all hover:cursor-pointer active:scale-98",
                    isBrutalist
                      ? "shadow-brand border-border-strong bg-info hover:bg-info/80 text-foreground rounded-none border-2 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                      : "hover:bg-primary/90 rounded-md"
                  )}
                >
                  {activeHero.ctaText}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 shrink-0" />
                </Button>
              ) : null}

              {hasSecondaryCta ? (
                <Button
                  variant={isBrutalist ? "default" : "outline"}
                  onClick={() => handleCtaClick(activeHero.secondaryCtaLink!)}
                  className={cn(
                    "h-10 px-5 text-xs font-bold tracking-wider uppercase transition-all hover:cursor-pointer active:scale-98",
                    isBrutalist
                      ? "bg-card text-foreground shadow-brand hover:bg-surface-elevated border-border-strong rounded-none border-2 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                      : "rounded-md border-white/20 bg-white/5 text-white backdrop-blur-xs hover:bg-white/15"
                  )}
                >
                  {activeHero.secondaryCtaText}
                </Button>
              ) : null}
            </div>
          ) : null}

          {heroes.length > 1 ? (
            <div className="mt-12 flex flex-wrap items-center gap-3.5 select-none">
              <Button
                variant={isBrutalist ? "default" : "outline"}
                size="icon"
                aria-label={isManuallyPaused ? "Resume rotation" : "Pause rotation"}
                onClick={() => setIsManuallyPaused((value) => !value)}
                className={`border-border h-8 w-8 hover:cursor-pointer ${isBrutalist ? "border-border-strong rounded-none border-2 shadow-md" : "rounded-md border-white/10 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"}`}
              >
                {isManuallyPaused ? (
                  <Play className="h-3.5 w-3.5" />
                ) : (
                  <Pause className="h-3.5 w-3.5" />
                )}
              </Button>

              <div className="flex items-center gap-2" role="tablist" aria-label="Slides">
                {heroes.map((hero, index) => {
                  const status = index === safeIndex;
                  return (
                    <button
                      key={getHeroKey(hero, index)}
                      type="button"
                      aria-label={`Slide ${index + 1}`}
                      aria-current={status ? "true" : "false"}
                      onClick={() => goToSlide(index)}
                      className={[
                        "h-1 transition-all duration-500 hover:cursor-pointer",
                        isBrutalist
                          ? status
                            ? "bg-foreground w-6"
                            : "bg-surface-elevated w-1"
                          : status
                            ? "bg-primary w-6"
                            : "w-1 bg-white/20 hover:bg-white/40",
                        isBrutalist ? "rounded-none" : "rounded-full",
                      ].join(" ")}
                    />
                  );
                })}
              </div>

              <span
                className={`font-mono text-xs font-semibold tracking-wider ${isBrutalist ? "text-foreground" : "text-white/70"}`}
              >
                {String(safeIndex + 1).padStart(2, "0")} / {String(heroes.length).padStart(2, "0")}
              </span>

              <div className="ml-1 flex items-center gap-1.5">
                <Button
                  variant={isBrutalist ? "default" : "outline"}
                  size="icon"
                  onClick={goPrevious}
                  aria-label="Previous slide"
                  className={`border-border h-8 w-8 hover:cursor-pointer ${isBrutalist ? "border-border-strong rounded-none border-2 shadow-md" : "rounded-md border-white/10 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  variant={isBrutalist ? "default" : "outline"}
                  size="icon"
                  onClick={goNext}
                  aria-label="Next slide"
                  className={`border-border h-8 w-8 hover:cursor-pointer ${isBrutalist ? "border-border-strong rounded-none border-2 shadow-md" : "rounded-md border-white/10 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"}`}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </ScrollReveal>
      </div>
    </section>
  );
}
