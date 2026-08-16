"use client";

import { useMemo } from "react";
import { usePublishedTestimonials } from "../hooks/useTestimonial";
import { TestimonialCard } from "./TestimonialCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Testimonial } from "../types/testimonial.types";

export function TestimonialSection() {
  const { data, isLoading, error } = usePublishedTestimonials(undefined);

  const testimonials = useMemo<Testimonial[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    const res = data as any;
    return res.data?.data || res.data || [];
  }, [data]);

  const filters = useMemo(() => {
    const ratings = new Set<number>();

    testimonials.forEach((item) => {
      if (item.rating !== undefined && item.rating !== null) ratings.add(item.rating);
    });

    const configs = [];

    if (ratings.size > 0) {
      configs.push({
        key: "rating",
        placeholder: "Rating",
        options: Array.from(ratings)
          .sort((a, b) => b - a)
          .map((r) => ({ label: `${r} Stars`, value: String(r) })),
      });
    }

    return configs;
  }, [testimonials]);

  return (
    <SectionEngine<Testimonial>
      data={data}
      isLoading={isLoading}
      error={error}
      searchPlaceholder="Filter testimonials by keyword..."
      searchFields={(item) => [item.message, item.authorName, item.authorPosition || ""]}
      filters={filters}
      renderCard={(item) => (
        <TestimonialCard testimonial={item} variant="classic" size="md" className="h-full w-full" />
      )}
    />
  );
}
