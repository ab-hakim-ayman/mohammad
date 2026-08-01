"use client";

import { useMemo } from "react";
import { usePublishedIndustries } from "../hooks/useIndustry";
import { IndustryCard } from "./IndustryCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Industry } from "../types/industry.types";

interface IndustrySectionProps {
  limit?: number;
}

export function IndustrySection({ limit = 100 }: IndustrySectionProps) {
  const { data, isLoading, error } = usePublishedIndustries(limit);

  const industries = useMemo<Industry[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    const res = data as any;
    return res.data?.data || res.data || [];
  }, [data]);

  const filters = useMemo(() => {
    const list = new Set<string>();
    const hasFeatured = new Set<boolean>();

    industries.forEach((item) => {
      hasFeatured.add(item.isFeatured);
      item.services?.forEach((service) => {
        if (service.title) list.add(service.title);
      });
    });

    const configs = [];

    if (list.size > 0) {
      configs.push({
        key: "services",
        placeholder: "Service",
        options: Array.from(list).map((svc) => ({ label: svc, value: svc })),
      });
    }

    if (hasFeatured.size > 0) {
      configs.push({
        key: "isFeatured",
        placeholder: "Type",
        options: [
          { label: "Featured Industries", value: "true" },
          { label: "Regular Industries", value: "false" },
        ],
      });
    }

    return configs;
  }, [industries]);

  return (
    <SectionEngine<Industry>
      data={data}
      isLoading={isLoading}
      error={error}
      searchKey="title"
      searchPlaceholder="Search industries..."
      filters={filters}
      renderCard={(item) => (
        <IndustryCard industry={item} variant="classic" size="md" className="h-full w-full" />
      )}
    />
  );
}
