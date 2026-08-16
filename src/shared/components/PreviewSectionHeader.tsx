"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/shared/i18n";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// 🎛️ CVA Layout Variants (Vercel & Stripe Design Language)
const headerVariants = cva("mb-10 sm:mb-12 flex flex-col w-full box-border antialiased", {
  variants: {
    variant: {
      split: "md:flex-row md:items-end md:justify-between items-start justify-start text-left gap-6",
      center: "items-center justify-center text-center gap-4",
      stacked: "items-start justify-start text-left gap-4",
      minimal: "items-start justify-start text-left mb-6 gap-3",
    },
    theme: {
      light: "text-foreground",
      dark: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "split",
    theme: "light",
  },
});

interface PreviewSectionHeaderProps extends VariantProps<typeof headerVariants> {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  className?: string;
  hideCta?: boolean;
}

export function PreviewSectionHeader({
  eyebrow,
  title,
  description,
  href,
  ctaLabel = "Explore All",
  variant,
  theme,
  className = "",
  hideCta = false,
}: PreviewSectionHeaderProps) {
  const isCentered = variant === "center";

  return (
    <div className={cn(headerVariants({ variant, theme }), className)}>
      {/* 📝 Text Content Wrapper */}
      {/* 📝 Text Content Wrapper */}
      <div
        className={cn(
          "flex w-full flex-col",
          isCentered ? "max-w-3xl items-center" : "flex-1"
        )}
      >
        {/* Eyebrow Pill Badge */}
        {eyebrow && (
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-muted-foreground select-none backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span>{eyebrow}</span>
          </div>
        )}

        {/* Section Title Heading */}
        <h2
          className={cn(
            "mt-3 font-sans text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-foreground leading-[1.15]",
            theme === "dark" && "text-background"
          )}
        >
          {title}
        </h2>

        {/* Section Description Paragraph */}
        {description && (
          <p
            className={cn(
              "mt-3 text-xs sm:text-sm leading-relaxed font-medium text-muted-foreground/90 w-full",
              isCentered && "mx-auto text-center"
            )}
          >
            {description}
          </p>
        )}
      </div>

      {/* ⚡ Call-To-Action (CTA) Button Wrapper */}
      {!hideCta && href && (
        <div
          className={cn(
            "flex shrink-0 items-center transition-all duration-200",
            isCentered
              ? "mx-auto mt-2 justify-center"
              : variant === "stacked" || variant === "minimal"
                ? "mt-2 justify-start"
                : "mt-2 justify-start md:mt-0 md:justify-end"
          )}
        >
          <Link
            href={href}
            className="group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card/60 backdrop-blur-md px-4 py-2 text-xs font-bold tracking-wider uppercase text-foreground shadow-2xs transition-all duration-200 hover:border-border hover:bg-card hover:text-primary cursor-pointer select-none"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        </div>
      )}
    </div>
  );
}