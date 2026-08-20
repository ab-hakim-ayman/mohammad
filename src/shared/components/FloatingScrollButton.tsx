"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const scrollButtonVariants = cva(
  "relative z-10 h-10 w-10 p-0 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center",
  {
    variants: {
      variant: {
        classic:
          "bg-card/90 border border-border/80 text-foreground hover:bg-card shadow-md rounded-full backdrop-blur-md",
        glassmorphic:
          "bg-background/60 border border-border/50 text-foreground backdrop-blur-xl hover:bg-background/80 shadow-lg rounded-full",
        brutalist:
          "bg-card border-2 border-border-strong text-foreground rounded-none shadow-brutal-sm hover:bg-muted",
        gradientGlow:
          "bg-foreground border border-border/60 text-background shadow-md hover:opacity-90 rounded-full",
        minimal:
          "bg-muted/40 border border-border/40 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-xl shadow-2xs",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

export interface FloatingScrollButtonProps extends VariantProps<typeof scrollButtonVariants> {
  className?: string;
}

function getScrollMetrics() {
  if (typeof window === "undefined") {
    return { scrollTop: 0, viewportHeight: 0, documentHeight: 0, maxScroll: 0, progress: 0 };
  }
  const scrollTop = window.scrollY;
  const viewportHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const maxScroll = Math.max(documentHeight - viewportHeight, 0);
  const progress = maxScroll === 0 ? 0 : scrollTop / maxScroll;

  return { scrollTop, viewportHeight, documentHeight, maxScroll, progress };
}

export function FloatingScrollButton({
  variant = "classic",
  className = "",
}: FloatingScrollButtonProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const sync = () => {
      const { scrollTop, progress } = getScrollMetrics();
      // Show button after user scrolls 200px down
      setIsVisible(scrollTop > 200);
      setScrollProgress(progress);
    };

    sync();

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const isMinimal = variant === "minimal";
  const isBrutalist = variant === "brutalist";
  const isGlow = variant === "gradientGlow";

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <div
      className={cn(
        "group fixed right-5 bottom-5 z-40 flex items-center justify-center transition-all duration-300 sm:right-6 sm:bottom-6",
        isVisible
          ? "pointer-events-auto scale-100 opacity-100"
          : "pointer-events-none translate-y-2 scale-90 opacity-0",
        className
      )}
    >
      {/* 🔄 Vercel Style SVG Radial Progress Ring */}
      {!isMinimal && !isBrutalist && (
        <svg className="pointer-events-none absolute z-0 h-12 w-12 -rotate-90" aria-hidden="true">
          <circle
            cx="24"
            cy="24"
            r={radius}
            className="stroke-border/40 fill-none"
            strokeWidth="2"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            className={cn(
              "fill-none transition-all duration-300 ease-out",
              isGlow ? "stroke-primary-foreground" : "stroke-primary"
            )}
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* 🔘 Clean Action Button */}
      <Button
        type="button"
        variant="ghost"
        onClick={handleClick}
        aria-label="Scroll to top"
        className={cn(scrollButtonVariants({ variant }))}
      >
        <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
      </Button>
    </div>
  );
}
