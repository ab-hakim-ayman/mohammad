"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, TouchEvent } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink, Plus, Award } from "lucide-react";
import { PreviewSectionHeader } from "@/shared/components";
import { cn } from "@/lib/utils";
import { Link } from "@/shared/i18n";
import I18n from "@/shared/components/I18n";
import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublishedAchievements } from "../hooks/useAchievement";
import { Achievement } from "../types/achievement.types";

export type AchievementVariant =
  "classic" | "glassmorphic" | "brutalist" | "gradient-glow" | "minimal";

interface AchievementPreviewSectionProps {
  limit?: number;
  variant?: AchievementVariant;
}

const TRANSITION_MS = 680;
const TRANSITION_EASING = "cubic-bezier(0.25, 1, 0.5, 1)";

// 🔧 বড় স্ক্রিনে পারফেক্ট 3D ব্যালেন্সের জন্য ডিসটেন্স টোকেন অপ্টিমাইজড
const SIDE_CARD_DISTANCE = "clamp(15rem, 16vw, 19rem)";
const OUTER_CARD_DISTANCE = "clamp(30rem, 32vw, 38rem)";

function formatDate(value: Date | string | null | undefined, locale: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
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

function isImageLike(value: string | null | undefined) {
  if (!value) return false;
  return /^(https?:\/\/|\/)/i.test(value);
}

function getWrappedIndex(index: number, total: number) {
  return ((index % total) + total) % total;
}

function getRelativeDistance(index: number, activeIndex: number, total: number) {
  const raw = index - activeIndex;
  const alternative = raw > 0 ? raw - total : raw + total;
  return Math.abs(raw) <= Math.abs(alternative) ? raw : alternative;
}

function getAchievementYear(achievement: Achievement, locale: string) {
  const formatted = formatDate(achievement.achievedAt, locale);
  return formatted ? formatted.slice(-4) : null;
}

function getCardTransform(distance: number) {
  if (distance === 0) return "translate(-50%, -50%) scale(1)";
  if (distance === -1)
    return `translate(calc(-50% - ${SIDE_CARD_DISTANCE}), -50%) scale(0.85) rotateY(15deg)`;
  if (distance === 1)
    return `translate(calc(-50% + ${SIDE_CARD_DISTANCE}), -50%) scale(0.85) rotateY(-15deg)`;
  if (distance === -2)
    return `translate(calc(-50% - ${OUTER_CARD_DISTANCE}), -50%) scale(0.7) rotateY(25deg)`;
  return `translate(calc(-50% + ${OUTER_CARD_DISTANCE}), -50%) scale(0.7) rotateY(-25deg)`;
}

function getCardPresentation(distance: number) {
  const absoluteDistance = Math.abs(distance);
  const isActive = distance === 0;
  const isSideCard = absoluteDistance === 1;

  return {
    isActive,
    isSideCard,
    isVisible: absoluteDistance <= 2,
    isClickable: absoluteDistance <= 1,
    opacity: isActive ? 1 : isSideCard ? 0.7 : 0.2,
    zIndex: isActive ? 40 : isSideCard ? 30 : 20,
    transform: getCardTransform(distance),
  };
}

function AchievementCard({
  achievement,
  locale,
  isActive,
  onActivate,
  variant,
}: {
  achievement: Achievement;
  locale: string;
  isActive: boolean;
  onActivate: () => void;
  variant: AchievementVariant;
}) {
  const href = `/achievements/${achievement.id}`;
  const achievedOn = formatDate(achievement.achievedAt, locale);
  const year = getAchievementYear(achievement, locale);
  const isBrutalist = variant === "brutalist";

  const visualSrc = isImageLike(achievement.heroImage)
    ? achievement.heroImage
    : isImageLike(achievement.icon)
      ? achievement.icon
      : null;

  const cardVariantClasses = {
    classic: "bg-card border-border shadow-sm rounded-lg",
    glassmorphic: "bg-card/40 backdrop-blur-md border-border rounded-lg shadow-xs",
    brutalist: "bg-card border-2 border-border-strong rounded-none shadow-brutal",
    "gradient-glow": "bg-foreground text-background border-border rounded-lg shadow-md",
    minimal: "bg-background border-border rounded-lg shadow-none",
  };

  const baseCardClassName = cn(
    "group relative flex h-full w-full flex-col overflow-hidden border transition-all duration-300",
    cardVariantClasses[variant]
  );

  const visualArea = (
    <div
      className={cn(
        "bg-muted/40 relative isolate mt-4 flex aspect-16/10 w-full items-center justify-center overflow-hidden border",
        isBrutalist ? "border-border-strong rounded-none border-2" : "border-border rounded-lg"
      )}
    >
      {!visualSrc && (
        <div
          className={cn(
            "text-primary relative z-20 flex h-14 w-14 items-center justify-center border shadow-xs",
            isBrutalist
              ? "border-border-strong bg-warning text-foreground rounded-none border-2"
              : "border-border bg-card rounded-md"
          )}
        >
          <Award className="h-6 w-6" />
        </div>
      )}

      {visualSrc && (
        <>
          <Image
            src={visualSrc}
            alt={achievement.title || "Achievement media"}
            fill
            unoptimized
            sizes="(min-width: 1280px) 370px, (min-width: 768px) 350px, 88vw"
            className={cn(
              "object-cover transition-transform duration-700 ease-out",
              isActive ? "group-hover:scale-[1.025]" : "group-hover:scale-100"
            )}
          />
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </>
      )}
    </div>
  );

  if (!isActive) {
    return (
      <button
        type="button"
        onClick={onActivate}
        className={cn(
          baseCardClassName,
          "focus-visible:ring-primary/40 cursor-pointer p-4 text-left focus-visible:ring-2 focus-visible:outline-hidden",
          isBrutalist
            ? "hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            : "hover:border-border-strong"
        )}
        aria-label={`Show ${achievement.title}`}
      >
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "text-xs font-black tracking-[0.2em] uppercase",
              isBrutalist ? "font-mono" : "text-muted-foreground"
            )}
          >
            {year || ""}
          </span>
          <span
            className={cn(
              "border px-2 py-0.5 text-xs font-bold tracking-wider uppercase",
              isBrutalist
                ? "text-background border-border-strong rounded-none bg-black font-mono"
                : "border-border bg-muted text-foreground rounded-md"
            )}
          >
            <I18n>Preview</I18n>
          </span>
        </div>

        {visualArea}

        <div className="mt-4">
          <h3
            className={cn(
              "text-foreground line-clamp-1 text-sm font-black tracking-tight",
              isBrutalist ? "font-mono" : ""
            )}
          >
            {achievement.title}
          </h3>
          <p
            className={cn(
              "text-muted-foreground mt-0.5 truncate text-xs font-semibold",
              isBrutalist ? "font-mono" : ""
            )}
          >
            {achievement.issuer}
          </p>
        </div>
      </button>
    );
  }

  return (
    <article className={cn(baseCardClassName, "p-4 sm:p-6")}>
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "text-xs font-black tracking-[0.2em] uppercase",
            isBrutalist ? "text-foreground font-mono" : "text-primary"
          )}
        >
          {year || ""}
        </span>

        <Button
          variant={isBrutalist ? "default" : "outline"}
          size="icon"
          className={cn(
            "h-8 w-8 cursor-pointer",
            isBrutalist
              ? "border-border-strong bg-info text-foreground rounded-none border-2 shadow-sm"
              : "border-border hover:bg-muted rounded-full"
          )}
          onClick={() => window.open(href, "_self")}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {visualArea}

      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div className="space-y-2">
          <h3
            className={cn(
              "text-foreground text-base leading-snug font-black tracking-tight",
              isBrutalist ? "font-mono" : ""
            )}
          >
            {achievement.title}
          </h3>

          {achievement.issuer || achievedOn ? (
            <div
              className={cn(
                "flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-bold",
                isBrutalist ? "text-foreground font-mono" : "text-muted-foreground"
              )}
            >
              {achievement.issuer ? <span>{achievement.issuer}</span> : null}
              {achievedOn ? (
                <span className="inline-flex items-center gap-1 opacity-80">
                  <CalendarDays className="h-3 w-3" />
                  {achievedOn}
                </span>
              ) : null}
            </div>
          ) : null}

          {achievement.shortDesc ? (
            <p
              className={cn(
                "text-muted-foreground line-clamp-3 text-xs leading-relaxed font-medium",
                isBrutalist ? "font-mono" : ""
              )}
            >
              {achievement.shortDesc}
            </p>
          ) : null}
        </div>

        <div className="border-border mt-4 flex items-center justify-between border-t pt-3">
          <span
            className={cn(
              "text-xs font-black tracking-widest uppercase select-none",
              isBrutalist ? "text-muted-foreground font-mono" : "text-muted-foreground/60"
            )}
          >
            <I18n>Certification</I18n>
          </span>

          <Link
            href={href}
            className={cn(
              "text-foreground hover:text-primary inline-flex items-center gap-1 text-xs font-black transition-colors",
              isBrutalist ? "font-mono underline" : ""
            )}
          >
            <I18n>View details</I18n>
            <ExternalLink className="text-primary h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function AchievementNavigation({
  onPrevious,
  onNext,
  disabled,
  variant,
}: {
  onPrevious: () => void;
  onNext: () => void;
  disabled: boolean;
  variant: AchievementVariant;
}) {
  const isBrutalist = variant === "brutalist";
  return (
    <div className="relative z-50 mt-8 flex items-center justify-center gap-4">
      <Button
        variant={isBrutalist ? "default" : "outline"}
        size="icon"
        onClick={onPrevious}
        disabled={disabled}
        className={cn(
          "h-10 w-10 cursor-pointer transition-all hover:-translate-y-0.5",
          isBrutalist
            ? "bg-card text-foreground hover:bg-muted border-border-strong rounded-none border-2 shadow-sm"
            : "border-border bg-card hover:bg-muted rounded-full shadow-2xs"
        )}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div
        className={cn(
          "px-5 py-2 shadow-2xs backdrop-blur-xs select-none",
          isBrutalist
            ? "border-border-strong bg-warning text-foreground rounded-none border-2 font-mono"
            : "border-border bg-card/80 rounded-full border"
        )}
      >
        <span className="text-xs font-black tracking-[0.25em] uppercase">
          <I18n>3D Showcase</I18n>
        </span>
      </div>

      <Button
        variant={isBrutalist ? "default" : "outline"}
        size="icon"
        onClick={onNext}
        disabled={disabled}
        className={cn(
          "h-10 w-10 cursor-pointer transition-all hover:-translate-y-0.5",
          isBrutalist
            ? "bg-card text-foreground hover:bg-muted border-border-strong rounded-none border-2 shadow-sm"
            : "border-border bg-card hover:bg-muted rounded-full shadow-2xs"
        )}
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function AchievementCarousel({
  achievements,
  locale,
  variant,
}: {
  achievements: Achievement[];
  locale: string;
  variant: AchievementVariant;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);

  const total = achievements.length;
  const lockDuration = prefersReducedMotion ? 0 : TRANSITION_MS;

  const scheduleUnlock = useCallback(() => {
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }
    if (lockDuration === 0) {
      setIsTransitioning(false);
      return;
    }
    transitionTimeoutRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      transitionTimeoutRef.current = null;
    }, lockDuration);
  }, [lockDuration]);

  const moveTo = useCallback(
    (nextIndex: number) => {
      if (total <= 1 || isTransitioning) return;
      setIsTransitioning(true);
      setActiveIndex(getWrappedIndex(nextIndex, total));
      scheduleUnlock();
    },
    [isTransitioning, scheduleUnlock, total]
  );

  const handlePrevious = useCallback(() => moveTo(activeIndex - 1), [activeIndex, moveTo]);
  const handleNext = useCallback(() => moveTo(activeIndex + 1), [activeIndex, moveTo]);

  useEffect(() => {
    if (prefersReducedMotion || paused || isTransitioning || total <= 1) return;
    const timer = window.setTimeout(() => {
      setIsTransitioning(true);
      setActiveIndex((current) => getWrappedIndex(current + 1, total));
      scheduleUnlock();
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, isTransitioning, paused, prefersReducedMotion, scheduleUnlock, total]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrevious();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    },
    [handleNext, handlePrevious]
  );

  const handleTouchStart = useCallback((event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const start = touchStartRef.current;
      const touch = event.changedTouches[0];
      touchStartRef.current = null;
      if (!start || !touch || isTransitioning) return;
      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      if (Math.abs(deltaX) < 30 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      if (deltaX > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    },
    [handleNext, handlePrevious, isTransitioning]
  );

  return (
    <div
      className="relative w-full overflow-visible"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative overflow-visible focus-visible:outline-hidden"
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
        aria-label="Awards slider container"
        style={{ perspective: "1200px" }} // 🔧 3D রোটেশন লাইন স্মুথ করার ডিপ পার্সপেক্টিভ
      >
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 z-45 w-12 bg-gradient-to-r to-transparent sm:w-24 md:w-32" />
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 z-45 w-12 bg-gradient-to-l to-transparent sm:w-24 md:w-32" />

        <div className="relative mx-auto h-[440px] w-full overflow-visible sm:h-[470px]">
          {achievements.map((achievement, index) => {
            const distance = getRelativeDistance(index, activeIndex, total);
            const presentation = getCardPresentation(distance);

            if (!presentation.isVisible) return null;

            return (
              <div
                key={achievement.id}
                /* 🔧 LINE FIX: ওভারফ্লো হিডেন সরিয়ে এখানে ওভারফ্লো ভিজিবল করা হয়েছে যাতে এজ লাইন না কাটে */
                className="absolute top-1/2 left-1/2 h-[390px] w-[min(84vw,20rem)] overflow-visible will-change-transform sm:h-[420px] sm:w-[22rem]"
                style={{
                  opacity: presentation.opacity,
                  zIndex: presentation.zIndex,
                  pointerEvents: presentation.isClickable ? "auto" : "none",
                  transform: presentation.transform,
                  transformOrigin: "center center",
                  transition: prefersReducedMotion
                    ? "opacity 200ms linear"
                    : `transform ${TRANSITION_MS}ms ${TRANSITION_EASING}, opacity ${TRANSITION_MS}ms ${TRANSITION_EASING}, z-index ${TRANSITION_MS}ms step-start`,
                }}
              >
                <div className="h-full w-full overflow-visible">
                  <AchievementCard
                    achievement={achievement}
                    locale={locale}
                    isActive={presentation.isActive}
                    onActivate={() => moveTo(index)}
                    variant={variant}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AchievementNavigation
        onPrevious={handlePrevious}
        onNext={handleNext}
        disabled={isTransitioning || total <= 1}
        variant={variant}
      />
    </div>
  );
}

export function AchievementPreviewSection({
  limit = 5,
  variant = "classic",
}: AchievementPreviewSectionProps) {
  const locale = useLocale();
  const { data, isLoading, error } = usePublishedAchievements({ limit });

  const achievements = useMemo(
    () => [...(data?.data || [])].sort((a, b) => a.order - b.order),
    [data?.data]
  );

  const sectionBgStyles = {
    classic: "bg-surface-elevated/40",
    glassmorphic: "bg-background/40 backdrop-blur-xs",
    brutalist: "bg-card border-b-4 border-border-strong",
    "gradient-glow": "bg-foreground text-background shadow-inset-top",
    minimal: "bg-background",
  };

  if (isLoading) {
    return (
      <section
        className={cn("text-foreground relative w-full py-16 sm:py-20", sectionBgStyles[variant])}
      >
        <div className="container-custom mx-auto w-full px-4 sm:px-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-10 w-full max-w-xl rounded-xl" />
          </div>
          <div className="relative mt-12 flex h-[400px] items-center justify-center">
            <Skeleton className="h-[390px] w-[20rem] rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  if (error || achievements.length === 0) return null;

  return (
    <section
      className={cn(
        "text-foreground relative w-full overflow-hidden py-16 transition-colors duration-300 sm:py-20",
        sectionBgStyles[variant]
      )}
    >
      {/* 🔧 container-custom এর পাশে mx-auto লক করে ওয়ান-সাইড এম্পটি স্পেস ফিক্স করা হলো */}
      <div className="container-custom mx-auto w-full px-4 sm:px-6">
        <PreviewSectionHeader
          eyebrow="Achievements"
          title="Awards & Recognition"
          description="A timeline of our significant milestones and accomplishments."
          href="/achievements"
          ctaLabel="All achievements"
        />

        <div className="mt-12 w-full overflow-visible">
          <AchievementCarousel achievements={achievements} locale={locale} variant={variant} />
        </div>
      </div>
    </section>
  );
}
