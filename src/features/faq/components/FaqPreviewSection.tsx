"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { usePublishedFaqs } from "../hooks/useFaq";
import { FaqItem } from "./FaqItem";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import type { PublicFaqItem } from "../types/faq.types";

interface FaqPreviewSectionProps {
  items?: PublicFaqItem[];
  faqs?: PublicFaqItem[]; // Legacy prop alias
  limit?: number;
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
  headerVariant?: "split" | "center" | "stacked" | "minimal";
  variant?: "classic" | "glassmorphic" | "brutalist" | "gradient-glow" | "minimal";
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
  variant = "classic",
  className,
}: FaqPreviewSectionProps) {
  const initialFaqs = externalItems || legacyFaqs;
  const shouldFetch = !initialFaqs;

  const { data, isLoading: isApiLoading, error } = usePublishedFaqs();

  const faqs = useMemo<PublicFaqItem[]>(() => {
    if (initialFaqs) return initialFaqs.slice(0, limit);
    const rawList = (data?.data || (Array.isArray(data) ? data : [])) as PublicFaqItem[];
    return rawList.slice(0, limit);
  }, [initialFaqs, data, limit]);

  return (
    <SectionEngine<PublicFaqItem>
      data={faqs}
      isLoading={shouldFetch && isApiLoading}
      error={error}
      layout="accordion"
      accordionType="single"
      pageSize={limit}
      showToolbar={false}
      showPagination={false}
      hideEmptyState={true}
      className={className}
      header={
        !hideHeader ? (
          <PreviewSectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            href={href}
            ctaLabel={ctaLabel}
            variant={headerVariant}
          />
        ) : undefined
      }
      renderCard={(faq) => <FaqItem key={faq.id} faq={faq} variant={variant} />}
    />
  );
}