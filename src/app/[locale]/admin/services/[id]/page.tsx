"use client";

import { useParams } from "next/navigation";
import { Wrench } from "lucide-react";
import { useService } from "@/features/service";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

export default function ViewServicePage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isPending, error } = useService(id);

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading service details" compact />;
  if (error) return <StateScreen state="error" title="Failed to load service" compact />;
  if (!data?.data) return <StateScreen state="notFound" title="Service record not found" compact />;

  const service = data.data;

  const config: DetailEngineConfig<typeof service> = {
    titleKey: "title",
    subtitleKey: "shortDesc",
    statusKey: "status",
    isFeaturedKey: "isFeatured",
    headerIcon: Wrench,
    eyebrow: "Service Details",
    actions: {
      editHref: `/admin/services/${service.id}/edit`,
      backHref: "/admin/services",
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "Slug", key: "slug", type: "text", gridSpan: 6 },
          { label: "Icon Name", key: "icon", type: "text", gridSpan: 6 },
          { label: "Order", key: "order", type: "text", gridSpan: 6 },
        ],
      },
      {
        title: "Content Body",
        fields: [
          { label: "Content", key: "contentJson", type: "editor", editorVariant: "service", gridSpan: 12 },
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
        title: "Industries",
        hrefPrefix: "industries",
        variant: "badges",
        getRecords: (rec) => rec.industries?.map((i: any) => ({ id: i.id, title: i.title })) || [],
      },
      {
        title: "Technologies",
        hrefPrefix: "technologies",
        variant: "badges",
        getRecords: (rec) => rec.technologies?.map((t: any) => ({ id: t.id, title: t.title })) || [],
      },
      {
        title: "Projects",
        hrefPrefix: "projects",
        variant: "list",
        getRecords: (rec) => rec.projects?.map((p: any) => ({ id: p.id, title: p.title })) || [],
      },
      {
        title: "FAQs",
        hrefPrefix: "faqs",
        variant: "badges",
        getRecords: (rec) => rec.faqs?.map((f: any) => ({ id: f.id, title: f.question })) || [],
      },
      {
        title: "Testimonials",
        hrefPrefix: "testimonials",
        variant: "badges",
        getRecords: (rec) => rec.testimonials?.map((t: any) => ({ id: t.id, title: t.authorName })) || [],
      },
      {
        title: "Specializations",
        hrefPrefix: "specializations",
        variant: "badges",
        getRecords: (rec) => rec.specializations?.map((s: any) => ({ id: s.id, title: s.title })) || [],
      },
    ],
  };

  return <DetailEngine data={service} config={config as any} />;
}
