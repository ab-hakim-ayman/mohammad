"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, MutableRefObject, TouchEvent } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PreviewSectionHeader } from "@/shared/components";
import { Link } from "@/shared/i18n";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import { usePublishedCaseStudies } from "../hooks/useCaseStudy";
import { CaseStudy } from "../types/case-study.types";

const sectionVariants = cva(
  "relative w-full transition-all duration-300 border overflow-hidden flex justify-center items-center mx-auto",
  {
    variants: {
      variant: {
        classic: "bg-background text-foreground border-border shadow-2xs",
        glassmorphic:
          "bg-background/80 text-foreground backdrop-blur-md border-border shadow-xs",
        minimal: "bg-transparent text-foreground border-0 shadow-none py-0",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

const containerVariants = cva("container-custom flex flex-col justify-center items-center", {
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
});

const SELECTOR_ITEM_HEIGHT = 70;
const SELECTOR_RADIUS = 3;
const AUTOPLAY_DELAY = 5800;
const INTERACTION_IDLE_MS = 4800;
const CONTENT_SWAP_DELAY = 140;

function stripHtml(input: string | null | undefined) {
  return (input || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getWrappedIndex(index: number, total: number) {
  return ((index % total) + total) % total;
}

function getRelativeDistance(index: number, activeIndex: number, total: number) {
  const raw = index - activeIndex;
  const alternative = raw > 0 ? raw - total : raw + total;
  return Math.abs(raw) <= Math.abs(alternative) ? raw : alternative;
}

function clearTimer(timerRef: MutableRefObject<number | null>) {
  if (timerRef.current) {
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);
  return prefersReducedMotion;
}

function getSelectorItemPresentation(distance: number) {
  const abs = Math.abs(distance);
  const isActive = distance === 0;
  const translateY = distance * SELECTOR_ITEM_HEIGHT;

  return {
    isActive,
    isVisible: abs <= SELECTOR_RADIUS,
    opacity: isActive ? 1 : abs === 1 ? 0.5 : abs === 2 ? 0.23 : 0.1,
    fontSize: isActive
      ? "clamp(1.35rem, 1.8vw, 1.85rem)"
      : abs === 1
        ? "clamp(1rem, 1.4vw, 1.15rem)"
        : "clamp(0.9rem, 1.1vw, 1rem)",
    lineHeight: isActive ? 1.05 : 1.12,
    transform: `translateY(calc(-50% + ${translateY}px)) scale(${isActive ? 1 : abs === 1 ? 0.9 : abs === 2 ? 0.82 : 0.76})`,
  };
}

function CaseStudyPreviewSkeleton() {
  return (
    <section className="bg-background text-foreground relative isolate flex w-full items-center justify-center overflow-hidden py-12 sm:py-16 lg:py-20 3xl:py-24 5xl:py-32">
      <div className="container-custom flex flex-col items-center">
        <div className="bg-foreground/5 mb-10 h-20 w-full animate-pulse rounded-xl" />
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_0.7fr_1.3fr] 3xl:grid-cols-5 5xl:grid-cols-8">
          <div className="bg-foreground/5 h-[360px] w-full animate-pulse rounded-xl" />
          <div className="bg-foreground/5 h-[360px] w-full animate-pulse rounded-xl" />
          <div className="bg-foreground/5 h-[360px] w-full animate-pulse rounded-xl" />
        </div>
      </div>
    </section>
  );
}

interface CaseStudyPreviewSectionProps
  extends VariantProps<typeof sectionVariants>, VariantProps<typeof containerVariants> {
  limit?: number;
}

export function CaseStudyPreviewSection({
  limit = 6,
  variant,
  size,
}: CaseStudyPreviewSectionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const { data, isLoading, error } = usePublishedCaseStudies({ page: 1, limit });
  const caseStudies = useMemo(
    () => [...(data?.data?.data || [])].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured)),
    [data?.data?.data]
  );

  const total = caseStudies.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusedWithin, setIsFocusedWithin] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);

  const sectionRef = useRef<HTMLElement | null>(null);
  const selectorRef = useRef<HTMLDivElement | null>(null);
  const interactionTimeoutRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const contentSwapTimeoutRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const markUserInteracted = useCallback(() => {
    setIsUserPaused(true);
    clearTimer(interactionTimeoutRef);
    interactionTimeoutRef.current = window.setTimeout(() => {
      setIsUserPaused(false);
      interactionTimeoutRef.current = null;
    }, INTERACTION_IDLE_MS);
  }, []);

  const beginSelection = useCallback(
    (nextIndex: number, cause: "user" | "auto" = "user") => {
      if (total <= 1 || isTransitioning) return;

      const wrappedIndex = getWrappedIndex(nextIndex, total);
      if (wrappedIndex === activeIndex && wrappedIndex === displayIndex) return;

      if (cause === "user") markUserInteracted();

      clearTimer(contentSwapTimeoutRef);
      clearTimer(transitionTimeoutRef);

      setIsTransitioning(true);
      setIsPanelVisible(false);
      setActiveIndex(wrappedIndex);

      const contentDelay = prefersReducedMotion ? 0 : CONTENT_SWAP_DELAY;
      const transitionDelay = prefersReducedMotion ? 0 : 620;

      contentSwapTimeoutRef.current = window.setTimeout(() => {
        setDisplayIndex(wrappedIndex);
        setIsPanelVisible(true);
        contentSwapTimeoutRef.current = null;
      }, contentDelay);

      transitionTimeoutRef.current = window.setTimeout(() => {
        setIsTransitioning(false);
        transitionTimeoutRef.current = null;
      }, transitionDelay);
    },
    [activeIndex, displayIndex, isTransitioning, markUserInteracted, prefersReducedMotion, total]
  );

  const handlePrevious = useCallback(
    () => beginSelection(activeIndex - 1),
    [activeIndex, beginSelection]
  );
  const handleNext = useCallback(
    () => beginSelection(activeIndex + 1),
    [activeIndex, beginSelection]
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const handleVisibilityChange = () => setIsDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const shouldAutoplay =
    total > 1 &&
    !prefersReducedMotion &&
    !isHovered &&
    !isFocusedWithin &&
    !isUserPaused &&
    isInView &&
    isDocumentVisible &&
    !isTransitioning;

  useEffect(() => {
    if (!shouldAutoplay) return;
    const timer = window.setTimeout(() => beginSelection(activeIndex + 1, "auto"), AUTOPLAY_DELAY);
    return () => window.clearTimeout(timer);
  }, [activeIndex, beginSelection, shouldAutoplay]);

  const handleWheel = useCallback(
    (event: globalThis.WheelEvent) => {
      if (Math.abs(event.deltaY) < 14) return;
      event.preventDefault();
      if (event.deltaY > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    },
    [handleNext, handlePrevious]
  );

  useEffect(() => {
    const selectorNode = selectorRef.current;
    if (!selectorNode) return;
    const onWheel = (e: globalThis.WheelEvent) => handleWheel(e);
    selectorNode.addEventListener("wheel", onWheel, { passive: false });
    return () => selectorNode.removeEventListener("wheel", onWheel);
  }, [handleWheel]);

  const handleSelectorKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        handleNext();
      }
    },
    [handleNext, handlePrevious]
  );

  const handleItemKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        handleNext();
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        beginSelection(index);
      }
    },
    [beginSelection, handleNext, handlePrevious]
  );

  const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (touch) touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const start = touchStartRef.current;
      const touch = event.changedTouches[0];
      touchStartRef.current = null;
      if (!start || !touch || isTransitioning) return;

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      if (Math.abs(deltaY) < 34 || Math.abs(deltaY) < Math.abs(deltaX)) return;

      if (deltaY < 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    },
    [handleNext, handlePrevious, isTransitioning]
  );

  if (isLoading) return <CaseStudyPreviewSkeleton />;
  if (error || total === 0) return null;

  const displayedCaseStudy = caseStudies[displayIndex] || caseStudies[0];
  const summary =
    stripHtml(displayedCaseStudy.shortDesc);
  const fallbackImage = caseStudies.find((c) => c.cardImage)?.cardImage || null;

  return (
    <section
      ref={sectionRef}
      className={cn("w-full overflow-x-hidden", sectionVariants({ variant }))}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocusedWithin(true)}
      onBlurCapture={(e) => {
        const next = e.relatedTarget;
        if (next instanceof Node && e.currentTarget.contains(next)) return;
        setIsFocusedWithin(false);
      }}
    >
      <div className={containerVariants({ size })}>
        { }
        <div className="flex w-full flex-col items-center justify-center text-center">
          <PreviewSectionHeader
            variant="center"
            eyebrow="Case Studies"
            title="Success Stories"
            description="Discover how we've helped businesses achieve their goals."
            href="/case-studies"
            ctaLabel="Check All Industries"
          />
        </div>

        { }
        <div className="mx-auto mt-12 box-border grid w-full grid-cols-1 items-center justify-center gap-8 lg:grid-cols-[1fr_0.7fr_1.3fr] 3xl:grid-cols-5 5xl:grid-cols-8">
          { }
          <div className="order-1 flex w-full justify-center">
            <div className="border-border bg-card shadow-3xs relative aspect-[4/3] min-h-[220px] w-full max-w-[340px] overflow-hidden rounded-none sm:rounded-lg border sm:max-w-none lg:min-h-[320px] xl:min-h-[350px]">
              {displayedCaseStudy.cardImage || fallbackImage ? (
                <Image
                  key={displayedCaseStudy.id}
                  src={displayedCaseStudy.cardImage || fallbackImage || "/next.svg"}
                  alt={displayedCaseStudy.title}
                  fill
                  unoptimized
                  className={cn(
                    "object-cover transition-all duration-[560ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isPanelVisible ? "scale-100 opacity-100" : "scale-103 opacity-0"
                  )}
                />
              ) : (
                <div className="bg-surface-elevated text-foreground absolute inset-0 flex items-center justify-center select-none">
                  <span className="text-muted-foreground/50 text-xs font-black tracking-[0.2em]">
                    <I18n>A2I CODERS</I18n>
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4">
                <span className="text-background rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-bold tracking-wider uppercase backdrop-blur-xs">
                  {displayedCaseStudy.isFeatured ? "Featured" : "Standard"}
                </span>
                {displayedCaseStudy.project?.client?.title && (
                  <span className="text-background/90 max-w-28 truncate rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
                    {displayedCaseStudy.project.client.title}
                  </span>
                )}
              </div>
            </div>
          </div>

          { }
          <div className="order-3 flex w-full justify-center lg:order-2">
            <div
              ref={selectorRef}
              className="relative h-[220px] w-full max-w-[280px] overscroll-contain outline-hidden sm:h-[260px] lg:h-[320px] lg:max-w-none xl:h-[350px]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onKeyDown={handleSelectorKeyDown}
              tabIndex={0}
              aria-label="Case study industry selector"
            >
              <div className="from-background pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b to-transparent" />
              <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t to-transparent" />

              <div className="relative flex h-full w-full items-center overflow-hidden">
                {caseStudies.map((caseStudy, index) => {
                  const distance = getRelativeDistance(index, activeIndex, total);
                  const presentation = getSelectorItemPresentation(distance);
                  if (!presentation.isVisible) return null;

                  return (
                    <button
                      key={caseStudy.id}
                      type="button"
                      onClick={() => beginSelection(index)}
                      onKeyDown={(e) => handleItemKeyDown(e, index)}
                      tabIndex={0}
                      className={cn(
                        "absolute top-1/2 right-0 left-0 mx-auto w-full cursor-pointer text-center transition-all duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-hidden",
                        presentation.isActive
                          ? "text-foreground font-bold"
                          : "text-muted-foreground/60"
                      )}
                      style={{
                        opacity: presentation.opacity,
                        transform: presentation.transform,
                      }}
                      aria-current={presentation.isActive ? "true" : undefined}
                    >
                      <span
                        className="inline-block max-w-full px-2 text-center text-xs font-bold tracking-tight uppercase sm:text-sm"
                        style={{ lineHeight: presentation.lineHeight }}
                      >
                        {caseStudy.project?.industry?.title || caseStudy.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          { }
          <div className="order-2 flex w-full justify-center text-left lg:order-3 lg:justify-start">
            <div
              className={cn(
                "box-border flex min-h-[220px] w-full flex-col justify-center transition-all duration-[460ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:min-h-[320px] xl:min-h-[350px]",
                isPanelVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              )}
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="border-border bg-surface-elevated text-foreground rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase">
                  {displayedCaseStudy.project?.industry?.title || "Case Study"}
                </span>
                {displayedCaseStudy.project?.technologies?.[0] && (
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase">
                    {displayedCaseStudy.project.technologies[0].title}
                  </span>
                )}
              </div>

              <h3 className="text-foreground mt-4 font-sans text-xl leading-tight font-bold tracking-tight sm:text-2xl lg:text-3xl">
                {displayedCaseStudy.title}
              </h3>

              {displayedCaseStudy.project?.client?.title && (
                <p className="text-muted-foreground/80 mt-1.5 text-xs font-semibold">
                  <I18n>Client:</I18n> {displayedCaseStudy.project.client.title}
                </p>
              )}

              { }
              <p className="text-foreground/80 mt-4 max-w-xl text-xs leading-relaxed font-medium sm:text-sm">
                {summary}
              </p>

              { }
              {(displayedCaseStudy.project?.technologies?.length ?? 0) > 1 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {displayedCaseStudy.project?.technologies?.slice(1, 6).map((tech) => (
                    <span
                      key={tech.id}
                      className="border-border bg-surface-elevated/60 text-foreground rounded-full border px-3 py-0.5 text-xs font-medium"
                    >
                      {tech.title}
                    </span>
                  ))}
                </div>
              )}

              { }
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href={`/case-studies/${displayedCaseStudy.slug}`}
                  className="border-border bg-background text-foreground shadow-3xl inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <span>
                    <>
                      <I18n>Read Case Study</I18n>
                    </>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/case-studies"
                  className="group/btn text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-bold transition-colors"
                >
                  <span>
                    <I18n>All case studies</I18n>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}