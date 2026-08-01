"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { AchievementTypeEnum, CreateAchievementSchema } from "../schemas/achievement.schema";
import { Achievement, CreateAchievementPayload } from "../types/achievement.types";
import { createSelectOptions } from "@/shared/utils";
import { AchievementType, Status } from "@/shared/types/enums";

interface AchievementFormProps {
  initialData?: Achievement;
  onSubmit: (data: CreateAchievementPayload) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function AchievementForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: AchievementFormProps) {
  const config: FormEngineConfig<CreateAchievementPayload> = {
    sections: [
      {
        title: "Basic Details",
        fields: [
          { name: "title", label: "Title", type: "text", required: true, gridSpan: 6 },
          { name: "slug", label: "Slug", type: "slug", sourceField: "title", required: true, gridSpan: 6 },
          { name: "issuer", label: "Issuer", type: "text", required: true, gridSpan: 6 },
          {
            name: "type",
            label: "Type",
            type: "select",
            required: true,
            gridSpan: 6,
            options: createSelectOptions(AchievementType)
          },
          { name: "achievedAt", label: "Achieved At", type: "date", gridSpan: 6 },
          { name: "order", label: "Order", type: "number", gridSpan: 6 },
          { name: "isFeatured", label: "Is Featured", type: "switch", gridSpan: 12 },
          { name: "shortDesc", label: "Short Desc", type: "textarea", gridSpan: 12 },
          {
            name: "contentJson",
            label: "Content",
            type: "editor",
            gridSpan: 12,
            editorProps: { variant: "achievement" },
          },
          { name: "certificateUrl", label: "Certificate Url", type: "text", gridSpan: 12 },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            gridSpan: 12,
            options: createSelectOptions(Status),
          },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { name: "icon", label: "Icon", type: "media", mediaFolder: "achievements/icons", altTextField: "iconAlt" as any, gridSpan: 6 },
          { name: "image", label: "Image", type: "media", mediaFolder: "achievements", altTextField: "imageAlt" as any, gridSpan: 6 },
          { name: "cardImage", label: "Card Image", type: "media", mediaFolder: "achievements", altTextField: "cardImageAlt" as any, gridSpan: 6 },
          { name: "heroImage", label: "Hero Image", type: "media", mediaFolder: "achievements", altTextField: "heroImageAlt" as any, gridSpan: 6 },
          { name: "ogImage", label: "Og Image", type: "media", mediaFolder: "achievements", altTextField: "ogImageAlt" as any, gridSpan: 12 },
        ],
      },
    ],
  };

  const formattedDefaults = useMemo(() => {
    if (!initialData) return undefined;
    return {
      ...initialData,
      achievedAt: initialData.achievedAt
        ? new Date(initialData.achievedAt).toISOString().split("T")[0]
        : "",
      shortDesc: initialData.shortDesc || "",
      contentJson: initialData.contentJson || null,
      icon: initialData.icon || null,
      image: initialData.image || null,
      cardImage: initialData.cardImage || null,
      heroImage: initialData.heroImage || null,
      ogImage: initialData.ogImage || null,
      certificateUrl: initialData.certificateUrl || "",
    };
  }, [initialData]);

  return (
    <FormEngine
      schema={CreateAchievementSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save Achievement"
      folderPrefix="a2icoders"
    />
  );
}
