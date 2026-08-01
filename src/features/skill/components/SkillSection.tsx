"use client";

import { useMemo } from "react";
import { usePublishedSkills } from "../hooks/useSkill";
import { SkillCard } from "./SkillCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Skill } from "../types/skill.types";

export function SkillSection() {
  const { data, isLoading, error } = usePublishedSkills(undefined);

  const skills = useMemo<Skill[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    const res = data as any;
    return res.data?.data || res.data || [];
  }, [data]);

  const filters = useMemo(() => {
    const list = new Set<string>();
    skills.forEach((item) => {
      item.categories?.forEach((cat) => {
        if (cat.title) list.add(cat.title);
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
  }, [skills]);

  return (
    <SectionEngine<Skill>
      data={data}
      isLoading={isLoading}
      error={error}
      searchKey="title"
      searchPlaceholder="Filter skills by keyword..."
      filters={filters}
      renderCard={(item) => (
        <SkillCard skill={item} variant="classic" size="md" className="h-full w-full" />
      )}
    />
  );
}
