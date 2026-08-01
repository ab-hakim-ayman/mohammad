"use client";

import { useMemo } from "react";
import { usePublishedServices } from "../hooks/useService";
import { ServiceCard } from "./ServiceCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Service } from "../types/service.types";

export function ServiceSection() {
  const { data, isLoading, error } = usePublishedServices();

  const services = useMemo<Service[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.data?.data || data.data || [];
  }, [data]);

  const filters = useMemo(() => {
    const list = new Set<string>();
    services.forEach((item) => {
      item.categories?.forEach((cat) => {
        if (cat.title || cat.name) list.add(cat.title || cat.name);
      });
    });

    if (list.size === 0) return [];

    return [
      {
        key: "categories",
        placeholder: "Category",
        options: Array.from(list).map((cat) => ({ label: cat, value: cat })),
      },
    ];
  }, [services]);

  return (
    <SectionEngine<Service>
      data={data}
      isLoading={isLoading}
      error={error}
      searchKey="title"
      searchPlaceholder="Filter services by keyword..."
      filters={filters}
      renderCard={(item) => (
        <ServiceCard service={item} variant="classic" size="md" className="h-full w-full" />
      )}
    />
  );
}
