"use client";

import { useMemo } from "react";
import { HelpCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import { usePublishedFaqs } from "../hooks/useFaq";
import { Skeleton } from "@/components/ui/skeleton";
import { PreviewSectionHeader } from "@/shared/components";

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
  "relative w-full overflow-hidden bg-background text-foreground transition-all duration-300 font-sans",
  {
    variants: {
      variant: {
        classic: "bg-background",
        glassmorphic: "bg-background/80 backdrop-blur-md",
        brutalist: "bg-background border-y-2 border-border-strong",
        "gradient-glow": "bg-background",
        minimal: "bg-background"
      },
      size: {
        sm: "py-8 sm:py-12",
        default: "py-16 sm:py-24",
        lg: "py-24 sm:py-32"
      },
    },
    defaultVariants: { variant: "classic", size: "default" },
  }
);

const faqItemVariants = cva("w-full transition-all select-none box-border border-0", {
  variants: {
    variant: {
      classic: "border-b border-border hover:border-border-strong",
      glassmorphic: "border-b border-border bg-card/10 backdrop-blur-xs hover:bg-card/20",
      brutalist: "border-2 border-border-strong bg-card p-4 my-3 shadow-xs hover:translate-x-1 hover:-translate-y-1 hover:shadow-sm transition-all duration-200",
      "gradient-glow": "border-b border-border hover:border-primary/50 relative overflow-hidden",
      minimal: "border-b border-border/40 hover:border-foreground/20",
    },
  },
  defaultVariants: { variant: "classic" },
});

const faqTriggerVariants = cva(
  // 🟢 [&>svg]:hidden ক্লাসটি বাদ দেওয়া হয়েছে যাতে shadcn/ui-এর নিজস্ব আইকন দৃশ্যমান হয়
  "flex flex-1 items-center justify-between py-5 text-left outline-hidden cursor-pointer w-full hover:no-underline [&>svg]:transition-transform [&>svg]:duration-300",
  {
    variants: {
      variant: {
        classic: "font-sans duration-300",
        glassmorphic: "font-sans duration-500 ease-out",
        brutalist: "font-mono uppercase duration-100 ease-in-out",
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
        classic: "pl-0 transition-all duration-300 font-sans",
        glassmorphic: "pl-0 transition-all duration-500 ease-out font-sans",
        brutalist: "pl-0 transition-all duration-100 font-mono text-foreground/90",
        "gradient-glow": "pl-0 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) font-sans",
        minimal: "pl-0 pt-1 pb-3 transition-all duration-200 font-sans",
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
  headerVariant?: "split" | "center" | "stacked" | "minimal";

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
  headerVariant = "split",
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

  if (isLoading) {
    return (
      <section className={cn(containerVariants({ variant, size }), className)}>
        <div className="container-custom mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="space-y-4 mb-10 animate-pulse">
            <Skeleton className="h-4 w-28 rounded bg-muted" />
            <Skeleton className="h-10 w-3/4 rounded bg-muted" />
            <Skeleton className="h-16 w-full rounded bg-muted" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-lg bg-muted/65 animate-pulse" />
            <Skeleton className="h-16 w-full rounded-lg bg-muted/65 animate-pulse" />
            <Skeleton className="h-16 w-full rounded-lg bg-muted/65 animate-pulse" />
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

      {/* Full Width Container */}
      <div className="container-custom mx-auto px-4 sm:px-6 max-w-5xl">
        {/* TOP HEADER SECTION */}
        {!hideHeader && (
          <PreviewSectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            href={href}
            ctaLabel={ctaLabel}
            variant={headerVariant}
          />
        )}

        {/* BOTTOM FULL WIDTH FAQ LIST */}
        <div className="w-full min-w-0 mt-8 lg:mt-12">
          {filteredFaqsLengthCheck(faqs) ? (
            <Accordion
              {...({
                type: "single",
                collapsible: "true",
                className: "w-full space-y-3",
              } as Record<string, unknown>)}
            >
              {faqs.map((faq: PublicFaqItem, index: number) => (
                <AccordionItem
                  key={faq.id ? String(faq.id) : index}
                  value={faq.id ? String(faq.id) : String(index)}
                  className={faqItemVariants({ variant })}
                >
                  <AccordionTrigger className={cn("group border-0", faqTriggerVariants({ variant }))}>
                    {/* Question Text */}
                    <span className={cn(
                      "group-hover:text-primary group-data-[state=open]:text-primary block text-left text-sm font-bold tracking-tight transition-colors duration-200 sm:text-base pr-4",
                      isBrutalist ? "font-mono" : "font-sans"
                    )}>
                      {faq.question}
                    </span>
                  </AccordionTrigger>

                  <AccordionContent className={faqContentVariants({ variant })}>
                    <p className={isBrutalist ? "font-mono" : "font-sans"}>{faq.answer}</p>
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
    </section>
  );
}

function filteredFaqsLengthCheck(faqs: PublicFaqItem[]) {
  return faqs && faqs.length > 0;
}