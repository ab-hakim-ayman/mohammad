"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateProjectSchema } from "../schemas/project.schema";
import { Project, CreateProjectPayload } from "../types/project.types";
import { useCategories } from "@/features/category";
import { useTags } from "@/features/tag";
import { useTechnologies } from "@/features/technology";
import { useServices } from "@/features/service";
import { SelectOption } from "@/shared/components/Select";

interface ProjectFormProps {
  initialData?: Project;
  onSubmit: (data: CreateProjectPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  categoryOptions?: SelectOption[];
  tagOptions?: SelectOption[];
  technologyOptions?: SelectOption[];
  serviceOptions?: SelectOption[];
  [key: string]: any;
}

export function ProjectForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  categoryOptions: externalCategoryOptions,
  tagOptions: externalTagOptions,
  technologyOptions: externalTechnologyOptions,
  serviceOptions: externalServiceOptions,
}: ProjectFormProps) {
  const { data: categoriesData } = useCategories(
    externalCategoryOptions ? undefined : { scope: "PROJECT", limit: 100 }
  );
  const { data: tagsData } = useTags(externalTagOptions ? undefined : { limit: 100 });
  const { data: technologiesData } = useTechnologies(
    externalTechnologyOptions ? undefined : { limit: 100 }
  );
  const { data: servicesData } = useServices(
    externalServiceOptions ? undefined : { limit: 100 }
  );

  const categoryOptions = useMemo(() => {
    if (externalCategoryOptions) return externalCategoryOptions;
    const items = Array.isArray(categoriesData)
      ? categoriesData
      : (categoriesData as any)?.data?.data || (categoriesData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.title, value: item.id })) : [];
  }, [externalCategoryOptions, categoriesData]);

  const tagOptions = useMemo(() => {
    if (externalTagOptions) return externalTagOptions;
    const items = Array.isArray(tagsData)
      ? tagsData
      : (tagsData as any)?.data?.data || (tagsData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.title, value: item.id })) : [];
  }, [externalTagOptions, tagsData]);

  const technologyOptions = useMemo(() => {
    if (externalTechnologyOptions) return externalTechnologyOptions;
    const items = Array.isArray(technologiesData)
      ? technologiesData
      : (technologiesData as any)?.data?.data || (technologiesData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.title, value: item.id })) : [];
  }, [externalTechnologyOptions, technologiesData]);

  const serviceOptions = useMemo(() => {
    if (externalServiceOptions) return externalServiceOptions;
    const items = Array.isArray(servicesData)
      ? servicesData
      : (servicesData as any)?.data?.data || (servicesData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.title, value: item.id })) : [];
  }, [externalServiceOptions, servicesData]);

  const config: FormEngineConfig<CreateProjectPayload> = {
    sections: [
      {
        title: "Basic Details",
        fields: [
          { name: "title", label: "Title", type: "text", required: true, gridSpan: 6 },
          { name: "slug", label: "Slug", type: "slug", sourceField: "title", required: true, gridSpan: 6 },
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
          { name: "order", label: "Order", type: "number", gridSpan: 6 },
          { name: "shortDesc", label: "Short Desc", type: "textarea", gridSpan: 12 },
          { name: "isFeatured", label: "Is Featured", type: "switch", gridSpan: 12 },
          { name: "categoryIds" as any, label: "Categories", type: "multiselect", options: categoryOptions, gridSpan: 6 },
          { name: "tagIds" as any, label: "Tags", type: "multiselect", options: tagOptions, gridSpan: 6 },
          { name: "technologyIds" as any, label: "Technologies", type: "multiselect", options: technologyOptions, gridSpan: 6 },
          { name: "serviceIds" as any, label: "Services", type: "multiselect", options: serviceOptions, gridSpan: 6 },
        ],
      },
      {
        title: "Links & Dates",
        fields: [
          { name: "githubUrl", label: "GitHub URL", type: "text", gridSpan: 6 },
          { name: "liveUrl", label: "Live URL", type: "text", gridSpan: 6 },
          { name: "startDate", label: "Start Date", type: "date", gridSpan: 6 },
          { name: "endDate", label: "End Date", type: "date", gridSpan: 6 },
          {
            name: "contentJson",
            label: "Content Required",
            type: "editor",
            gridSpan: 12,
            editorProps: { variant: "project" },
          },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { name: "cardImage", label: "Card Image", type: "media", mediaFolder: "projects", altTextField: "cardImageAlt" as any, gridSpan: 6 },
          { name: "heroImage", label: "Hero Image", type: "media", mediaFolder: "projects", altTextField: "heroImageAlt" as any, gridSpan: 6 },
          { name: "heroVideoUrl", label: "Hero Video Url", type: "media", mediaFolder: "projects", acceptMedia: "video/*", showAltText: false, gridSpan: 6 },
          { name: "demoVideoUrl", label: "Demo Video Url", type: "media", mediaFolder: "projects", acceptMedia: "video/*", showAltText: false, gridSpan: 6 },
          { name: "ogImage", label: "Og Image", type: "media", mediaFolder: "projects", altTextField: "ogImageAlt" as any, gridSpan: 12 },
          { name: "galleryImages" as any, label: "Gallery Images", type: "media-gallery", mediaFolder: "projects/gallery", altTextsField: "galleryImagesAltTexts" as any, gridSpan: 12 },
        ],
      },
      {
        title: "Seo Details",
        fields: [
          { name: "seoTitle", label: "Seo Title", type: "text", gridSpan: 12 },
          { name: "seoDescription", label: "Seo Description", type: "textarea", gridSpan: 12 },
        ],
      },
    ],
  };

  const formattedDefaults = useMemo(() => {
    if (!initialData) return undefined;
    return {
      ...initialData,
      shortDesc: initialData.shortDesc || "",
      startDate: initialData.startDate
        ? new Date(initialData.startDate).toISOString().split("T")[0]
        : "",
      endDate: initialData.endDate
        ? new Date(initialData.endDate).toISOString().split("T")[0]
        : "",
      contentJson: initialData.contentJson || null,
      cardImage: initialData.cardImage || null,
      heroImage: initialData.heroImage || null,
      heroVideoUrl: initialData.heroVideoUrl || null,
      demoVideoUrl: initialData.demoVideoUrl || null,
      ogImage: initialData.ogImage || null,
      seoTitle: initialData.seoTitle || "",
      seoDescription: initialData.seoDescription || "",
      galleryImages: initialData.galleryImages || [],
      technologyIds: initialData.technologies?.map((t) => t.id) || [],
      serviceIds: initialData.services?.map((s) => s.id) || [],
      categoryIds: initialData.categories?.map((c) => c.id) || [],
      tagIds: initialData.tags?.map((t) => t.id) || [],
    };
  }, [initialData]);

  const onFormSubmit = async (data: CreateProjectPayload) => {
    await onSubmit(data);
  };

  return (
    <FormEngine
      schema={CreateProjectSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onFormSubmit}
      isSubmitting={isSubmitting}
      submitText="Save Project"
      folderPrefix="a2icoders"
    />
  );
}
