"use client";

import { usePublishedFaqs } from "../hooks/useFaq";
import { FaqItem } from "./FaqItem";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import type { PublicFaqItem } from "../types/faq.types";

export interface FaqSectionProps {
  pageSize?: number;
  variant?: "classic" | "glassmorphic" | "brutalist" | "gradient-glow" | "minimal";
  className?: string;
}

export function FaqSection({
  pageSize = 10,
  variant = "classic",
  className,
}: FaqSectionProps) {
  const { data, isLoading, error } = usePublishedFaqs();
  const isBrutalist = variant === "brutalist";

  return (
    <SectionEngine<PublicFaqItem>
      data={data}
      isLoading={isLoading}
      error={error}
      layout="accordion"
      accordionType="single"
      pageSize={pageSize}
      searchPlaceholder="Filter by keyword..."
      searchVariant={isBrutalist ? "solid" : "capsule"}
      sortVariant={isBrutalist ? "solid" : "capsule"}
      showSortToggle={false}
      itemCountLabel="questions"
      searchFields={(faq) => [
        faq.question,
        faq.answer,
        faq.category,
        ...(faq.categories?.map((c) => c.title) || []),
      ]}
      filters={[
        {
          key: "category",
          placeholder: "Category",
          type: "single-pill",
        },
      ]}
      className={className}
      renderCard={(faq) => <FaqItem key={faq.id} faq={faq} variant={variant} />}
    />
  );
}