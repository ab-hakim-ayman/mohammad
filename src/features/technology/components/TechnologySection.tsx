"use client";

import { useMemo } from "react";
import { usePublishedTechnologies } from "../hooks/useTechnology";
import { TechnologyCard } from "./TechnologyCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Technology } from "../types/technology.types";

export function TechnologySection() {
  const { data, isLoading, error } = usePublishedTechnologies(undefined);

  const technologies = useMemo<Technology[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    const res = data as any;
    return res.data?.data || res.data || [];
  }, [data]);

  const filters = useMemo(() => {
    const categories = new Set<string>();
    technologies.forEach((item) => {
      item.categories?.forEach((cat: any) => {
        const title = cat.title || cat.name;
        if (title) categories.add(title);
      });
    });

    if (categories.size === 0) return [];

    return [
      {
        key: "categories",
        placeholder: "Category",
        options: Array.from(categories).map((c) => ({ label: c, value: c })),
      },
    ];
  }, [technologies]);

  return (
    <SectionEngine<Technology>
      data={data}
      isLoading={isLoading}
      error={error}
      searchKey="title"
      searchPlaceholder="Filter technologies by keyword..."
      filters={filters}
      renderCard={(item) => (
        <TechnologyCard technology={item} variant="classic" size="md" className="h-full w-full" />
      )}
    />
  );
}
