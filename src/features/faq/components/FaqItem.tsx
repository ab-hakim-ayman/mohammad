"use client";

import { Sparkles, HelpCircle, Plus, Compass, ChevronDown, Layers } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { PublicFaqItem } from "../types/faq.types";

const faqItemVariants = cva(
  "group/faq w-full transition-all select-none box-border mb-3 overflow-hidden",
  {
    variants: {
      variant: {
        classic: "border-b border-border hover:border-border-strong bg-transparent",
        glassmorphic: "border-b border-border bg-card/10 backdrop-blur-xs hover:bg-card/20",
        brutalist:
          "border-2 border-border-strong bg-card p-4 my-3 shadow-xs hover:translate-x-1 hover:-translate-y-1 hover:shadow-sm font-mono uppercase transition-all duration-200",
        "gradient-glow": "border-b border-border hover:border-primary/50 relative overflow-hidden bg-transparent",
        minimal: "border-b border-border/40 hover:border-foreground/20 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

const faqTriggerVariants = cva(
  "flex flex-1 items-start justify-between py-5 text-left outline-hidden cursor-pointer w-full hover:no-underline [&>svg]:hidden",
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
    defaultVariants: {
      variant: "classic",
    },
  }
);

const faqContentVariants = cva(
  "text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium max-w-none pb-5 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
  {
    variants: {
      variant: {
        classic: "pl-12 transition-all duration-300 font-sans",
        glassmorphic: "pl-12 transition-all duration-500 ease-out font-sans",
        brutalist: "pl-0 transition-all duration-100 font-mono text-foreground/90",
        "gradient-glow": "pl-12 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) font-sans",
        minimal: "pl-0 pt-1 pb-3 transition-all duration-200 font-sans",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

const faqIconVariants = cva(
  "flex h-9 w-9 shrink-0 items-center justify-center transition-all duration-300",
  {
    variants: {
      variant: {
        classic:
          "rounded-xl border border-primary/10 bg-primary/5 text-primary group-hover/faq:scale-105",
        glassmorphic:
          "rounded-full bg-info/10 border border-info/20 text-info group-hover/faq:scale-105",
        brutalist:
          "rounded-none border-2 border-border-strong bg-warning text-foreground",
        "gradient-glow":
          "rounded-xl bg-primary/10 border border-primary/20 shadow-glow text-primary group-hover/faq:scale-105",
        minimal: "bg-transparent p-0 border-0 text-muted-foreground group-hover/faq:text-primary",
      },
    },
    defaultVariants: {
      variant: "classic",
    },
  }
);

export interface FaqItemProps extends VariantProps<typeof faqItemVariants> {
  faq: PublicFaqItem;
  className?: string;
}

export function FaqItem({ faq, variant = "classic", className }: FaqItemProps) {
  const isBrutalist = variant === "brutalist";

  const renderIcon = () => {
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

  return (
    <AccordionItem
      value={faq.id}
      className={cn(faqItemVariants({ variant }), className)}
    >
      <AccordionTrigger className={cn("group", faqTriggerVariants({ variant }))}>
        <div className="flex min-w-0 flex-1 items-start gap-3.5 pr-4">
          <div
            className={cn(
              faqIconVariants({ variant }),
              isBrutalist && "group-data-[state=open]/faq:rotate-45"
            )}
          >
            {renderIcon()}
          </div>

          <span
            className={cn(
              "group-hover:text-primary group-data-[state=open]/faq:text-primary block pt-1.5 text-left text-sm font-bold tracking-tight transition-colors duration-200 sm:text-base",
              isBrutalist ? "font-mono uppercase" : "font-sans"
            )}
          >
            {faq.question}
          </span>
        </div>

        <div
          className={cn(
            "text-muted-foreground/60 group-hover/faq:text-foreground shrink-0 pt-2 transition-all duration-300 group-data-[state=open]/faq:rotate-180",
            isBrutalist && "hidden",
            variant === "gradient-glow" &&
            "group-data-[state=open]/faq:cubic-bezier(0.16, 1, 0.3, 1) group-data-[state=open]/faq:duration-500"
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </AccordionTrigger>

      <AccordionContent className={faqContentVariants({ variant })}>
        <p className={isBrutalist ? "font-mono" : "font-sans"}>{faq.answer}</p>

        {faq.category && faq.category !== "General" && (
          <div className="mt-3 flex items-center gap-1.5">
            <Layers className="text-muted-foreground/40 h-3 w-3" />
            <span className="text-muted-foreground/50 text-xs font-bold tracking-wider uppercase">
              <I18n>Filed under:</I18n> {faq.category}
            </span>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}