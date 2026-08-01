"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreatePartnerSchema } from "../schemas/partner.schema";
import { Partner, CreatePartnerPayload } from "../types/partner.types";

interface PartnerFormProps {
  initialData?: Partner;
  onSubmit: (data: CreatePartnerPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  [key: string]: any;
}

export function PartnerForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: PartnerFormProps) {
  const config: FormEngineConfig<CreatePartnerPayload> = {
    sections: [
      {
        title: "Basic Details",
        fields: [
          { name: "title", label: "Title", type: "text", required: true, gridSpan: 6 },
          {
            name: "type",
            label: "Type",
            type: "select",
            required: true,
            gridSpan: 6,
            options: [
              { label: "Technology", value: "TECHNOLOGY" },
              { label: "Reseller", value: "RESELLER" },
              { label: "Alliance", value: "ALLIANCE" },
              { label: "Affiliate", value: "AFFILIATE" },
            ],
          },
          { name: "website", label: "Website", type: "text", placeholder: "https://example.com", gridSpan: 6 },
          { name: "order", label: "Order", type: "number", gridSpan: 6 },
          { name: "shortDesc", label: "Short Desc", type: "textarea", placeholder: "Brief description of the partnership...", gridSpan: 12 },
          { name: "logo", label: "Logo", type: "media", mediaFolder: "partners", altTextField: "logoAlt" as any, gridSpan: 12 },
          { name: "isFeatured", label: "Is Featured", type: "switch", gridSpan: 12 },
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
      logo: initialData.logo || "",
      website: initialData.website || "",
      shortDesc: initialData.shortDesc || "",
    };
  }, [initialData]);

  return (
    <FormEngine
      schema={CreatePartnerSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save Partner"
      folderPrefix="a2icoders"
    />
  );
}
