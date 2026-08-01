"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Factory } from "lucide-react";
import { useIndustry, useDeleteIndustry } from "@/features/industry";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

export default function IndustryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isPending, error } = useIndustry(id);
  const deleteIndustry = useDeleteIndustry();

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading industry details" compact />;
  if (error) return <StateScreen state="error" title="Failed to load industry" compact />;
  if (!data?.data) return <StateScreen state="notFound" title="Industry not found" compact />;

  const industry = data.data;

  const handleDelete = async () => {
    if (!confirm("Delete this industry permanently?")) return;
    await deleteIndustry.mutateAsync(id);
    router.push("/admin/industries");
  };

  const config: DetailEngineConfig<typeof industry> = {
    titleKey: "title",
    subtitleKey: "shortDesc",
    statusKey: "status",
    isFeaturedKey: "isFeatured",
    headerIcon: Factory,
    eyebrow: "Industry Details",
    actions: {
      editHref: `/admin/industries/${industry.id}/edit`,
      backHref: "/admin/industries",
      onDelete: handleDelete,
      isDeleting: deleteIndustry.isPending,
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "Slug", key: "slug", type: "text", gridSpan: 6 },
          { label: "Order", key: "order", type: "text", gridSpan: 6 },
        ],
      },
      {
        title: "Content Body",
        fields: [
          {
            label: "Content",
            key: "contentJson",
            type: "editor",
            editorVariant: "industry",
            gridSpan: 12,
          },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { label: "Icon Graphic", key: "icon", type: "media", gridSpan: 6 },
          { label: "Card Image", key: "cardImage", type: "media", gridSpan: 6 },
          { label: "Hero Image", key: "heroImage", type: "media", gridSpan: 6 },
          { label: "OG Image", key: "ogImage", type: "media", gridSpan: 6 },
          { label: "Hero Video URL", key: "heroVideoUrl", type: "link", gridSpan: 6 },
          { label: "Demo Video URL", key: "demoVideoUrl", type: "link", gridSpan: 6 },
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
            render: (rec) => rec.createdBy?.name || rec.createdBy?.email || "—",
          },
          {
            label: "Updated By",
            key: "updatedBy",
            type: "user",
            render: (rec) => rec.updatedBy?.name || rec.updatedBy?.email || "—",
          },
        ],
      },
    ],
    relatedSections: [
      {
        title: "Projects",
        hrefPrefix: "projects",
        variant: "badges",
        getRecords: (rec) => rec.projects?.map((p: any) => ({ id: p.id, title: p.title })) || [],
      },
      {
        title: "Services",
        hrefPrefix: "services",
        variant: "badges",
        getRecords: (rec) => rec.services?.map((s: any) => ({ id: s.id, title: s.title })) || [],
      },
    ],
  };

  return <DetailEngine data={industry} config={config as any} />;
}
