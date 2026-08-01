"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateGallerySchema } from "../schemas/gallery.schema";
import { Gallery, CreateGalleryPayload } from "../types/gallery.types";

interface GalleryFormProps {
  initialData?: Gallery;
  onSubmit: (data: CreateGalleryPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  [key: string]: any;
}

export function GalleryForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: GalleryFormProps) {
  const config: FormEngineConfig<CreateGalleryPayload> = {
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
          { name: "shortDesc", label: "Short Desc", type: "textarea", gridSpan: 12 },
          {
            name: "contentJson",
            label: "Content Required",
            type: "editor",
            gridSpan: 12,
            editorProps: { variant: "gallery" },
          },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { name: "coverImage", label: "Cover Image", type: "media", mediaFolder: "galleries", altTextField: "coverImageAlt" as any, gridSpan: 6 },
          { name: "ogImage", label: "Og Image", type: "media", mediaFolder: "galleries", altTextField: "ogImageAlt" as any, gridSpan: 6 },
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
      coverImage: initialData.coverImage || null,
      ogImage: initialData.ogImage || null,
    };
  }, [initialData]);

  return (
    <FormEngine
      schema={CreateGallerySchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save Gallery"
      folderPrefix="a2icoders"
    />
  );
}
