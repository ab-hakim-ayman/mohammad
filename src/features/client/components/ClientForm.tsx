"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateClientSchema } from "../schemas/client.schema";
import { Client, CreateClientPayload } from "../types/client.types";
import { Status } from "@/shared/types/enums";
import { createSelectOptions } from "@/shared/utils";

interface ClientFormProps {
  initialData?: Client;
  onSubmit: (data: CreateClientPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  [key: string]: any;
}

export function ClientForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: ClientFormProps) {
  const config: FormEngineConfig<CreateClientPayload> = {
    sections: [
      {
        title: "Basic Details",
        fields: [
          { name: "title", label: "Client Name", type: "text", required: true, gridSpan: 6 },
          { name: "slug", label: "Slug", type: "slug", sourceField: "title", required: true, gridSpan: 6 },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            gridSpan: 6,
            options: createSelectOptions(Status),
          },
          { name: "order", label: "Order", type: "number", gridSpan: 6 },
          { name: "website", label: "Website Url", type: "text", placeholder: "https://example.com", gridSpan: 12 },
          { name: "shortDesc", label: "Short Desc", type: "textarea", gridSpan: 12 },
          { name: "isFeatured", label: "Featured Client", type: "switch", gridSpan: 12 },
          {
            name: "contentJson",
            label: "Content",
            type: "editor",
            gridSpan: 12,
            editorProps: { variant: "client" },
          },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { name: "logo", label: "Client Logo", type: "media", mediaFolder: "clients", altTextField: "logoAlt" as any, gridSpan: 6 },
          { name: "heroImage", label: "Hero Image", type: "media", mediaFolder: "clients", altTextField: "heroImageAlt" as any, gridSpan: 6 },
          { name: "ogImage", label: "Og Image", type: "media", mediaFolder: "clients", altTextField: "ogImageAlt" as any, gridSpan: 12 },
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
      logo: initialData.logo || "",
      heroImage: initialData.heroImage || null,
      ogImage: initialData.ogImage || null,
      website: initialData.website || "",
    };
  }, [initialData]);

  return (
    <FormEngine
      schema={CreateClientSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save Client"
      folderPrefix="a2icoders"
    />
  );
}
