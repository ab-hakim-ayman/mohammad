"use client";

import { useParams } from "next/navigation";
import { Hash } from "lucide-react";
import { useTag } from "@/features/tag";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

export default function ViewTagPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isPending, error } = useTag(id);

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading tag details" compact />;
  if (error || !data?.data)
    return <StateScreen state={error ? "error" : "notFound"} title="Tag not found" compact />;

  const tag = data.data;

  const config: DetailEngineConfig<typeof tag> = {
    titleKey: "title",
    subtitleKey: "shortDesc",
    statusKey: "status",
    headerIcon: Hash,
    eyebrow: "Tag Details",
    actions: {
      editHref: `/admin/tags/${tag.id}/edit`,
      backHref: "/admin/tags",
    },
    mainSections: [
      {
        title: "Overview",
        fields: [{ label: "Slug", key: "slug", type: "text", gridSpan: 12 }],
      },
      {
        title: "Description",
        fields: [
          {
            label: "Tag Description",
            key: "shortDesc",
            type: "custom",
            gridSpan: 12,
            render: () => (
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {tag.shortDesc || (
                  <span className="text-muted-foreground/40 italic">No description available</span>
                )}
              </p>
            ),
          },
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
    relatedSections: [
      {
        title: "Blogs",
        hrefPrefix: "blogs",
        variant: "badges",
        getRecords: (rec) => rec.blogs?.map((b: any) => ({ id: b.id, title: b.title })) || [],
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
      {
        title: "Case Studies",
        hrefPrefix: "case-studies",
        variant: "badges",
        getRecords: (rec) =>
          rec.caseStudies?.map((cs: any) => ({ id: cs.id, title: cs.title })) || [],
      },
      {
        title: "Technologies",
        hrefPrefix: "technologies",
        variant: "badges",
        getRecords: (rec) =>
          rec.technologies?.map((t: any) => ({ id: t.id, title: t.title })) || [],
      },
      {
        title: "Skills",
        hrefPrefix: "skills",
        variant: "badges",
        getRecords: (rec) => rec.skills?.map((sk: any) => ({ id: sk.id, title: sk.title })) || [],
      },
    ],
  };

  return <DetailEngine data={tag} config={config as any} />;
}
