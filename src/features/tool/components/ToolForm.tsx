"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import type { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { createToolSchema } from "../schemas/tool.schema";
import type { Tool, CreateToolPayload } from "../types/tool.types";

interface ToolFormProps {
  initialData?: Tool;
  onSubmit: (data: CreateToolPayload) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function ToolForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: ToolFormProps) {
  const config: FormEngineConfig<CreateToolPayload> = {
    sections: [
      {
        title: "Basic Tool Details",
        description: "General metadata and display information for the tool directory.",
        fields: [
          { name: "title", label: "Tool Title", type: "text", required: true, gridSpan: 6 },
          { name: "slug", label: "Custom Slug (Optional)", type: "text", gridSpan: 6 },
          {
            name: "category",
            label: "Category",
            type: "select",
            required: true,
            gridSpan: 6,
            options: [
              { label: "Developer", value: "DEVELOPER" },
              { label: "Encoding & Decoding", value: "ENCODING" },
              { label: "Security & Crypto", value: "SECURITY" },
              { label: "Formatters & Validators", value: "FORMATTER" },
              { label: "Generators", value: "GENERATOR" },
              { label: "Converters", value: "CONVERTER" },
              { label: "General Utility", value: "UTILITY" },
            ],
          },
          { name: "icon", label: "Icon / Emoji (e.g. 🔑, ⚡, 🛠️)", type: "text", gridSpan: 6 },
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
              { label: "SCHEMA (Standard Transformation)", value: "SCHEMA" },
              { label: "CUSTOM (Interactive React Component)", value: "CUSTOM" },
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
            gridSpan: 4,
            options: [
              { label: "Draft", value: "DRAFT" },
              { label: "Published", value: "PUBLISHED" },
              { label: "Archived", value: "ARCHIVED" },
            ],
          },
          { name: "isFeatured", label: "Feature on Homepage", type: "switch", gridSpan: 4 },
          { name: "order", label: "Display Order", type: "number", gridSpan: 4 },
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
