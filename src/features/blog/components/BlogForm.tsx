"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateBlogSchema } from "../schemas/blog.schema";
import { Blog, CreateBlogPayload } from "../types/blog.types";
import { useCategories } from "@/features/category";
import { useTags } from "@/features/tag";
import { SelectOption } from "@/shared/components/Select";
import { createSelectOptions } from "@/shared/utils";
import { Status } from "@/shared/types/enums";

interface BlogFormProps {
  initialData?: Blog & {
    categories?: { id: string; title: string }[];
    tags?: { id: string; title: string }[];
  };
  onSubmit: (data: CreateBlogPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  categoryOptions?: SelectOption[];
  tagOptions?: SelectOption[];
}

export function BlogForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  categoryOptions: externalCategoryOptions,
  tagOptions: externalTagOptions,
}: BlogFormProps) {
  const { data: categoriesData } = useCategories(
    externalCategoryOptions ? undefined : { scope: "BLOG", limit: 100 }
  );
  const { data: tagsData } = useTags(
    externalTagOptions ? undefined : { limit: 100 }
  );

  const categoryOptions = useMemo(() => {
    if (externalCategoryOptions) return externalCategoryOptions;
    const items = (categoriesData as any)?.data?.data || categoriesData || [];
    return Array.isArray(items) ? items.map((c: any) => ({ label: c.title, value: c.id })) : [];
  }, [externalCategoryOptions, categoriesData]);

  const tagOptions = useMemo(() => {
    if (externalTagOptions) return externalTagOptions;
    const items = (tagsData as any)?.data?.data || tagsData || [];
    return Array.isArray(items) ? items.map((t: any) => ({ label: t.title, value: t.id })) : [];
  }, [externalTagOptions, tagsData]);

  const config: FormEngineConfig<CreateBlogPayload> = {
    sections: [
      {
        title: "Basic Details",
        fields: [
          { name: "title", label: "Title", type: "text", required: true, gridSpan: 6 },
          { name: "slug", label: "Slug", type: "slug", sourceField: "title", required: true, gridSpan: 6 },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            gridSpan: 6,
            options: createSelectOptions(Status),
          },
          { name: "readTime", label: "Read Time (Minutes)", type: "number", gridSpan: 6 },
          { name: "categories" as any, label: "Categories", type: "multiselect", options: categoryOptions, gridSpan: 6 },
          { name: "tags" as any, label: "Tags", type: "multiselect", options: tagOptions, gridSpan: 6 },
          { name: "isFeatured", label: "Is Featured", type: "switch", gridSpan: 12 },
          { name: "excerpt", label: "Excerpt", type: "textarea", gridSpan: 12 },
          {
            name: "contentJson",
            label: "Content Required",
            type: "editor",
            gridSpan: 12,
            editorProps: { variant: "blog" },
            onEditorChangeExtra: (json, methods) => {
              if (!methods.getValues("readTime") && json?.blocks) {
                const estimatedWords = json.blocks.length * 30;
                methods.setValue("readTime", Math.max(1, Math.ceil(estimatedWords / 200)));
              }
            },
          },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { name: "cardImage", label: "Card Image", type: "media", mediaFolder: "blogs", altTextField: "cardImageAlt" as any, gridSpan: 6 },
          { name: "heroImage", label: "Hero Image", type: "media", mediaFolder: "blogs", altTextField: "heroImageAlt" as any, gridSpan: 6 },
          { name: "heroVideoUrl", label: "Hero Video Url", type: "media", acceptMedia: "video/*", mediaFolder: "blogs", gridSpan: 6 },
          { name: "demoVideoUrl", label: "Demo Video Url", type: "media", acceptMedia: "video/*", mediaFolder: "blogs", gridSpan: 6 },
          { name: "ogImage", label: "Og Image", type: "media", mediaFolder: "blogs", altTextField: "ogImageAlt" as any, gridSpan: 12 },
          { name: "galleryImages", label: "Gallery Images", type: "media-gallery", mediaFolder: "blogs/gallery", altTextsField: "galleryImagesAltTexts" as any, gridSpan: 12 },
        ],
      },
      {
        title: "SEO Settings",
        fields: [
          { name: "seoTitle", label: "SEO Title", type: "text", gridSpan: 12 },
          { name: "seoDescription", label: "SEO Description", type: "textarea", gridSpan: 12 },
        ],
      },
    ],
  };

  const formattedDefaults = initialData
    ? {
      ...initialData,
      categories: initialData.categories?.map((c) => c.id) || [],
      tags: initialData.tags?.map((t) => t.id) || [],
    }
    : undefined;

  return (
    <FormEngine
      schema={CreateBlogSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText={initialData ? "Save Blog" : "Save Blog"}
      folderPrefix="a2icoders"
    />
  );
}