"use client";

import { useMemo } from "react";
import { usePublishedCategories } from "../hooks/useCategory";
import { CategoryCard } from "./CategoryCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Category } from "../types/category.types";

export function CategorySection() {
  const { data, isLoading, error } = usePublishedCategories();

  const categories = useMemo<Category[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    const res = data as any;
    return res.data?.data || res.data || [];
  }, [data]);

  const filters = useMemo(() => {
    const list = new Set<string>();
    categories.forEach((item) => {
      if (item.scope) list.add(item.scope);
    });

    if (list.size === 0) return [];

    return [
      {
        key: "scope",
        placeholder: "Scope",
        options: Array.from(list).map((scp) => ({ label: scp.replace("_", " "), value: scp })),
      },
    ];
  }, [categories]);

  return (
    <SectionEngine<Category>
      data={data}
      isLoading={isLoading}
      error={error}
      searchKey="title"
      searchPlaceholder="Search categories..."
      filters={filters}
      renderCard={(item) => <CategoryCard category={item} className="h-full w-full" />}
    />
  );
}
