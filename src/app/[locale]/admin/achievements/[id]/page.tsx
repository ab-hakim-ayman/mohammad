"use client";

import { useAchievement, useDeleteAchievement } from "@/features/achievement";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";
import { useRouter } from "next/navigation";
import { Award } from "lucide-react";
import { useParams } from "next/navigation";

export default function AchievementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isPending, error } = useAchievement(id);
  const deleteAchievement = useDeleteAchievement();

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading achievement details" compact />;
  if (error) return <StateScreen state="error" title="Failed to load achievement" compact />;
  if (!data?.data) return <StateScreen state="notFound" title="Achievement not found" compact />;

  const achievement = data.data;

  const handleDelete = async () => {
    if (!confirm("Delete this achievement permanently?")) return;
    await deleteAchievement.mutateAsync(id);
    router.push("/admin/achievements");
  };

  const config: DetailEngineConfig<typeof achievement> = {
    titleKey: "title",
    subtitleKey: "shortDesc",
    statusKey: "status",
    isFeaturedKey: "isFeatured",
    headerIcon: Award,
    eyebrow: "Achievement Details",
    actions: {
      editHref: `/admin/achievements/${achievement.id}/edit`,
      backHref: "/admin/achievements",
      onDelete: handleDelete,
      isDeleting: deleteAchievement.isPending,
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "Slug", key: "slug", type: "text", gridSpan: 6 },
          { label: "Type", key: "type", type: "text", gridSpan: 6 },
          { label: "Issuer", key: "issuer", type: "text", gridSpan: 6 },
          { label: "Achieved At", key: "achievedAt", type: "date", gridSpan: 6 },
          { label: "Display Order", key: "order", type: "text", gridSpan: 6 },
        ],
      },
      {
        title: "Content",
        fields: [
          {
            label: "Main Content",
            key: "contentJson",
            type: "editor",
            editorVariant: "achievement",
            gridSpan: 12,
          },
        ],
      },
      {
        title: "Credentials",
        fields: [
          { label: "Certificate Link", key: "certificateUrl", type: "link", gridSpan: 12 },
          { label: "Icon Asset", key: "icon", type: "media", gridSpan: 4 },
        ],
      },
    ],
    sidebarSections: [
      {
        title: "Visual Assets",
        fields: [
          { label: "Main Image", key: "image", type: "media", gridSpan: 12 },
          { label: "Card Image", key: "cardImage", type: "media", gridSpan: 12 },
          { label: "Hero Image", key: "heroImage", type: "media", gridSpan: 12 },
          { label: "OG Image", key: "ogImage", type: "media", gridSpan: 12 },
        ],
      },
      {
        title: "Activity & History",
        fields: [
          { label: "Published At", key: "publishedAt", type: "datetime", gridSpan: 12 },
          { label: "Archived At", key: "archivedAt", type: "datetime", gridSpan: 12 },
          { label: "Created At", key: "createdAt", type: "datetime", gridSpan: 12 },
          { label: "Updated At", key: "updatedAt", type: "datetime", gridSpan: 12 },
          {
            label: "Created By",
            key: "createdBy",
            type: "custom",
            gridSpan: 12,
            render: (rec) => rec.createdBy?.name || rec.createdBy?.email || "—",
          },
          {
            label: "Updated By",
            key: "updatedBy",
            type: "custom",
            gridSpan: 12,
            render: (rec) => rec.updatedBy?.name || rec.updatedBy?.email || "—",
          },
        ],
      },
    ],
  };

  return <DetailEngine data={achievement} config={config as any} />;
}
