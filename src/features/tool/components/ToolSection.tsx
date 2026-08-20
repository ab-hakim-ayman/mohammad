"use client";

import { useMemo } from "react";
import { usePublishedTools } from "../hooks/useTool";
import type { Tool } from "../types/tool.types";
import { ToolCard } from "./ToolCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";

export function ToolSection() {
  const { data, isLoading, error } = usePublishedTools();

  const tools = useMemo(() => {
    if (Array.isArray(data)) return data;
    return (data as any)?.data || [];
  }, [data]);

  return (
    <SectionEngine<Tool>
      data={tools}
      isLoading={isLoading}
      error={error}
      pageSize={12}
      layout="grid"
      columns={3}
      gap="default"
      showToolbar={true}
      showPagination={true}
      dateKey="createdAt"
      searchPlaceholder="Search developer tools..."
      itemCountLabel="tools"
      searchFields={(tool) => [
        tool.title,
        tool.shortDesc || "",
        ...(tool.categories?.map((c) => c.title) || []),
        tool.slug,
      ]}
      filters={[
        {
          key: "categories",
          placeholder: "Category",
          type: "select",
        },
      ]}
      skeletonHeightClassName="h-[220px]"
      renderCard={(tool) => <ToolCard key={tool.id} tool={tool} />}
    />
  );
}
