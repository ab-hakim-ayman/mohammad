"use client";

import { usePublishedTags } from "../hooks/useTag";
import { TagCard } from "./TagCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Tag } from "../types/tag.types";

export function TagSection() {
  const { data, isLoading, error } = usePublishedTags();

  return (
    <SectionEngine<Tag>
      data={data}
      isLoading={isLoading}
      error={error}
      searchKey="title"
      searchPlaceholder="Search tags..."
      renderCard={(item) => <TagCard tag={item} className="h-full w-full" />}
    />
  );
}
