"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles, HelpCircle, Plus, Compass, ChevronDown, Layers } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";
import { Pagination } from "@/shared/components";
import { useDebounce } from "@/shared/hooks/useDebounce";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Select } from "@/shared/components/Select";

type PublicFaqItem = {
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
  "text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium max-w-3xl pb-5 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
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
  title: string;
  subtitle?: string;
  description?: string;
  faqs: PublicFaqItem[];
  emptyLabel: string;
  className?: string;
}

export function FaqSection({
  title,
  subtitle,
  description,
  faqs,
  emptyLabel,
  variant = "classic",
  size,
  className,
}: FaqSectionProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const categories = useMemo(() => {
    const list = new Set<string>();
    faqs.forEach((faq: PublicFaqItem) => {
      const cat = faq.category?.trim();
      if (cat) list.add(cat);
    });
    return ["All", ...Array.from(list)];
  }, [faqs]);

  // 🛠️ লজিক ফিক্স: ক্যাটাগরি ম্যাচিং মেকানিজম নিখুঁত করা হলো
  const filteredFaqs = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return faqs.filter((faq: PublicFaqItem) => {
      const currentCat = faq.category?.trim() || "General";

      // ড্রপডাউন থেকে সিলেক্ট করা ভ্যালুর সাথে সরাসরি মেলাতে হবে কেস-সেন্সিটিভিটি ইস্যু এড়াতে
      const matchesCategory = selectedCategory === "All" || currentCat === selectedCategory;

      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [faqs, debouncedSearch, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredFaqs.length / pageSize));
  const currentPage = page > totalPages ? 1 : page;
  const visibleFaqs = useMemo(
    () => filteredFaqs.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredFaqs, currentPage]
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory]);

  const accordionProps = {
    type: "single",
    collapsible: true,
    className: "w-full",
  } as const;

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

      <div className="relative z-10 mx-auto box-border w-full max-w-4xl px-4 sm:px-6">
        <div className="border-border mb-8 flex w-full flex-col gap-3 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-[200px]">
            <Select
              value={selectedCategory}
              onValueChange={(value: string | null) => {
                if (value !== null) setSelectedCategory(value);
              }}
              options={categories.map((category) => ({
                label: category === "All" ? "All Categories" : category,
                value: category,
              }))}
              placeholder="Select category"
            />
          </div>

          <div className="relative w-full shrink-0 sm:max-w-[260px]">
            <Search className="text-muted-foreground/70 pointer-events-none absolute top-1/2 left-3.5 h-3.5 w-3.5 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by keyword..."
              className={cn(
                "border-border bg-surface-elevated/40 text-foreground shadow-3xs placeholder:text-muted-foreground/60 hover:border-border-strong focus:border-primary focus:bg-background focus:ring-primary/10 w-full rounded-full border py-2 pr-4 pl-10 text-xs font-medium transition-all focus:ring-4 focus:outline-hidden",
                isBrutalist && "border-border-strong rounded-none border-2 font-mono uppercase"
              )}
            />
          </div>
        </div>

        {filteredFaqs.length > 0 ? (
          <div className="w-full">
            <Accordion {...(accordionProps as any)}>
              {visibleFaqs.map((faq: PublicFaqItem) => (
                <AccordionItem key={faq.id} value={faq.id} className={faqItemVariants({ variant })}>
                  <AccordionTrigger className={cn("group", faqTriggerVariants({ variant }))}>
                    <div className="flex min-w-0 flex-1 items-start gap-3.5">
                      <div
                        className={cn(
                          faqIconVariants({ variant }),
                          isBrutalist && "group-data-[state=open]:rotate-45"
                        )}
                      >
                        {renderFaqIcon()}
                      </div>

                      <span className="group-hover:text-primary group-data-[state=open]:text-primary block pt-2 text-left text-base font-bold tracking-tight transition-colors duration-200">
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
              ))}
            </Accordion>

            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  variant="classic"
                />
              </div>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "border-border bg-surface-elevated/30 text-muted-foreground w-full rounded-xl border border-dashed px-6 py-12 text-center text-sm font-medium",
              isBrutalist && "border-border-strong rounded-none border-2 font-mono uppercase"
            )}
          >
            <Search className="text-muted-foreground/40 mx-auto mb-3 h-8 w-8 stroke-[1.5]" />
            <p>{emptyLabel}</p>
          </div>
        )}
      </div>
    </section>
  );
}
