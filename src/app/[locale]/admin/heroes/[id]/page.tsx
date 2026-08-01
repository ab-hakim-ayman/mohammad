"use client";

import { useParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useHero } from "@/features/hero";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

export default function ViewHeroPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isPending, error } = useHero(id);

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading hero details" compact />;
  if (error || !data?.data)
    return <StateScreen state={error ? "error" : "notFound"} title="Hero not found" compact />;

  const hero = data.data;

  const config: DetailEngineConfig<typeof hero> = {
    titleKey: "title",
    subtitleKey: "shortDesc",
    statusKey: "status",
    isFeaturedKey: "isActive",
    headerIcon: Sparkles,
    eyebrow: "Hero Details",
    actions: {
      editHref: `/admin/heroes/${hero.id}/edit`,
      backHref: "/admin/heroes",
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "Order", key: "order", type: "text", gridSpan: 6 },
          { label: "Active Status", key: "isActive", type: "boolean", gridSpan: 6 },
        ],
      },
      {
        title: "Call to Action",
        fields: [
          { label: "CTA Text", key: "ctaText", type: "text", gridSpan: 6 },
          { label: "CTA Link", key: "ctaLink", type: "text", gridSpan: 6 },
          { label: "Secondary CTA Text", key: "secondaryCtaText", type: "text", gridSpan: 6 },
          { label: "Secondary CTA Link", key: "secondaryCtaLink", type: "text", gridSpan: 6 },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { label: "Hero Image", key: "heroImage", type: "media", gridSpan: 6 },
          { label: "Hero Video URL", key: "heroVideoUrl", type: "link", gridSpan: 6 },
        ],
      },
    ],
    sidebarSections: [
      {
        title: "Audit Trail",
        fields: [
          { label: "Published At", key: "publishedAt", type: "datetime" },
          { label: "Archived At", key: "archivedAt", type: "datetime" },
          { label: "Created At", key: "createdAt", type: "datetime" },
          { label: "Updated At", key: "updatedAt", type: "datetime" },
          {
            label: "Created By",
            key: "createdBy",
            type: "user",
            render: (rec) =>
              rec.createdBy?.profile?.fullName ||
              rec.createdBy?.name ||
              rec.createdBy?.email ||
              "—",
          },
          {
            label: "Updated By",
            key: "updatedBy",
            type: "user",
            render: (rec) =>
              rec.updatedBy?.profile?.fullName ||
              rec.updatedBy?.name ||
              rec.updatedBy?.email ||
              "—",
          },
        ],
      },
    ],
  };

  return <DetailEngine data={hero} config={config as any} />;
}
