"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateTechnologySchema } from "../schemas/technology.schema";
import { Technology, CreateTechnologyPayload } from "../types/technology.types";
import { useCategories } from "@/features/category";
import { useTags } from "@/features/tag";
import { SelectOption } from "@/shared/components/Select";

interface TechnologyFormProps {
  initialData?: Technology;
  onSubmit: (data: CreateTechnologyPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  categoryOptions?: SelectOption[];
  tagOptions?: SelectOption[];
  [key: string]: any;
}

export function TechnologyForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  categoryOptions: externalCategoryOptions,
  tagOptions: externalTagOptions,
}: TechnologyFormProps) {
  const { data: categoriesData } = useCategories(
    externalCategoryOptions ? undefined : { scope: "TECHNOLOGY", limit: 100 }
  );
  const { data: tagsData } = useTags(externalTagOptions ? undefined : { limit: 100 });

  const categoryOptions = useMemo(() => {
    if (externalCategoryOptions) return externalCategoryOptions;
    const items = Array.isArray(categoriesData)
      ? categoriesData
      : (categoriesData as any)?.data?.data || (categoriesData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.title, value: item.id })) : [];
  }, [externalCategoryOptions, categoriesData]);

  const tagOptions = useMemo(() => {
    if (externalTagOptions) return externalTagOptions;
    const items = Array.isArray(tagsData)
      ? tagsData
      : (tagsData as any)?.data?.data || (tagsData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.title, value: item.id })) : [];
  }, [externalTagOptions, tagsData]);

  const config: FormEngineConfig<CreateTechnologyPayload> = {
    sections: [
      {
        title: "Basic Details",
        fields: [
          { name: "title", label: "Title", type: "text", required: true, gridSpan: 6 },
          { name: "logo", label: "Logo", type: "media", mediaFolder: "technologies", altTextField: "logoAlt" as any, gridSpan: 6 },
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
          { name: "shortDesc", label: "Short Desc", type: "textarea", gridSpan: 12 },
        ],
      },
    ],
  };

  const formattedDefaults = useMemo(() => {
    if (!initialData) return undefined;
    return {
      ...initialData,
      shortDesc: initialData.shortDesc || "",
      logo: initialData.logo || null,
      categoryIds: initialData.categories?.map((c: any) => c.id) || [],
      tagIds: initialData.tags?.map((t: any) => t.id) || [],
    };
  }, [initialData]);

  return (
    <FormEngine
      schema={CreateTechnologySchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save"
      folderPrefix="a2icoders"
    />
  );
}
