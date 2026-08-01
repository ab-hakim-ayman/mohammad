"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateIndustrySchema } from "../schemas/industry.schema";
import { Industry, CreateIndustryPayload } from "../types/industry.types";

interface IndustryFormProps {
  initialData?: Industry;
  onSubmit: (data: CreateIndustryPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  [key: string]: any;
}

export function IndustryForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: IndustryFormProps) {
  const config: FormEngineConfig<CreateIndustryPayload> = {
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
            options: [
              { label: "Draft", value: "DRAFT" },
              { label: "Published", value: "PUBLISHED" },
              { label: "Archived", value: "ARCHIVED" },
            ],
          },
          { name: "order", label: "Order", type: "number", gridSpan: 6 },
          { name: "icon", label: "Icon", type: "media", mediaFolder: "industries/icons", altTextField: "iconAlt" as any, gridSpan: 12 },
          { name: "shortDesc", label: "Short Desc", type: "textarea", gridSpan: 12 },
          { name: "isFeatured", label: "Is Featured", type: "switch", gridSpan: 12 },
          {
            name: "contentJson",
            label: "Content Required",
            type: "editor",
            gridSpan: 12,
            editorProps: { variant: "industry" },
          },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { name: "cardImage", label: "Card Image", type: "media", mediaFolder: "industries", altTextField: "cardImageAlt" as any, gridSpan: 6 },
          { name: "heroImage", label: "Hero Image", type: "media", mediaFolder: "industries", altTextField: "heroImageAlt" as any, gridSpan: 6 },
          { name: "heroVideoUrl", label: "Hero Video Url", type: "media", mediaFolder: "industries", acceptMedia: "video/*", showAltText: false, gridSpan: 6 },
          { name: "demoVideoUrl", label: "Demo Video Url", type: "media", mediaFolder: "industries", acceptMedia: "video/*", showAltText: false, gridSpan: 6 },
          { name: "ogImage", label: "Og Image", type: "media", mediaFolder: "industries", altTextField: "ogImageAlt" as any, gridSpan: 12 },
          { name: "galleryImages" as any, label: "Gallery Images", type: "media-gallery", mediaFolder: "industries/gallery", altTextsField: "galleryImagesAltTexts" as any, gridSpan: 12 },
        ],
      },
      {
        title: "Seo Details",
        fields: [
          { name: "seoTitle", label: "Seo Title", type: "text", gridSpan: 12 },
          { name: "seoDescription", label: "Seo Description", type: "textarea", gridSpan: 12 },
        ],
      },
    ],
  };

  const formattedDefaults = useMemo(() => {
    if (!initialData) return undefined;
    return {
      ...initialData,
      shortDesc: initialData.shortDesc || "",
      contentJson: initialData.contentJson || null,
      icon: initialData.icon || null,
      cardImage: initialData.cardImage || null,
      heroImage: initialData.heroImage || null,
      heroVideoUrl: initialData.heroVideoUrl || null,
      demoVideoUrl: initialData.demoVideoUrl || null,
      ogImage: initialData.ogImage || null,
      seoTitle: initialData.seoTitle || "",
      seoDescription: initialData.seoDescription || "",
      galleryImages: initialData.galleryImages || [],
    };
  }, [initialData]);

  return (
    <FormEngine
      schema={CreateIndustrySchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save Industry"
      folderPrefix="a2icoders"
    />
  );
}
