"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateExperienceSchema } from "../schemas/experience.schema";
import { Experience, CreateExperiencePayload } from "../types/experience.types";
import { useProjects } from "@/features/project";
import { useTechnologies } from "@/features/technology";
import { createSelectOptions } from "@/shared/utils";
import { Status, EmploymentType } from "@/shared/types/enums";

interface ExperienceFormProps {
  initialData?: Experience & {
    projects?: { id: string; title: string }[];
    technologies?: { id: string; title: string }[];
  };
  onSubmit: (data: CreateExperiencePayload) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function ExperienceForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: ExperienceFormProps) {
  const { data: projectsData } = useProjects({ limit: 100 });
  const { data: technologiesData } = useTechnologies({ limit: 100 });

  const projectOptions = useMemo(() => {
    const items = (projectsData as any)?.data?.data || projectsData || [];
    return Array.isArray(items) ? items.map((p: any) => ({ label: p.title, value: p.id })) : [];
  }, [projectsData]);

  const technologyOptions = useMemo(() => {
    const items = (technologiesData as any)?.data?.data || technologiesData || [];
    return Array.isArray(items) ? items.map((t: any) => ({ label: t.title, value: t.id })) : [];
  }, [technologiesData]);

  const config: FormEngineConfig<CreateExperiencePayload> = {
    sections: [
      {
        title: "Basic Details",
        fields: [
          { name: "companyName", label: "Company Name", type: "text", required: true, gridSpan: 6 },
          { name: "position", label: "Position", type: "text", required: true, gridSpan: 6 },
          { name: "companyUrl", label: "Company URL", type: "text", gridSpan: 6 },
          {
            name: "employmentType",
            label: "Employment Type",
            type: "select",
            required: true,
            gridSpan: 6,
            options: createSelectOptions(EmploymentType),
          },
          { name: "location", label: "Location", type: "text", gridSpan: 6 },
          { name: "locationType", label: "Location Type", type: "text", gridSpan: 6 },
          { name: "startDate", label: "Start Date", type: "date", required: true, gridSpan: 6 },
          { name: "endDate", label: "End Date", type: "date", gridSpan: 6 },
          { name: "isCurrent", label: "Current Job", type: "switch", gridSpan: 6 },
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
          { name: "projects" as any, label: "Associated Projects", type: "multiselect", options: projectOptions, gridSpan: 6 },
          { name: "technologies" as any, label: "Technologies Used", type: "multiselect", options: technologyOptions, gridSpan: 6 },
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
          { name: "logo", label: "Company Logo", type: "media", mediaFolder: "experiences", altTextField: "logoAlt" as any, gridSpan: 6 },
          { name: "cardImage", label: "Card Image", type: "media", mediaFolder: "experiences", altTextField: "cardImageAlt" as any, gridSpan: 6 },
          { name: "ogImage", label: "OG Image", type: "media", mediaFolder: "experiences", altTextField: "ogImageAlt" as any, gridSpan: 12 },
        ],
      },
    ],
  };

  const formattedDefaults = initialData
    ? {
      ...initialData,
      projects: initialData.projects?.map((p) => p.id) || [],
      technologies: initialData.technologies?.map((t) => t.id) || [],
    }
    : undefined;

  return (
    <FormEngine
      schema={CreateExperienceSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText={initialData ? "Save Experience" : "Create Experience"}
      folderPrefix="a2icoders"
    />
  );
}
