"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateSkillSchema } from "../schemas/skill.schema";
import { Skill, CreateSkillPayload } from "../types/skill.types";
import { useCategories } from "@/features/category";
import { useTags } from "@/features/tag";
import { SelectOption } from "@/shared/components/Select";

interface SkillFormProps {
  initialData?: Skill;
  onSubmit: (data: CreateSkillPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  categoryOptions?: SelectOption[];
  tagOptions?: SelectOption[];
}

export function SkillForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  categoryOptions: externalCategoryOptions,
  tagOptions: externalTagOptions,
}: SkillFormProps) {
  const { data: categoriesData } = useCategories(
    externalCategoryOptions ? undefined : { scope: "SKILL", limit: 100 }
  );
  const { data: tagsData } = useTags(externalTagOptions ? undefined : { limit: 100 });

  const categoryOptions = useMemo(() => {
    if (externalCategoryOptions) return externalCategoryOptions;
    const items = Array.isArray(categoriesData)
      ? categoriesData
      : (categoriesData as any)?.data?.data || (categoriesData as any)?.data || [];
    return Array.isArray(items) ? items.map((c: any) => ({ label: c.title, value: c.id })) : [];
  }, [externalCategoryOptions, categoriesData]);

  const tagOptions = useMemo(() => {
    if (externalTagOptions) return externalTagOptions;
    const items = Array.isArray(tagsData)
      ? tagsData
      : (tagsData as any)?.data?.data || (tagsData as any)?.data || [];
    return Array.isArray(items) ? items.map((t: any) => ({ label: t.title, value: t.id })) : [];
  }, [externalTagOptions, tagsData]);

  const config: FormEngineConfig<CreateSkillPayload> = {
    sections: [
      {
        title: "Basic Details",
        fields: [
          { name: "title", label: "Title", type: "text", required: true, gridSpan: 6 },
          { name: "icon", label: "Icon", type: "media", mediaFolder: "skills", altTextField: "iconAlt" as any, gridSpan: 6 },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            gridSpan: 6,
            options: [
              { label: "Draft", value: "DRAFT" },
              { label: "Published", value: "PUBLISHED" },
              { label: "Archived", value: "ARCHIVED" },
            ],
          },
          { name: "order", label: "Order", type: "number", gridSpan: 6 },
          { name: "categoryIds" as any, label: "Categories", type: "multiselect", options: categoryOptions, gridSpan: 6 },
          { name: "tagIds" as any, label: "Tags", type: "multiselect", options: tagOptions, gridSpan: 6 },
          { name: "shortDesc", label: "Short Description", type: "textarea", gridSpan: 12 },
        ],
      },
    ],
  };

  const formattedDefaults = useMemo(() => {
    if (!initialData) return undefined;
    return {
      ...initialData,
      shortDesc: initialData.shortDesc || "",
      categoryIds: initialData.categories?.map((c: any) => c.id) || [],
      tagIds: initialData.tags?.map((t: any) => t.id) || [],
    };
  }, [initialData]);

  return (
    <FormEngine
      schema={CreateSkillSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save"
      folderPrefix="a2icoders"
    />
  );
}
