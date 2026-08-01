"use client";

import { useParams } from "next/navigation";
import { BookOpen } from "lucide-react";
import { useBlog } from "@/features/blog";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

export default function ViewBlogPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isPending, error } = useBlog(id);

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading blog details" compact />;
  if (error) return <StateScreen state="error" title="Failed to load blog" compact />;
  if (!data?.data) return <StateScreen state="notFound" title="Blog not found" compact />;

  const blog = data.data;

  const config: DetailEngineConfig<typeof blog> = {
    titleKey: "title",
    subtitleKey: "excerpt",
    statusKey: "status",
    isFeaturedKey: "isFeatured",
    headerIcon: BookOpen,
    eyebrow: "Blog Details",
    actions: {
      editHref: `/admin/blogs/${blog.id}/edit`,
      backHref: "/admin/blogs",
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "Slug", key: "slug", type: "text", gridSpan: 6 },
          {
            label: "Read Time",
            key: "readTime",
            type: "text",
            gridSpan: 6,
            render: (b) => (b.readTime ? `${b.readTime} mins` : "—"),
          },
          { label: "Excerpt", key: "excerpt", type: "text", gridSpan: 12 },
        ],
      },
      {
        title: "Content Body",
        fields: [
          {
            label: "Article Body",
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
        title: "Categories",
        hrefPrefix: "categories",
        variant: "badges",
        getRecords: (b) =>
          b.categories?.map((c: any) => ({ id: c.id, title: c.title })) || [],
      },
      {
        title: "Tags",
        hrefPrefix: "tags",
        variant: "badges",
        getRecords: (b) =>
          b.tags?.map((t: any) => ({ id: t.id, title: `#${t.title}` })) || [],
      },
    ],
  };

  return <DetailEngine data={blog} config={config as any} />;
}