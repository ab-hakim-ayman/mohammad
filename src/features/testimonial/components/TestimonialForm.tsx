"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateTestimonialSchema } from "../schemas/testimonial.schema";
import { Testimonial, CreateTestimonialPayload } from "../types/testimonial.types";

interface TestimonialFormProps {
  initialData?: Testimonial;
  onSubmit: (data: CreateTestimonialPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  [key: string]: any;
}

const toDateTimeLocal = (date?: string | Date | null) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  const YYYY = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const DD = String(d.getDate()).padStart(2, "0");
  const HH = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${YYYY}-${MM}-${DD}T${HH}:${mm}`;
};

export function TestimonialForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: TestimonialFormProps) {
  const config: FormEngineConfig<CreateTestimonialPayload> = {
    sections: [
      {
        title: "Basic Details",
        fields: [
          { name: "authorName", label: "Author Name", type: "text", required: true, gridSpan: 6 },
          { name: "authorPosition", label: "Author Position", type: "text", required: true, gridSpan: 6 },
          { name: "message", label: "Message", type: "textarea", required: true, gridSpan: 12 },
          { name: "rating", label: "Rating (1-5)", type: "number", gridSpan: 6 },
          { name: "order", label: "Order", type: "number", gridSpan: 6 },
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
          {
            name: "type",
            label: "Type",
            type: "select",
            required: true,
            gridSpan: 6,
            options: [
              { label: "Client", value: "CLIENT" },
              { label: "Employee", value: "EMPLOYEE" },
            ],
          },
          {
            name: "source",
            label: "Source",
            type: "select",
            required: true,
            gridSpan: 6,
            options: [
              { label: "Admin Source", value: "ADMIN" },
              { label: "Request Link Source", value: "REQUEST_LINK" },
              { label: "Public Form Source", value: "PUBLIC_FORM" },
            ],
          },
          { name: "email", label: "Email", type: "text", placeholder: "email@example.com", gridSpan: 6 },
          {
            name: "clientId",
            label: "Client Id",
            type: "text",
            placeholder: "Client Id Placeholder",
            gridSpan: 12,
            condition: (values) => values.type === "CLIENT",
          },
          {
            name: "employeeId",
            label: "Employee Id",
            type: "text",
            required: true,
            placeholder: "Employee Id Placeholder",
            gridSpan: 12,
            condition: (values) => values.type === "EMPLOYEE",
          },
          { name: "submittedAt", label: "Submitted At", type: "datetime-local" as any, gridSpan: 6 },
          { name: "consentAt", label: "Consent At", type: "datetime-local" as any, gridSpan: 6 },
          { name: "isFeatured", label: "Is Featured", type: "switch", gridSpan: 12 },
        ],
      },
      {
        title: "Author Image",
        fields: [
          { name: "authorImage", label: "Author Image", type: "media", mediaFolder: "testimonials", altTextField: "authorImageAlt" as any, gridSpan: 12 },
        ],
      },
    ],
  };

  const formattedDefaults = useMemo(() => {
    if (!initialData) return undefined;
    return {
      ...initialData,
      rating: initialData.rating || 5,
      clientId: initialData.clientId || "",
      employeeId: initialData.employeeId || "",
      submittedAt: initialData.submittedAt ? toDateTimeLocal(initialData.submittedAt) : "",
      consentAt: initialData.consentAt ? toDateTimeLocal(initialData.consentAt) : "",
      authorImage: initialData.authorImage || null,
      email: initialData.email || "",
    };
  }, [initialData]);

  const onFormSubmit = async (data: CreateTestimonialPayload) => {
    const payload = {
      ...data,
      clientId: data.clientId || null,
      employeeId: data.type === "EMPLOYEE" ? data.employeeId : null,
      submittedAt: data.submittedAt ? new Date(data.submittedAt).toISOString() : null,
      consentAt: data.consentAt ? new Date(data.consentAt).toISOString() : null,
    };
    await onSubmit(payload as any);
  };

  return (
    <FormEngine
      schema={CreateTestimonialSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onFormSubmit}
      isSubmitting={isSubmitting}
      submitText="Save"
      folderPrefix="a2icoders"
    />
  );
}
