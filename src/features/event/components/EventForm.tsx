"use client";

import { useMemo } from "react";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import { CreateEventSchema } from "../schemas/event.schema";
import { Event, CreateEventPayload } from "../types/event.types";
import { useFaqs } from "@/features/faq";
import { EventFormat, Status } from "@/shared/types/enums";
import { createSelectOptions } from "@/shared/utils";

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: CreateEventPayload) => Promise<void> | void;
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

export function EventForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: EventFormProps) {
  const { data: faqsData } = useFaqs({ limit: 100 });

  const faqOptions = useMemo(() => {
    const items = Array.isArray(faqsData)
      ? faqsData
      : (faqsData as any)?.data?.data || (faqsData as any)?.data || [];
    return Array.isArray(items) ? items.map((item: any) => ({ label: item.question, value: item.id })) : [];
  }, [faqsData]);

  const config: FormEngineConfig<CreateEventPayload> = {
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
            options: createSelectOptions(Status)
          },
          {
            name: "format",
            label: "Format",
            type: "select",
            required: true,
            gridSpan: 6,
            options: createSelectOptions(EventFormat)
          },
          { name: "startsAt", label: "Starts At", type: "datetime-local" as any, required: true, gridSpan: 6 },
          { name: "endsAt", label: "Ends At", type: "datetime-local" as any, gridSpan: 6 },
          { name: "location", label: "Location", type: "text", placeholder: "e.g. Dhaka, Bangladesh", gridSpan: 6 },
          { name: "meetingUrl", label: "Meeting Url", type: "text", placeholder: "https://meet.google.com/...", gridSpan: 6 },
          { name: "registrationUrl", label: "Registration Url", type: "text", gridSpan: 6 },
          { name: "registrationDeadline", label: "Registration Deadline", type: "datetime-local" as any, gridSpan: 6 },
          { name: "capacity", label: "Capacity", type: "number", gridSpan: 6 },
          { name: "order", label: "Order", type: "number", gridSpan: 6 },
          { name: "faqIds" as any, label: "Related Faqs", type: "multiselect", options: faqOptions, gridSpan: 12 },
          { name: "isFeatured", label: "Is Featured", type: "switch", gridSpan: 6 },
          { name: "isFree", label: "Is Free", type: "switch", gridSpan: 6 },
          { name: "shortDesc", label: "Short Desc", type: "textarea", gridSpan: 12 },
          {
            name: "contentJson",
            label: "Content Required",
            type: "editor",
            gridSpan: 12,
            editorProps: { variant: "event" },
          },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { name: "cardImage", label: "Card Image", type: "media", mediaFolder: "events", altTextField: "cardImageAlt" as any, gridSpan: 6 },
          { name: "heroImage", label: "Hero Image", type: "media", mediaFolder: "events", altTextField: "heroImageAlt" as any, gridSpan: 6 },
          { name: "heroVideoUrl", label: "Hero Video Url", type: "media", mediaFolder: "events", acceptMedia: "video/*", showAltText: false, gridSpan: 6 },
          { name: "demoVideoUrl", label: "Demo Video Url", type: "media", mediaFolder: "events", acceptMedia: "video/*", showAltText: false, gridSpan: 6 },
          { name: "ogImage", label: "Og Image", type: "media", mediaFolder: "events", altTextField: "ogImageAlt" as any, gridSpan: 12 },
          { name: "galleryImages" as any, label: "Gallery Images", type: "media-gallery", mediaFolder: "events/gallery", altTextsField: "galleryImagesAltTexts" as any, gridSpan: 12 },
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
      startsAt: toDateTimeLocal(initialData.startsAt),
      endsAt: toDateTimeLocal(initialData.endsAt),
      location: initialData.location || "",
      meetingUrl: initialData.meetingUrl || "",
      registrationUrl: initialData.registrationUrl || "",
      registrationDeadline: toDateTimeLocal(initialData.registrationDeadline),
      cardImage: initialData.cardImage || null,
      heroImage: initialData.heroImage || null,
      heroVideoUrl: initialData.heroVideoUrl || null,
      galleryImages: initialData.galleryImages || [],
      demoVideoUrl: initialData.demoVideoUrl || null,
      ogImage: initialData.ogImage || null,
      seoTitle: initialData.seoTitle || "",
      seoDescription: initialData.seoDescription || "",
      faqIds: initialData.faqs?.map((f: any) => f.id) || [],
    };
  }, [initialData]);

  return (
    <FormEngine
      schema={CreateEventSchema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitText="Save Event"
      folderPrefix="a2icoders"
    />
  );
}
