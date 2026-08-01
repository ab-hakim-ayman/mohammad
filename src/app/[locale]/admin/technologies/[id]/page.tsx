"use client";

import { useParams } from "next/navigation";
import { Cpu } from "lucide-react";
import { useTechnology } from "@/features/technology";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

export default function ViewTechnologyPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isPending, error } = useTechnology(id);

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading technology details" compact />;
  if (error || !data?.data)
    return (
      <StateScreen state={error ? "error" : "notFound"} title="Technology not found" compact />
    );

  const tech = data.data;

  const config: DetailEngineConfig<typeof tech> = {
    titleKey: "title",
    subtitleKey: "shortDesc",
    statusKey: "status",
    headerIcon: Cpu,
    eyebrow: "Technology Details",
    actions: {
      editHref: `/admin/technologies/${tech.id}/edit`,
      backHref: "/admin/technologies",
    },
    mainSections: [
      {
        title: "Overview",
        fields: [{ label: "Order", key: "order", type: "text", gridSpan: 6 }],
      },
      {
        title: "Media Assets",
        fields: [{ label: "Logo", key: "logo", type: "media", gridSpan: 6 }],
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
              (rec as any).createdBy?.profile?.fullName ||
              (rec as any).createdBy?.name ||
              (rec as any).createdBy?.email ||
              "—",
          },
          {
            label: "Updated By",
            key: "updatedBy",
            type: "user",
            render: (rec) =>
              (rec as any).updatedBy?.profile?.fullName ||
              (rec as any).updatedBy?.name ||
              (rec as any).updatedBy?.email ||
              "—",
          },
        ],
      },
    ],
    relatedSections: [
      {
        title: "Categories",
        hrefPrefix: "categories",
        variant: "badges",
        getRecords: (rec) => rec.categories?.map((c: any) => ({ id: c.id, title: c.title })) || [],
      },
      {
        title: "Tags",
        hrefPrefix: "tags",
        variant: "badges",
        getRecords: (rec) => rec.tags?.map((t: any) => ({ id: t.id, title: t.title })) || [],
      },
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

  return <DetailEngine data={tech} config={config as any} />;
}
