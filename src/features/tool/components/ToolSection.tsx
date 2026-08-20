"use client";

import { useMemo, useState } from "react";
import { usePublishedTools } from "../hooks/useTool";
import type { Tool } from "../types/tool.types";
import { ToolCard } from "./ToolCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Input } from "@/components/ui/input";
import { Search, Filter, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  { id: "ALL", label: "All Tools" },
  { id: "DEVELOPER", label: "Developer" },
  { id: "ENCODING", label: "Encoding" },
  { id: "SECURITY", label: "Security & Crypto" },
  { id: "FORMATTER", label: "Formatters" },
  { id: "GENERATOR", label: "Generators" },
  { id: "CONVERTER", label: "Converters" },
  { id: "UTILITY", label: "Utilities" },
];

export function ToolSection() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = usePublishedTools({
    category: selectedCategory === "ALL" ? undefined : selectedCategory,
    search: searchQuery.trim() !== "" ? searchQuery : undefined,
  });

  const tools = useMemo(() => {
    if (Array.isArray(data)) return data;
    return (data as any)?.data || [];
  }, [data]);

  return (
    <div className="w-full space-y-8">
      {/* Category Filter & Search Bar */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                    : "border border-border/60 bg-card/40 text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search developer tools..."
            className="h-10 rounded-xl border-border/70 bg-card/60 pl-10 pr-4 text-xs shadow-sm transition focus:border-primary focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Grid List using SectionEngine */}
      <SectionEngine<Tool>
        data={tools}
        isLoading={isLoading}
        error={error}
        pageSize={12}
        layout="grid"
        columns={3}
        gap="default"
        showToolbar={false}
        showPagination={true}
        skeletonHeightClassName="h-[220px]"
        renderCard={(tool) => <ToolCard key={tool.id} tool={tool} />}
      />
    </div>
  );
}
