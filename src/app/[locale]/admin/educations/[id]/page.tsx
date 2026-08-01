"use client";

import { useParams } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { useEducation } from "@/features/education";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

export default function ViewEducationPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isPending, error } = useEducation(id);

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading education details" compact />;
  if (error) return <StateScreen state="error" title="Failed to load education details" compact />;
  if (!data?.data) return <StateScreen state="notFound" title="Education record not found" compact />;

  const education = data.data;

  const config: DetailEngineConfig<typeof education> = {
    titleKey: "institution",
    subtitleKey: "degree",
    statusKey: "status",
    isFeaturedKey: "isFeatured",
    headerIcon: GraduationCap,
    eyebrow: "Education Details",
    actions: {
      editHref: `/admin/educations/${education.id}/edit`,
      backHref: "/admin/educations",
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "Institution URL", key: "institutionUrl", type: "link", gridSpan: 6 },
          { label: "Field of Study", key: "fieldOfStudy", type: "text", gridSpan: 6 },
          { label: "Grade / GPA", key: "grade", type: "text", gridSpan: 6 },
          { label: "Start Date", key: "startDate", type: "datetime", gridSpan: 6 },
          {
            label: "End Date",
            key: "endDate",
            type: "datetime",
            gridSpan: 6,
            render: (edu) => (edu.isCurrent ? "Present" : edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "—"),
          },
          { label: "Short Description", key: "shortDesc", type: "text", gridSpan: 12 },
        ],
      },
      {
        title: "Content Body",
        fields: [
          {
            label: "Detailed Education Content",
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
          { label: "Certificate URL", key: "certificateUrl", type: "link", gridSpan: 6 },
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
  };

  return <DetailEngine data={education} config={config as any} />;
}
