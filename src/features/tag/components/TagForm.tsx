"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateTagSchema } from "../schemas/tag.schema";
import { Tag, CreateTagPayload } from "../types/tag.types";

interface TagFormProps {
  initialData?: Tag;
  onSubmit: (data: CreateTagPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  [key: string]: any;
}

export function TagForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: TagFormProps) {
  const config: FormEngineConfig<CreateTagPayload> = {
    sections: [
      {
        title: "Basic Details",
        fields: [
          { name: "title", label: "Title", type: "text", required: true, gridSpan: 6 },
          { name: "slug", label: "Slug", type: "slug", sourceField: "title", required: true, gridSpan: 6 },
          { name: "shortDesc", label: "Short Desc", type: "textarea", gridSpan: 12 },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            gridSpan: 12,
            options: [
              { label: "Draft", value: "DRAFT" },
              { label: "Published", value: "PUBLISHED" },
              { label: "Archived", value: "ARCHIVED" },
            ],
          },
        ],
      },
    ],
  };

  const formattedDefaults = useMemo(() => {
    if (!initialData) return undefined;
    return {
      ...initialData,
      shortDesc: initialData.shortDesc || "",
    };
  }, [initialData]);

  return (
    <FormEngine
      schema={CreateTagSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save"
      folderPrefix="a2icoders"
    />
  );
}
