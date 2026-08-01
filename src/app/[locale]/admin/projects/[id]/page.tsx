"use client";

import { useParams } from "next/navigation";
import { FolderKanban } from "lucide-react";
import { useProject } from "@/features/project";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

export default function ViewProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isPending, error } = useProject(id);

  if (isLoading || isPending)
    return <StateScreen compact state="loading" title="Loading project details" />;
  if (error) return <StateScreen compact state="error" title="Failed to load project" />;
  if (!data?.data) return <StateScreen compact state="notFound" title="Project not found" />;

  const project = data.data;

  const config: DetailEngineConfig<typeof project> = {
    titleKey: "title",
    subtitleKey: "shortDesc",
    statusKey: "status",
    isFeaturedKey: "isFeatured",
    headerIcon: FolderKanban,
    eyebrow: "Project Details",
    actions: {
      editHref: `/admin/projects/${project.id}/edit`,
      backHref: "/admin/projects",
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "Slug", key: "slug", type: "text", gridSpan: 6 },
          { label: "Order", key: "order", type: "text", gridSpan: 6 },
          { label: "Start Date", key: "startDate", type: "date", gridSpan: 6 },
          { label: "End Date", key: "endDate", type: "date", gridSpan: 6 },
          { label: "GitHub URL", key: "githubUrl", type: "link", gridSpan: 6 },
          { label: "Live URL", key: "liveUrl", type: "link", gridSpan: 6 },
        ],
      },
      {
        title: "Content Body",
        fields: [
          { label: "Content", key: "contentJson", type: "editor", editorVariant: "project", gridSpan: 12 },
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
    relatedSections: [
      {
        title: "Client",
        hrefPrefix: "clients",
        variant: "list",
        getRecords: (rec) => (rec.client ? [{ id: rec.client.id, title: rec.client.title }] : []),
      },
      {
        title: "Industry",
        hrefPrefix: "industries",
        variant: "list",
        getRecords: (rec) => (rec.industry ? [{ id: rec.industry.id, title: rec.industry.title }] : []),
      },
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
        title: "Technologies",
        hrefPrefix: "technologies",
        variant: "badges",
        getRecords: (rec) => rec.technologies?.map((t: any) => ({ id: t.id, title: t.title })) || [],
      },
      {
        title: "Services",
        hrefPrefix: "services",
        variant: "badges",
        getRecords: (rec) => rec.services?.map((s: any) => ({ id: s.id, title: s.title })) || [],
      },
      {
        title: "Case Study",
        hrefPrefix: "case-studies",
        variant: "list",
        getRecords: (rec) => (rec.caseStudy ? [{ id: rec.caseStudy.id, title: rec.caseStudy.title }] : []),
      },
    ],
  };

  return <DetailEngine data={project} config={config as any} />;
}
