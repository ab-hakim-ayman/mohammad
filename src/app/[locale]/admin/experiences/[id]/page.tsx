"use client";

import { useParams } from "next/navigation";
import { Briefcase } from "lucide-react";
import { useExperience } from "@/features/experience";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

export default function ViewExperiencePage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isPending, error } = useExperience(id);

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading experience details" compact />;
  if (error) return <StateScreen state="error" title="Failed to load experience" compact />;
  if (!data?.data) return <StateScreen state="notFound" title="Experience not found" compact />;

  const experience = data.data;

  const config: DetailEngineConfig<typeof experience> = {
    titleKey: "companyName",
    subtitleKey: "position",
    statusKey: "status",
    isFeaturedKey: "isFeatured",
    headerIcon: Briefcase,
    eyebrow: "Experience Details",
    actions: {
      editHref: `/admin/experiences/${experience.id}/edit`,
      backHref: "/admin/experiences",
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "Company URL", key: "companyUrl", type: "link", gridSpan: 6 },
          { label: "Employment Type", key: "employmentType", type: "text", gridSpan: 6 },
          { label: "Location", key: "location", type: "text", gridSpan: 6 },
          { label: "Location Type", key: "locationType", type: "text", gridSpan: 6 },
          { label: "Start Date", key: "startDate", type: "datetime", gridSpan: 6 },
          {
            label: "End Date",
            key: "endDate",
            type: "datetime",
            gridSpan: 6,
            render: (exp) => (exp.isCurrent ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "—"),
          },
          { label: "Short Description", key: "shortDesc", type: "text", gridSpan: 12 },
        ],
      },
      {
        title: "Content Body",
        fields: [
          {
            label: "Detailed Experience Content",
            key: "contentJson",
            type: "editor",
            editorVariant: "blog",
            gridSpan: 12,
          },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { label: "Logo", key: "logo", type: "media", gridSpan: 6 },
          { label: "Card Image", key: "cardImage", type: "media", gridSpan: 6 },
          { label: "OG Image", key: "ogImage", type: "media", gridSpan: 12 },
        ],
      },
    ],
    sidebarSections: [
      {
        title: "Audit Information",
        fields: [
          { label: "Published At", key: "publishedAt", type: "datetime" },
          { label: "Created At", key: "createdAt", type: "datetime" },
          { label: "Updated At", key: "updatedAt", type: "datetime" },
          {
            label: "Created By",
            key: "createdBy",
            type: "user",
            render: (b) =>
              b.createdBy?.profile?.fullName ||
              b.createdBy?.name ||
              b.createdBy?.email ||
              "—",
          },
          {
            label: "Updated By",
            key: "updatedBy",
            type: "user",
            render: (b) =>
              b.updatedBy?.profile?.fullName ||
              b.updatedBy?.name ||
              b.updatedBy?.email ||
              "—",
          },
        ],
      },
    ],
    relatedSections: [
      {
        title: "Associated Projects",
        hrefPrefix: "projects",
        variant: "badges",
        getRecords: (exp) =>
          exp.projects?.map((p: any) => ({ id: p.id, title: p.title })) || [],
      },
      {
        title: "Technologies",
        hrefPrefix: "technologies",
        variant: "badges",
        getRecords: (exp) =>
          exp.technologies?.map((t: any) => ({ id: t.id, title: t.title })) || [],
      },
    ],
  };

  return <DetailEngine data={experience} config={config as any} />;
}
