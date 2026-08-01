"use client";

import { usePartner, useDeletePartner } from "@/features/partner";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { useParams } from "next/navigation";

export default function ViewPartnerPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isPending, error } = usePartner(id);
  const deletePartner = useDeletePartner();

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading partner details" compact />;
  if (error || !data?.data)
    return <StateScreen state={error ? "error" : "notFound"} title="Partner not found" compact />;

  const partner = data.data;

  const handleDelete = async () => {
    if (confirm("Delete this partner permanently?")) {
      await deletePartner.mutateAsync(id);
      router.push("/admin/partners");
    }
  };

  const config: DetailEngineConfig<typeof partner> = {
    titleKey: "title",
    subtitleKey: "shortDesc",
    statusKey: "status",
    isFeaturedKey: "isFeatured",
    headerIcon: Globe,
    eyebrow: "Partner Details",
    actions: {
      editHref: `/admin/partners/${partner.id}/edit`,
      backHref: "/admin/partners",
      onDelete: handleDelete,
      isDeleting: deletePartner.isPending,
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "Partner Name", key: "title", type: "text", gridSpan: 6 },
          { label: "Type", key: "type", type: "text", gridSpan: 6 },
          { label: "Website", key: "website", type: "link", gridSpan: 6 },
          { label: "Display Order", key: "order", type: "text", gridSpan: 6 },
          { label: "Short Description", key: "shortDesc", type: "text", gridSpan: 12 },
        ],
      },
    ],
    sidebarSections: [
      {
        title: "Visual Assets",
        fields: [{ label: "Partner Logo", key: "logo", type: "media", gridSpan: 12 }],
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

  return <DetailEngine data={partner} config={config as any} />;
}
