"use client";

import { useClient, useDeleteClient } from "@/features/client";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";
import { useRouter } from "next/navigation";
import { Globe, ImageIcon } from "lucide-react";
import { useParams } from "next/navigation";

export default function ViewClientPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isPending, error } = useClient(id);
  const deleteClient = useDeleteClient();

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading client details" compact />;
  if (error || !data?.data)
    return <StateScreen state={error ? "error" : "notFound"} title="Client not found" compact />;

  const client = data.data;

  const handleDelete = async () => {
    if (confirm("Delete this client permanently?")) {
      await deleteClient.mutateAsync(id);
      router.push("/admin/clients");
    }
  };

  const config: DetailEngineConfig<typeof client> = {
    titleKey: "title",
    subtitleKey: "shortDesc",
    statusKey: "status",
    isFeaturedKey: "isFeatured",
    headerIcon: ImageIcon,
    eyebrow: "Client Details",
    actions: {
      editHref: `/admin/clients/${client.id}/edit`,
      backHref: "/admin/clients",
      onDelete: handleDelete,
      isDeleting: deleteClient.isPending,
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "Slug", key: "slug", type: "text", gridSpan: 6 },
          { label: "Website", key: "website", type: "link", gridSpan: 6 },
          { label: "Display Order", key: "order", type: "text", gridSpan: 6 },
          { label: "Short Description", key: "shortDesc", type: "text", gridSpan: 12 },
        ],
      },
      {
        title: "Rich Content Info",
        fields: [
          {
            label: "Content Available",
            key: "contentJson",
            type: "custom",
            gridSpan: 12,
            render: (rec) =>
              rec.contentJson ? (
                <span className="text-foreground text-sm font-medium">
                  Rich content is configured for this client profile.
                </span>
              ) : (
                <span className="text-muted-foreground/40 text-sm italic">
                  No rich content configured.
                </span>
              ),
          },
        ],
      },
    ],
    sidebarSections: [
      {
        title: "Visual Assets",
        fields: [
          { label: "Logo", key: "logo", type: "media", gridSpan: 12 },
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
            render: (rec: any) =>
              rec.createdBy?.profile?.fullName ||
              rec.createdBy?.name ||
              rec.createdBy?.email ||
              "—",
          },
          {
            label: "Updated By",
            key: "updatedBy",
            type: "custom",
            gridSpan: 12,
            render: (rec: any) =>
              rec.updatedBy?.profile?.fullName ||
              rec.updatedBy?.name ||
              rec.updatedBy?.email ||
              "—",
          },
        ],
      },
    ],
    relatedSections: [
      {
        title: "Projects",
        hrefPrefix: "projects",
        variant: "badges",
        getRecords: (rec: any) =>
          rec.projects?.map((p: any) => ({ id: p.id, title: p.title })) || [],
      },
      {
        title: "Testimonials",
        hrefPrefix: "testimonials",
        variant: "badges",
        getRecords: (rec: any) =>
          rec.testimonials?.map((t: any) => ({ id: t.id, title: t.authorName })) || [],
      },
    ],
  };

  return <DetailEngine data={client} config={config as any} />;
}
