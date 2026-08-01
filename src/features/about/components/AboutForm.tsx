"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateAboutSchema } from "../schemas/about.schema";
import { About, CreateAboutPayload } from "../types/about.types";
import { createSelectOptions } from "@/shared/utils";
import { Status } from "@/shared/types/enums";

interface AboutFormProps {
  initialData?: About;
  onSubmit: (data: CreateAboutPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  [key: string]: any;
}

export function AboutForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: AboutFormProps) {
  const config: FormEngineConfig<CreateAboutPayload> = {
    sections: [
      {
        title: "Basic Details",
        fields: [
          { name: "title", label: "Title", type: "text", required: true, gridSpan: 6 },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            gridSpan: 6,
            options: createSelectOptions(Status)
          },
          { name: "shortDesc", label: "Short Desc", type: "textarea", gridSpan: 12 },
          {
            name: "contentJson",
            label: "Content Required",
            type: "editor",
            gridSpan: 12,
            editorProps: { variant: "about" },
          },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { name: "heroImage", label: "Hero Image", type: "media", mediaFolder: "abouts", altTextField: "heroImageAlt" as any, gridSpan: 6 },
          { name: "ogImage", label: "Og Image", type: "media", mediaFolder: "abouts/og", altTextField: "ogImageAlt" as any, gridSpan: 6 },
          { name: "galleryImages" as any, label: "Gallery Images", type: "media-gallery", mediaFolder: "abouts/gallery", altTextsField: "galleryImagesAltTexts" as any, gridSpan: 12 },
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
      heroImage: initialData.heroImage || null,
      ogImage: initialData.ogImage || null,
      galleryImages: initialData.galleryImages || [],
    };
  }, [initialData]);

  const onFormSubmit = async (data: CreateAboutPayload) => {
    const payload = {
      ...data,
      contentJson:
        typeof data.contentJson === "string" && data.contentJson.trim() === ""
          ? null
          : data.contentJson,
    };
    await onSubmit(payload);
  };

  return (
    <FormEngine
      schema={CreateAboutSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onFormSubmit}
      isSubmitting={isSubmitting}
      submitText="Save"
      folderPrefix="a2icoders"
    />
  );
}
