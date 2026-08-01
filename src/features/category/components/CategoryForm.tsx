"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateCategorySchema } from "../schemas/category.schema";
import { CategoryScope, Status } from "@/shared/types/enums";
import { Category, CreateCategoryPayload } from "../types/category.types";
import { createSelectOptions } from "@/shared/utils";

interface CategoryFormProps {
  initialData?: Category;
  onSubmit: (data: CreateCategoryPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  [key: string]: any;
}

export function CategoryForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: CategoryFormProps) {
  const config: FormEngineConfig<CreateCategoryPayload> = {
    sections: [
      {
        title: "Basic Details",
        fields: [
          { name: "title", label: "Title", type: "text", required: true, gridSpan: 6 },
          { name: "slug", label: "Slug", type: "slug", sourceField: "title", required: true, gridSpan: 6 },
          {
            name: "scope",
            label: "Scope",
            type: "select",
            required: true,
            gridSpan: 6,
            options: createSelectOptions(CategoryScope),
          },
          { name: "order", label: "Display Order", type: "number", gridSpan: 6 },
          { name: "shortDesc", label: "Short Desc", type: "textarea", gridSpan: 12 },
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
      schema={CreateCategorySchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save"
      folderPrefix="a2icoders"
    />
  );
}
