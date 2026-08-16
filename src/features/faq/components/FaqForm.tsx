"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateFaqSchema } from "../schemas/faq.schema";
import { CreateFaqPayload, Faq } from "../types/faq.types";
import { useCategories } from "@/features/category";
import { useServices } from "@/features/service";
import { SelectOption } from "@/shared/components/Select";
import { createSelectOptions } from "@/shared/utils";
import { Status } from "@/shared/types/enums";

interface FaqFormProps {
  initialData?: Faq;
  onSubmit: (data: CreateFaqPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  categoryOptions?: SelectOption[];
  serviceOptions?: SelectOption[];
  [key: string]: any;
}

export function FaqForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  categoryOptions: externalCategoryOptions,
  serviceOptions: externalServiceOptions,
}: FaqFormProps) {
  const { data: categoriesData } = useCategories(
    externalCategoryOptions ? undefined : { scope: "FAQ", limit: 100 }
  );
  const { data: servicesData } = useServices(externalServiceOptions ? undefined : { limit: 100 });

  const categoryOptions = useMemo(() => {
    if (externalCategoryOptions) return externalCategoryOptions;
    const items = Array.isArray(categoriesData)
      ? categoriesData
      : (categoriesData as any)?.data?.data || (categoriesData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.title, value: item.id })) : [];
  }, [externalCategoryOptions, categoriesData]);

  const serviceOptions = useMemo(() => {
    if (externalServiceOptions) return externalServiceOptions;
    const items = Array.isArray(servicesData)
      ? servicesData
      : (servicesData as any)?.data?.data || (servicesData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.title, value: item.id })) : [];
  }, [externalServiceOptions, servicesData]);

  const config: FormEngineConfig<CreateFaqPayload> = {
    sections: [
      {
        title: "Basic Details",
        fields: [
          { name: "question", label: "Question", type: "text", required: true, gridSpan: 12 },
          { name: "answer", label: "Answer", type: "textarea", required: true, gridSpan: 12 },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            gridSpan: 6,
            options: createSelectOptions(Status)
          },
          { name: "order", label: "Order", type: "number", gridSpan: 6 },
          { name: "categoryIds" as any, label: "Categories", type: "multiselect", options: categoryOptions, gridSpan: 6 },
          { name: "serviceIds" as any, label: "Services", type: "multiselect", options: serviceOptions, gridSpan: 6 },
          { name: "isFeatured", label: "Is Featured", type: "switch", gridSpan: 12 },
        ],
      },
    ],
  };

  const formattedDefaults = useMemo(() => {
    if (!initialData) return undefined;
    return {
      ...initialData,
      categoryIds: initialData.categories?.map((c) => c.id) || [],
      serviceIds: initialData.services?.map((s) => s.id) || [],
    };
  }, [initialData]);

  return (
    <FormEngine
      schema={CreateFaqSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save Faq"
      folderPrefix="a2icoders"
    />
  );
}
