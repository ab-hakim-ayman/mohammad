"use client";

import { use } from "react";
import { Wrench } from "lucide-react";
import { useTool } from "@/features/tool";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

interface ToolDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminToolDetailPage({ params }: ToolDetailPageProps) {
  const { id } = use(params);
  const { data, isLoading, isPending, error } = useTool(id);

  if (isLoading || isPending) {
    return <StateScreen state="loading" title="Loading tool details" compact />;
  }

  const tool = (data as any)?.data || data;

  if (error || !tool) {
    return <StateScreen state="notFound" title="Tool record not found" compact />;
  }

  const config: DetailEngineConfig<typeof tool> = {
    titleKey: "title",
    subtitleKey: "shortDesc",
    statusKey: "status",
    isFeaturedKey: "isFeatured",
    headerIcon: Wrench,
    eyebrow: "Tool Details",
    actions: {
      editHref: `/admin/tools/${tool.id}/edit`,
      backHref: "/admin/tools",
    },
    mainSections: [
      {
        title: "Overview & Configuration",
        fields: [
          { label: "Slug", key: "slug", type: "text", gridSpan: 6 },
          { label: "Category", key: "category", type: "badge", gridSpan: 6 },
          { label: "Execution Engine Type", key: "engineType", type: "badge", gridSpan: 6 },
          { label: "Display Order", key: "order", type: "text", gridSpan: 6 },
          { label: "Action Key (Schema)", key: "actionKey", type: "text", gridSpan: 6 },
          { label: "Component Key (Custom)", key: "componentKey", type: "text", gridSpan: 6 },
          { label: "Icon / Emoji", key: "icon", type: "text", gridSpan: 12 },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { label: "Card Image", key: "cardImage", type: "media", gridSpan: 6 },
          { label: "Hero Image", key: "heroImage", type: "media", gridSpan: 6 },
          { label: "Hero Video URL", key: "heroVideoUrl", type: "link", gridSpan: 6 },
          { label: "Demo Video URL", key: "demoVideoUrl", type: "link", gridSpan: 6 },
          { label: "OG Image", key: "ogImage", type: "media", gridSpan: 12 },
          { label: "Gallery Images", key: "galleryImages", type: "media-gallery", gridSpan: 12 },
        ],
      },
    ],
    sidebarSections: [
      {
        title: "SEO Metadata",
        fields: [
          { label: "SEO Title", key: "seoTitle", type: "text" },
          { label: "SEO Description", key: "seoDescription", type: "text" },
        ],
      },
      {
        title: "Audit Information",
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

  return <DetailEngine data={tool} config={config as any} />;
}
