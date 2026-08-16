"use client";

import { useParams } from "next/navigation";
import { Quote, Star } from "lucide-react";
import { useTestimonial } from "@/features/testimonial";
import { StateScreen } from "@/shared/components/StateScreen";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

export default function ViewTestimonialPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isPending, error } = useTestimonial(id);

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading testimonial details" compact />;
  if (error || !data?.data)
    return (
      <StateScreen state={error ? "error" : "notFound"} title="Testimonial not found" compact />
    );

  const t = data.data;

  const config: DetailEngineConfig<typeof t> = {
    titleKey: "authorName",
    subtitleKey: "authorPosition",
    statusKey: "status",
    isFeaturedKey: "isFeatured",
    headerIcon: Quote,
    eyebrow: "Testimonial Details",
    actions: {
      editHref: `/admin/testimonials/${t.id}/edit`,
      backHref: "/admin/testimonials",
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "Author Position", key: "authorPosition", type: "text", gridSpan: 6 },
          { label: "Order", key: "order", type: "text", gridSpan: 6 },
          { label: "Email", key: "email", type: "text", gridSpan: 6 },
          {
            label: "Rating",
            key: "rating",
            type: "custom",
            gridSpan: 6,
            render: () => {
              const stars = Array.from({ length: 5 }, (_, index) => index < t.rating);
              return (
                <div className="flex items-center gap-1">
                  {stars.map((filled, index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${filled ? "fill-warning text-warning" : "text-muted-foreground/30"}`}
                    />
                  ))}
                  <span className="text-muted-foreground ml-2 text-xs font-semibold">
                    {t.rating}/5
                  </span>
                </div>
              );
            },
          },
        ],
      },
      {
        title: "Message",
        fields: [
          {
            label: "Message Content",
            key: "message",
            type: "custom",
            gridSpan: 12,
            render: () => (
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {t.message}
              </p>
            ),
          },
        ],
      },
      {
        title: "Media Assets",
        fields: [{ label: "Author Image", key: "authorImage", type: "media", gridSpan: 6 }],
      },
    ],
    sidebarSections: [
      {
        title: "Consent & Scheduling",
        fields: [
          { label: "Submitted At", key: "submittedAt", type: "datetime" },
          { label: "Consent At", key: "consentAt", type: "datetime" },
        ],
      },
      {
        title: "Audit Information",
        fields: [
          { label: "Published At", key: "publishedAt", type: "datetime" },
          { label: "Archived At", key: "archivedAt", type: "datetime" },
          { label: "Created At", key: "createdAt", type: "datetime" },
          { label: "Updated At", key: "updatedAt", type: "datetime" },
        ],
      },
    ],
    relatedSections: [
      {
        title: "Case Studies",
        hrefPrefix: "case-studies",
        variant: "badges",
        getRecords: (rec) =>
          rec.caseStudies?.map((cs: any) => ({ id: cs.id, title: cs.title })) || [],
      },
      {
        title: "Services",
        hrefPrefix: "services",
        variant: "badges",
        getRecords: (rec) => rec.services?.map((s: any) => ({ id: s.id, title: s.title })) || [],
      },
    ],
  };

  return <DetailEngine data={t} config={config as any} />;
}
