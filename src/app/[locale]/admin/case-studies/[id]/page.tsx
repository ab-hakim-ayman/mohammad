"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Briefcase } from "lucide-react";
import { useCaseStudy, useDeleteCaseStudy } from "@/features/case-study";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

export default function CaseStudyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isPending, error } = useCaseStudy(id);
  const deleteCaseStudy = useDeleteCaseStudy();

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading case study details" compact />;
  if (error) return <StateScreen state="error" title="Failed to load case study" compact />;
  if (!data?.data) return <StateScreen state="notFound" title="Case study not found" compact />;

  const cs = data.data;

  const handleDelete = async () => {
    if (!confirm("Delete this case study permanently?")) return;
    await deleteCaseStudy.mutateAsync(id);
    router.push("/admin/case-studies");
  };

  const config: DetailEngineConfig<typeof cs> = {
    titleKey: "title",
    subtitleKey: "shortDesc",
    statusKey: "status",
    isFeaturedKey: "isFeatured",
    headerIcon: Briefcase,
    eyebrow: "Case Study Details",
    actions: {
      editHref: `/admin/case-studies/${cs.id}/edit`,
      backHref: "/admin/case-studies",
      onDelete: handleDelete,
      isDeleting: deleteCaseStudy.isPending,
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "Slug", key: "slug", type: "text", gridSpan: 6 },
          { label: "Order", key: "order", type: "text", gridSpan: 6 },
          {
            label: "Project",
            key: "project",
            type: "text",
            gridSpan: 6,
            render: (rec) => rec.project?.title || rec.projectId || "—",
          },
          {
            label: "Client",
            key: "project.client.title",
            type: "text",
            gridSpan: 6,
            render: (rec) => rec.project?.client?.title || "—",
          },
          {
            label: "Industry",
            key: "project.industry.title",
            type: "text",
            gridSpan: 12,
            render: (rec) => rec.project?.industry?.title || "—",
          },
        ],
      },
      {
        title: "Story Content",
        fields: [
          {
            label: "Content",
            key: "contentJson",
            type: "editor",
            editorVariant: "caseStudy",
            gridSpan: 12,
          },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { label: "Card Image", key: "cardImage", type: "media", gridSpan: 6 },
          { label: "Hero Image", key: "heroImage", type: "media", gridSpan: 6 },
          { label: "OG Image", key: "ogImage", type: "media", gridSpan: 12 },
          { label: "Demo Video URL", key: "demoVideoUrl", type: "link", gridSpan: 12 },
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
        title: "Testimonials",
        hrefPrefix: "testimonials",
        variant: "badges",
        getRecords: (rec) =>
          rec.testimonials?.map((t: any) => ({ id: t.id, title: t.authorName })) || [],
      },
    ],
  };

  return <DetailEngine data={cs} config={config as any} />;
}
