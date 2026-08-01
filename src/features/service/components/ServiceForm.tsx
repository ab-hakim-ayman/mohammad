"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateServiceSchema } from "../schemas/service.schema";
import { Service, CreateServicePayload } from "../types/service.types";
import { useCategories } from "@/features/category";
import { useTechnologies } from "@/features/technology";
import { useServices } from "@/features/service";
import { useFaqs } from "@/features/faq";
import { useTestimonials } from "@/features/testimonial";
import { useIndustries } from "@/features/industry";
import { useSpecializations } from "@/features/specialization";
import { useTags } from "@/features/tag";
import { SelectOption } from "@/shared/components/Select";

interface ServiceFormProps {
  initialData?: Service;
  onSubmit: (data: CreateServicePayload) => Promise<void> | void;
  isSubmitting?: boolean;
  categoryOptions?: SelectOption[];
  tagOptions?: SelectOption[];
  industryOptions?: SelectOption[];
  technologyOptions?: SelectOption[];
  projectOptions?: SelectOption[];
  faqOptions?: SelectOption[];
  testimonialOptions?: SelectOption[];
  specializationOptions?: SelectOption[];
  [key: string]: any;
}

export function ServiceForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  categoryOptions: externalCategoryOptions,
  tagOptions: externalTagOptions,
  industryOptions: externalIndustryOptions,
  technologyOptions: externalTechnologyOptions,
  projectOptions: externalProjectOptions,
  faqOptions: externalFaqOptions,
  testimonialOptions: externalTestimonialOptions,
  specializationOptions: externalSpecializationOptions,
}: ServiceFormProps) {
  const { data: categoriesData } = useCategories(
    externalCategoryOptions ? undefined : { scope: "SERVICE", limit: 100 }
  );
  const { data: tagsData } = useTags(externalTagOptions ? undefined : { limit: 100 });
  const { data: industriesData } = useIndustries(
    externalIndustryOptions ? undefined : { limit: 100 }
  );
  const { data: technologiesData } = useTechnologies(
    externalTechnologyOptions ? undefined : { limit: 100 }
  );
  const { data: projectsData } = useServices(
    externalProjectOptions ? undefined : { limit: 100 }
  );
  const { data: faqsData } = useFaqs(externalFaqOptions ? undefined : { limit: 100 });
  const { data: testimonialsData } = useTestimonials(
    externalTestimonialOptions ? undefined : { limit: 100 }
  );
  const { data: specializationsData } = useSpecializations(
    externalSpecializationOptions ? undefined : { limit: 100 }
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

  const industryOptions = useMemo(() => {
    if (externalIndustryOptions) return externalIndustryOptions;
    const items = Array.isArray(industriesData)
      ? industriesData
      : (industriesData as any)?.data?.data || (industriesData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.title, value: item.id })) : [];
  }, [externalIndustryOptions, industriesData]);

  const technologyOptions = useMemo(() => {
    if (externalTechnologyOptions) return externalTechnologyOptions;
    const items = Array.isArray(technologiesData)
      ? technologiesData
      : (technologiesData as any)?.data?.data || (technologiesData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.title, value: item.id })) : [];
  }, [externalTechnologyOptions, technologiesData]);

  const projectOptions = useMemo(() => {
    if (externalProjectOptions) return externalProjectOptions;
    const items = Array.isArray(projectsData)
      ? projectsData
      : (projectsData as any)?.data?.data || (projectsData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.title, value: item.id })) : [];
  }, [externalProjectOptions, projectsData]);

  const faqOptions = useMemo(() => {
    if (externalFaqOptions) return externalFaqOptions;
    const items = Array.isArray(faqsData)
      ? faqsData
      : (faqsData as any)?.data?.data || (faqsData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.question, value: item.id })) : [];
  }, [externalFaqOptions, faqsData]);

  const testimonialOptions = useMemo(() => {
    if (externalTestimonialOptions) return externalTestimonialOptions;
    const items = Array.isArray(testimonialsData)
      ? testimonialsData
      : (testimonialsData as any)?.data?.data || (testimonialsData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.authorName, value: item.id })) : [];
  }, [externalTestimonialOptions, testimonialsData]);

  const specializationOptions = useMemo(() => {
    if (externalSpecializationOptions) return externalSpecializationOptions;
    const items = Array.isArray(specializationsData)
      ? specializationsData
      : (specializationsData as any)?.data?.data || (specializationsData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.title, value: item.id })) : [];
  }, [externalSpecializationOptions, specializationsData]);

  const config: FormEngineConfig<CreateServicePayload> = {
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
          { name: "industryIds" as any, label: "Related Industries", type: "multiselect", options: industryOptions, gridSpan: 6 },
          { name: "technologyIds" as any, label: "Related Technologies", type: "multiselect", options: technologyOptions, gridSpan: 6 },
          { name: "projectIds" as any, label: "Related Projects", type: "multiselect", options: projectOptions, gridSpan: 6 },
          { name: "faqIds" as any, label: "Related Faqs", type: "multiselect", options: faqOptions, gridSpan: 6 },
          { name: "testimonialIds" as any, label: "Related Testimonials", type: "multiselect", options: testimonialOptions, gridSpan: 12 },
          { name: "categoryIds" as any, label: "Categories", type: "multiselect", options: categoryOptions, gridSpan: 6 },
          { name: "tagIds" as any, label: "Tags", type: "multiselect", options: tagOptions, gridSpan: 6 },
          { name: "specializationIds" as any, label: "Specializations", type: "multiselect", options: specializationOptions, gridSpan: 12 },
          { name: "shortDesc", label: "Short Desc", type: "textarea", gridSpan: 12 },
          { name: "isFeatured", label: "Is Featured", type: "switch", gridSpan: 12 },
          {
            name: "contentJson",
            label: "Content Required",
            type: "editor",
            gridSpan: 12,
            editorProps: { variant: "service" },
          },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { name: "icon", label: "Icon", type: "media", mediaFolder: "services/icons", altTextField: "iconAlt" as any, gridSpan: 6 },
          { name: "cardImage", label: "Card Image", type: "media", mediaFolder: "services", altTextField: "cardImageAlt" as any, gridSpan: 6 },
          { name: "heroImage", label: "Hero Image", type: "media", mediaFolder: "services", altTextField: "heroImageAlt" as any, gridSpan: 6 },
          { name: "heroVideoUrl", label: "Hero Video Url", type: "media", mediaFolder: "services", acceptMedia: "video/*", showAltText: false, gridSpan: 6 },
          { name: "demoVideoUrl", label: "Demo Video Url", type: "media", mediaFolder: "services", acceptMedia: "video/*", showAltText: false, gridSpan: 6 },
          { name: "ogImage", label: "Og Image", type: "media", mediaFolder: "services", altTextField: "ogImageAlt" as any, gridSpan: 6 },
          { name: "galleryImages" as any, label: "Gallery Images", type: "media-gallery", mediaFolder: "services", altTextsField: "galleryImagesAltTexts" as any, gridSpan: 12 },
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
      contentJson: initialData.contentJson || null,
      icon: initialData.icon || null,
      cardImage: initialData.cardImage || null,
      heroImage: initialData.heroImage || null,
      heroVideoUrl: initialData.heroVideoUrl || null,
      galleryImages: initialData.galleryImages || [],
      demoVideoUrl: initialData.demoVideoUrl || null,
      ogImage: initialData.ogImage || null,
      seoTitle: initialData.seoTitle || "",
      seoDescription: initialData.seoDescription || "",
      industryIds: initialData.industries?.map((i: any) => i.id) || [],
      technologyIds: initialData.technologies?.map((t: any) => t.id) || [],
      projectIds: initialData.projects?.map((p: any) => p.id) || [],
      faqIds: initialData.faqs?.map((f: any) => f.id) || [],
      testimonialIds: initialData.testimonials?.map((t: any) => t.id) || [],
      categoryIds: initialData.categories?.map((c: any) => c.id) || [],
      tagIds: initialData.tags?.map((t: any) => t.id) || [],
      specializationIds: initialData.specializations?.map((s: any) => s.id) || [],
    };
  }, [initialData]);

  return (
    <FormEngine
      schema={CreateServiceSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save Service"
      folderPrefix="a2icoders"
    />
  );
}
