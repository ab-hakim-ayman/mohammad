"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

const countVariants = cva(
  "tabular-nums font-mono tracking-tight transition-colors duration-200 select-none inline-block",
  {
    variants: {
      variant: {
        default: "text-foreground font-bold",
        primary: "text-primary font-extrabold",
        muted: "text-muted-foreground font-semibold",
        success: "text-success font-bold",

        // Vercel / Stripe Metallic Glow Gradient
        glow: "bg-gradient-to-b from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent font-black tracking-tighter",
      },
      size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg sm:text-xl font-bold",
        xl: "text-xl sm:text-2xl font-bold",

        "2xl": "text-2xl sm:text-3xl font-extrabold tracking-tight",
        "3xl": "text-3xl sm:text-4xl font-extrabold tracking-tight",
        "4xl": "text-4xl sm:text-5xl font-black tracking-tighter",
        "6xl": "text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "base",
    },
  }
);

export interface AnimatedCountProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof countVariants> {
  value: number;
  duration?: number;
  suffix?: string;
  locale?: string;
}

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

export function AnimatedCount({
  className,
  variant,
  size,
  duration = 1200,
  locale,
  suffix = "",
  value,
  ...props
}: AnimatedCountProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);

  const activeLocale = useLocale();
  const currentLocale = locale || activeLocale;

  // 🛡️ VIEWPORT BOUNDARY DETECTION
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // 🏎️ PERFORMANCE SPIN ENGINE
  useEffect(() => {
    if (!hasStarted) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const instantFrame = window.requestAnimationFrame(() => setDisplayValue(value));
      return () => window.cancelAnimationFrame(instantFrame);
    }

    let frameId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const nextValue = Math.round(value * easeOutCubic(progress));

      setDisplayValue(nextValue);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [duration, hasStarted, value]);

  const formatted = useMemo(
    () => displayValue.toLocaleString(currentLocale) + suffix,
    [displayValue, currentLocale, suffix]
  );

  return (
    <span ref={rootRef} className={cn(countVariants({ variant, size, className }))} {...props}>
      {formatted}
    </span>
  );
}
