"use client";

import { useMemo } from "react";
import {
  Sparkles,
  HelpCircle,
  Plus,
  Compass,
  ChevronDown,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import { usePublishedFaqs } from "../hooks/useFaq";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import { Link } from "@/shared/i18n";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type PublicFaqItem = {
  id: string;
  question: string;
  answer: string;
  category?: string;
};

const containerVariants = cva(
  "relative w-full overflow-hidden bg-background text-foreground transition-all duration-300",
  {
    variants: {
      variant: { classic: "", glassmorphic: "", brutalist: "", "gradient-glow": "", minimal: "" },
      size: { sm: "py-6 sm:py-10", default: "py-14 sm:py-20", lg: "py-20 sm:py-28" },
    },
    defaultVariants: { variant: "classic", size: "default" },
  }
);

const faqItemVariants = cva("w-full transition-all select-none box-border border-0", {
  variants: {
    variant: {
      classic: "border-b border-border hover:border-border-strong",
      glassmorphic: "border-b border-border hover:border-border-strong backdrop-blur-3xs",
      brutalist: "border-b-2 border-border-strong py-1",
      "gradient-glow": "border-b border-border hover:border-primary/50",
      minimal: "border-b border-border/20 hover:border-foreground/20",
    },
  },
  defaultVariants: { variant: "classic" },
});

const faqTriggerVariants = cva(
  "flex flex-1 items-start justify-between py-5 text-left outline-none cursor-pointer w-full hover:no-underline [&>svg]:hidden",
  {
    variants: {
      variant: {
        classic: "font-sans duration-300",
        glassmorphic: "font-sans duration-500 ease-out",
        brutalist: "font-mono uppercase duration-75 ease-linear",
        "gradient-glow": "font-sans duration-500 cubic-bezier(0.16, 1, 0.3, 1)",
        minimal: "font-sans duration-200 hover:translate-x-0.5",
      },
    },
    defaultVariants: { variant: "classic" },
  }
);

const faqContentVariants = cva(
  "text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium max-w-none pb-5 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
  {
    variants: {
      variant: {
        classic: "pl-12 transition-all duration-300",
        glassmorphic: "pl-12 transition-all duration-500 ease-out",
        brutalist: "pl-12 transition-all duration-75",
        "gradient-glow": "pl-12 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)",
        minimal: "pl-0 pt-1 pb-3 transition-all duration-200",
      },
    },
    defaultVariants: { variant: "classic" },
  }
);

const faqIconVariants = cva(
  "flex h-9 w-9 shrink-0 items-center justify-center transition-all duration-300",
  {
    variants: {
      variant: {
        classic:
          "rounded-xl border border-primary/10 bg-primary/5 text-primary group-hover/row:scale-105",
        glassmorphic:
          "rounded-full bg-info/10 border border-info/20 text-info group-hover/row:scale-105",
        brutalist: "rounded-none border-2 border-border-strong bg-warning text-foreground",
        "gradient-glow":
          "rounded-xl bg-primary/10 border border-primary/20 shadow-glow text-primary group-hover/row:scale-105",
        minimal: "bg-transparent p-0 border-0 text-muted-foreground group-hover/row:text-primary",
      },
    },
    defaultVariants: { variant: "classic" },
  }
);

interface FaqSectionProps extends VariantProps<typeof containerVariants> {
  items?: PublicFaqItem[];
  faqs?: PublicFaqItem[];
  limit?: number;

  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;

  emptyLabel?: string;
  className?: string;
}

export function FaqPreviewSection({
  items: externalItems,
  faqs: legacyFaqs,
  limit = 10,
  eyebrow = "Got Questions?",
  title = "Frequently Asked Questions",
  description = "Find quick answers to common questions regarding our software architecture, engineering standards, and SLAs.",
  href = "/faqs",
  ctaLabel = "Explore All FAQs",
  hideHeader = false,
  emptyLabel = "No FAQs found at the moment.",
  variant = "classic",
  size,
  className,
}: FaqSectionProps = {}) {
  const initialFaqs = externalItems || legacyFaqs;
  const shouldFetch = !initialFaqs;

  const { data, isLoading: isApiLoading, error } = usePublishedFaqs();

  const faqs = useMemo<PublicFaqItem[]>(() => {
    if (initialFaqs) return initialFaqs.slice(0, limit);
    const rawList = data?.data || (Array.isArray(data) ? data : []);
    return rawList.slice(0, limit);
  }, [initialFaqs, data, limit]);

  const isLoading = shouldFetch && isApiLoading;

  const isBrutalist = variant === "brutalist";

  const renderFaqIcon = () => {
    switch (variant) {
      case "gradient-glow":
        return <Sparkles className="h-4 w-4" />;
      case "glassmorphic":
        return <Compass className="h-4 w-4" />;
      case "brutalist":
        return <Plus className="h-4 w-4" />;
      case "minimal":
      case "classic":
      default:
        return <HelpCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <section className={cn(containerVariants({ variant, size }), className)}>
        <div className="container-custom mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[380px_1fr] lg:gap-16">
            <div className="space-y-4">
              <Skeleton className="h-4 w-28 rounded" />
              <Skeleton className="h-10 w-3/4 rounded" />
              <Skeleton className="h-20 w-full rounded" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if ((shouldFetch && error) || faqs.length === 0) {
    return null;
  }

  return (
    <section className={cn(containerVariants({ variant, size }), className)}>
      {variant !== "minimal" && variant !== "brutalist" && (
        <>
          <div
            aria-hidden="true"
            className="bg-primary/5 pointer-events-none absolute top-12 -left-28 h-64 w-64 rounded-full blur-3xl"
          />
          <div
            aria-hidden="true"
            className="bg-primary/5 pointer-events-none absolute -right-28 bottom-0 h-72 w-72 rounded-full blur-3xl"
          />
        </>
      )}

      <div className="container-custom mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[360px_1fr] lg:gap-16 xl:grid-cols-[400px_1fr]">
          {/* LEFT COLUMN */}
          {!hideHeader && (
            <ScrollReveal className="sticky top-28 space-y-6">
              <div className="space-y-3">
                <span className="text-primary block text-xs font-bold tracking-[0.2em] uppercase">
                  <I18n>{eyebrow}</I18n>
                </span>
                <h2 className="text-foreground text-2xl leading-tight font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  <I18n>{title}</I18n>
                </h2>
                <p className="text-muted-foreground text-xs leading-relaxed font-medium sm:text-sm">
                  <I18n>{description}</I18n>
                </p>
              </div>

              <div className="bg-card/60 border-border space-y-4 rounded-xl border p-6 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary rounded-lg p-2.5">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-foreground text-sm font-bold">
                      <I18n>Still have questions?</I18n>
                    </h4>
                    <p className="text-muted-foreground text-xs font-medium">
                      <I18n>Can't find the answer you are looking for?</I18n>
                    </p>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-xs font-bold tracking-wider uppercase shadow-xs transition-all hover:-translate-y-0.5"
                >
                  <I18n>Talk to an Architect</I18n>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {href && ctaLabel && (
                <div className="pt-2">
                  <Link
                    href={href}
                    className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase transition-colors"
                  >
                    <I18n>{ctaLabel}</I18n>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </ScrollReveal>
          )}

          {/* RIGHT COLUMN */}
          <div className="w-full min-w-0">
            {filteredFaqsLengthCheck(faqs) ? (
              /* 🟢 FIX 1: Spread Object for Safe Base UI / Radix Props Compatibility */
              <Accordion
                {...({
                  type: "single",
                  collapsible: "true",
                  className: "w-full space-y-2",
                } as Record<string, unknown>)}
              >
                {faqs.map((faq: PublicFaqItem, index: number) => (
                  <AccordionItem
                    key={faq.id ? String(faq.id) : index}
                    value={faq.id ? String(faq.id) : String(index)}
                    className={faqItemVariants({ variant })}
                  >
                    <AccordionTrigger className={cn("group", faqTriggerVariants({ variant }))}>
                      <div className="flex min-w-0 flex-1 items-start gap-3.5 pr-4">
                        <div
                          className={cn(
                            faqIconVariants({ variant }),
                            isBrutalist && "group-data-[state=open]:rotate-45"
                          )}
                        >
                          {renderFaqIcon()}
                        </div>

                        <span className="group-hover:text-primary group-data-[state=open]:text-primary block pt-2 text-left text-sm font-bold tracking-tight transition-colors duration-200 sm:text-base">
                          {faq.question}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "text-muted-foreground/60 group-hover:text-foreground shrink-0 pt-2 transition-all duration-300 group-data-[state=open]:rotate-180",
                          isBrutalist && "hidden",
                          variant === "gradient-glow" &&
                            "group-data-[state=open]:cubic-bezier(0.16, 1, 0.3, 1) group-data-[state=open]:duration-500"
                        )}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className={faqContentVariants({ variant })}>
                      <p>{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div
                className={cn(
                  "border-border bg-card/40 text-muted-foreground w-full rounded-xl border border-dashed px-6 py-12 text-center text-sm font-medium",
                  isBrutalist && "border-border-strong rounded-none border-2 font-mono uppercase"
                )}
              >
                <HelpCircle className="text-muted-foreground/40 mx-auto mb-3 h-8 w-8 stroke-[1.5]" />
                <p>
                  <I18n>{emptyLabel}</I18n>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function filteredFaqsLengthCheck(faqs: PublicFaqItem[]) {
  return faqs && faqs.length > 0;
}
