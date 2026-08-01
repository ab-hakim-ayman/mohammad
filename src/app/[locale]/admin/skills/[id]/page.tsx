"use client";

import { useParams } from "next/navigation";
import { Gauge } from "lucide-react";
import Image from "next/image";
import { useSkill } from "@/features/skill";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

function isImageLike(value: string | null | undefined) {
  if (!value) return false;
  return /^(https?:\/\/|\/)/i.test(value);
}

function shouldRenderRawIcon(value: string | null | undefined) {
  if (!value) return false;
  const trimmed = value.trim();
  return trimmed.length <= 3 && !/\s/.test(trimmed);
}

export default function ViewSkillPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isPending, error } = useSkill(id);

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading skill details" compact />;
  if (error || !data?.data)
    return <StateScreen state={error ? "error" : "notFound"} title="Skill not found" compact />;

  const skill = data.data;

  const config: DetailEngineConfig<typeof skill> = {
    titleKey: "title",
    subtitleKey: "shortDesc",
    statusKey: "status",
    headerIcon: Gauge,
    eyebrow: "Skill Details",
    actions: {
      editHref: `/admin/skills/${skill.id}/edit`,
      backHref: "/admin/skills",
    },
    mainSections: [
      {
        title: "Overview",
        fields: [{ label: "Order", key: "order", type: "text", gridSpan: 6 }],
      },
      {
        title: "Icon Presentation",
        fields: [
          {
            label: "Skill Icon",
            key: "icon",
            type: "custom",
            gridSpan: 12,
            render: () => {
              if (!skill.icon)
                return <span className="text-muted-foreground/40 italic">No icon available</span>;
              if (isImageLike(skill.icon)) {
                return (
                  <div className="border-border bg-background relative h-24 w-24 overflow-hidden rounded-xl border shadow-xs">
                    <Image
                      src={skill.icon}
                      alt={skill.title}
                      fill
                      sizes="96px"
                      unoptimized
                      className="object-contain p-2"
                    />
                  </div>
                );
              }
              if (shouldRenderRawIcon(skill.icon)) {
                return <span className="text-6xl leading-none">{skill.icon}</span>;
              }
              return <span className="text-muted-foreground font-mono text-sm">{skill.icon}</span>;
            },
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
        title: "Profiles",
        hrefPrefix: "profiles",
        variant: "badges",
        getRecords: (rec) =>
          rec.profiles?.map((p: any) => ({ id: p.id, title: p.fullName || p.name })) || [],
      },
    ],
  };

  return <DetailEngine data={skill} config={config as any} />;
}
