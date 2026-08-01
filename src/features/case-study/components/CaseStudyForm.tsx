"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateCaseStudySchema } from "../schemas/case-study.schema";
import { CaseStudy, CreateCaseStudyPayload } from "../types/case-study.types";
import { useCategories } from "@/features/category";
import { useTags } from "@/features/tag";
import { useProjects } from "@/features/project";
import { useTestimonials } from "@/features/testimonial";
import { SelectOption } from "@/shared/components/Select";
import { createSelectOptions } from "@/shared/utils";
import { Status } from "@/shared/types/enums";

interface CaseStudyFormProps {
  initialData?: CaseStudy;
  onSubmit: (data: CreateCaseStudyPayload) => Promise<void> | void;
  isSubmitting?: boolean;
  projectOptions?: SelectOption[];
  testimonialOptions?: SelectOption[];
  categoryOptions?: SelectOption[];
  tagOptions?: SelectOption[];
}

export function CaseStudyForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  projectOptions: externalProjectOptions,
  testimonialOptions: externalTestimonialOptions,
  categoryOptions: externalCategoryOptions,
  tagOptions: externalTagOptions,
}: CaseStudyFormProps) {
  const { data: projectsData } = useProjects(externalProjectOptions ? undefined : { limit: 100 });
  const { data: testimonialsData } = useTestimonials(externalTestimonialOptions ? undefined : { limit: 100 });
  const { data: categoriesData } = useCategories(externalCategoryOptions ? undefined : { scope: "CASE_STUDY", limit: 100 });
  const { data: tagsData } = useTags(externalTagOptions ? undefined : { limit: 100 });

  const projectOptions = useMemo(() => {
    if (externalProjectOptions) return externalProjectOptions;
    const items = (projectsData as any)?.data?.data || projectsData || [];
    return Array.isArray(items) ? items.map((p: any) => ({ label: p.title, value: p.id })) : [];
  }, [externalProjectOptions, projectsData]);

  const testimonialOptions = useMemo(() => {
    if (externalTestimonialOptions) return externalTestimonialOptions;
    const items = (testimonialsData as any)?.data?.data || testimonialsData || [];
    return Array.isArray(items) ? items.map((t: any) => ({ label: t.authorName, value: t.id })) : [];
  }, [externalTestimonialOptions, testimonialsData]);

  const categoryOptions = useMemo(() => {
    if (externalCategoryOptions) return externalCategoryOptions;
    const items = (categoriesData as any)?.data?.data || categoriesData || [];
    return Array.isArray(items) ? items.map((c: any) => ({ label: c.title, value: c.id })) : [];
  }, [externalCategoryOptions, categoriesData]);

  const tagOptions = useMemo(() => {
    if (externalTagOptions) return externalTagOptions;
    const items = (tagsData as any)?.data?.data || tagsData || [];
    return Array.isArray(items) ? items.map((t: any) => ({ label: t.title, value: t.id })) : [];
  }, [externalTagOptions, tagsData]);

  const config: FormEngineConfig<CreateCaseStudyPayload> = {
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
            options: createSelectOptions(Status),
          },
          { name: "projectId", label: "Project", type: "select", required: true, options: projectOptions, gridSpan: 6 },
          { name: "testimonialIds" as any, label: "Testimonials", type: "multiselect", options: testimonialOptions, gridSpan: 6 },
          { name: "order", label: "Order", type: "number", gridSpan: 6 },
          { name: "categoryIds" as any, label: "Categories", type: "multiselect", options: categoryOptions, gridSpan: 6 },
          { name: "tagIds" as any, label: "Tags", type: "multiselect", options: tagOptions, gridSpan: 6 },
          { name: "isFeatured", label: "Is Featured", type: "switch", gridSpan: 12 },
          { name: "shortDesc", label: "Short Desc", type: "textarea", gridSpan: 12 },
          { name: "contentJson", label: "Content", type: "editor", editorProps: { variant: "caseStudy" }, gridSpan: 12 },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { name: "cardImage", label: "Card Image", type: "media", mediaFolder: "case-studies", altTextField: "cardImageAlt" as any, gridSpan: 6 },
          { name: "heroImage", label: "Hero Image", type: "media", mediaFolder: "case-studies", altTextField: "heroImageAlt" as any, gridSpan: 6 },
          { name: "heroVideoUrl", label: "Hero Video Url", type: "media", acceptMedia: "video/*", mediaFolder: "case-studies", gridSpan: 6 },
          { name: "demoVideoUrl", label: "Demo Video Url", type: "media", acceptMedia: "video/*", mediaFolder: "case-studies", gridSpan: 6 },
          { name: "ogImage", label: "Og Image", type: "media", mediaFolder: "case-studies", altTextField: "ogImageAlt" as any, gridSpan: 12 },
          { name: "galleryImages", label: "Gallery Images", type: "media-gallery", mediaFolder: "case-studies/gallery", altTextsField: "galleryImagesAltTexts" as any, gridSpan: 12 },
        ],
      },
      {
        title: "SEO",
        fields: [
          { name: "seoTitle", label: "Seo Title", type: "text", gridSpan: 12 },
          { name: "seoDescription", label: "Seo Description", type: "textarea", gridSpan: 12 },
        ],
      },
    ],
  };

  const formattedDefaults = initialData
    ? {
      ...initialData,
      testimonialIds: initialData.testimonials?.map((t: any) => t.id) || [],
      categoryIds: initialData.categories?.map((c: any) => c.id) || [],
      tagIds: initialData.tags?.map((t: any) => t.id) || [],
    }
    : undefined;

  return (
    <FormEngine
      schema={CreateCaseStudySchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save Case Study"
      folderPrefix="a2icoders"
    />
  );
}