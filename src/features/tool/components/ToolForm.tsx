"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import type { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { createToolSchema } from "../schemas/tool.schema";
import type { Tool, CreateToolPayload } from "../types/tool.types";
import { useCategories } from "@/features/category";
import type { SelectOption } from "@/shared/components/Select";

interface ToolFormProps {
  initialData?: Tool;
  onSubmit: (data: CreateToolPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  categoryOptions?: SelectOption[];
}

export function ToolForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  categoryOptions: externalCategoryOptions,
}: ToolFormProps) {
  const { data: categoriesData } = useCategories(
    externalCategoryOptions ? undefined : { scope: "TOOL", limit: 100 }
  );

  const categoryOptions = useMemo(() => {
    if (externalCategoryOptions) return externalCategoryOptions;
    const items = Array.isArray(categoriesData)
      ? categoriesData
      : (categoriesData as any)?.data?.data || (categoriesData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.title, value: item.id })) : [];
  }, [externalCategoryOptions, categoriesData]);

  const config: FormEngineConfig<CreateToolPayload> = {
    sections: [
      {
        title: "Basic Tool Details",
        description: "General metadata and display information for the tool directory.",
        fields: [
          { name: "title", label: "Tool Title", type: "text", required: true, gridSpan: 6 },
          { name: "slug", label: "Custom Slug (Optional)", type: "text", gridSpan: 6 },
          {
            name: "categoryIds" as any,
            label: "Categories",
            type: "multiselect",
            options: categoryOptions,
            gridSpan: 6,
          },
          { name: "icon", label: "ICON", type: "media", mediaFolder: "tools", altTextField: "iconAlt" as any, gridSpan: 6 },
          { name: "shortDesc", label: "Short Description", type: "textarea", gridSpan: 12 },
        ],
      },
      {
        title: "Smart Hybrid Execution Engine",
        description: "Configure client-side schema transformations or custom interactive components.",
        fields: [
          {
            name: "engineType",
            label: "Engine Type",
            type: "select",
            required: true,
            gridSpan: 4,
            options: [
              { label: "Schema", value: "SCHEMA" },
              { label: "Custom", value: "CUSTOM" },
            ],
          },
          {
            name: "actionKey",
            label: "Action Key (for SCHEMA engines)",
            type: "text",
            placeholder: "e.g. BASE64_ENCODE, JSON_FORMAT, UUID_GEN",
            gridSpan: 4,
          },
          {
            name: "componentKey",
            label: "Component Key (for CUSTOM engines)",
            type: "text",
            placeholder: "e.g. Base64Tool, JsonFormatterTool, JwtDecoderTool, UuidGeneratorTool",
            gridSpan: 4,
          },
        ],
      },
      {
        title: "Visibility & Status",
        description: "Set publishing status, order, and homepage featuring.",
        fields: [
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
          { name: "order", label: "Display Order", type: "number", gridSpan: 6 },
          { name: "isFeatured", label: "Feature on Homepage", type: "switch", gridSpan: 6 },
        ],
      },
      {
        title: "Media & SEO",
        description: "Optional images and search engine optimization parameters.",
        fields: [
          { name: "cardImage", label: "Card Image URL", type: "media", mediaFolder: "tools", gridSpan: 6 },
          { name: "heroImage", label: "Hero Image URL", type: "media", mediaFolder: "tools", gridSpan: 6 },
          { name: "seoTitle", label: "SEO Meta Title", type: "text", gridSpan: 6 },
          { name: "seoDescription", label: "SEO Meta Description", type: "textarea", gridSpan: 6 },
        ],
      },
    ],
  };

  const formattedDefaults = useMemo(() => {
    if (!initialData) return undefined;
    return {
      ...initialData,
      slug: initialData.slug || "",
      shortDesc: initialData.shortDesc || "",
      icon: initialData.icon || "",
      categoryIds: initialData.categories?.map((c: any) => c.id) || [],
      actionKey: initialData.actionKey || "",
      componentKey: initialData.componentKey || "",
      cardImage: initialData.cardImage || null,
      heroImage: initialData.heroImage || null,
      seoTitle: initialData.seoTitle || "",
      seoDescription: initialData.seoDescription || "",
    };
  }, [initialData]);

  return (
    <FormEngine
      schema={createToolSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save Tool"
      folderPrefix="a2icoders"
    />
  );
}
