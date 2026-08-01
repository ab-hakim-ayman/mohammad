"use client";

import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateEducationSchema } from "../schemas/education.schema";
import { Education, CreateEducationPayload } from "../types/education.types";
import { createSelectOptions } from "@/shared/utils";
import { Status } from "@/shared/types/enums";

interface EducationFormProps {
  initialData?: Education;
  onSubmit: (data: CreateEducationPayload) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function EducationForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: EducationFormProps) {
  const config: FormEngineConfig<CreateEducationPayload> = {
    sections: [
      {
        title: "Basic Details",
        fields: [
          { name: "institution", label: "Institution", type: "text", required: true, gridSpan: 6 },
          { name: "degree", label: "Degree", type: "text", required: true, gridSpan: 6 },
          { name: "institutionUrl", label: "Institution URL", type: "text", gridSpan: 6 },
          { name: "fieldOfStudy", label: "Field of Study", type: "text", gridSpan: 6 },
          { name: "grade", label: "Grade / GPA", type: "text", gridSpan: 6 },
          { name: "startDate", label: "Start Date", type: "date", required: true, gridSpan: 6 },
          { name: "endDate", label: "End Date", type: "date", gridSpan: 6 },
          { name: "isCurrent", label: "Currently Studying Here", type: "switch", gridSpan: 6 },
          { name: "order", label: "Display Order", type: "number", gridSpan: 6 },
          {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            gridSpan: 6,
            options: createSelectOptions(Status),
          },
          { name: "isFeatured", label: "Is Featured", type: "switch", gridSpan: 6 },
          { name: "shortDesc", label: "Short Description", type: "textarea", gridSpan: 12 },
          {
            name: "contentJson",
            label: "Detailed Content",
            type: "editor",
            gridSpan: 12,
            editorProps: { variant: "blog" },
          },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { name: "logo", label: "Institution Logo", type: "media", mediaFolder: "educations", altTextField: "logoAlt" as any, gridSpan: 6 },
          { name: "certificateUrl", label: "Certificate URL / Document Link", type: "text", gridSpan: 6 },
        ],
      },
    ],
  };

  return (
    <FormEngine
      schema={CreateEducationSchema}
      config={config}
      defaultValues={initialData as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText={initialData ? "Save Education" : "Create Education"}
      folderPrefix="a2icoders"
    />
  );
}
