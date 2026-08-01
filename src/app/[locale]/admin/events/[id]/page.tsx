"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { useEvent, useDeleteEvent } from "@/features/event";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isPending, error } = useEvent(id);
  const deleteEvent = useDeleteEvent();

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading event details" compact />;
  if (error) return <StateScreen state="error" title="Failed to load event" compact />;
  if (!data?.data) return <StateScreen state="notFound" title="Event not found" compact />;

  const event = data.data;

  const handleDelete = async () => {
    if (!confirm("Delete this event permanently?")) return;
    await deleteEvent.mutateAsync(id);
    router.push("/admin/events");
  };

  const config: DetailEngineConfig<typeof event> = {
    titleKey: "title",
    subtitleKey: "shortDesc",
    statusKey: "status",
    isFeaturedKey: "isFeatured",
    headerIcon: CalendarDays,
    eyebrow: "Event Details",
    actions: {
      editHref: `/admin/events/${event.id}/edit`,
      backHref: "/admin/events",
      onDelete: handleDelete,
      isDeleting: deleteEvent.isPending,
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "Slug", key: "slug", type: "text", gridSpan: 6 },
          { label: "Format", key: "format", type: "text", gridSpan: 6 },
          { label: "Starts At", key: "startsAt", type: "datetime", gridSpan: 6 },
          { label: "Ends At", key: "endsAt", type: "datetime", gridSpan: 6 },
          { label: "Time Zone", key: "timeZone", type: "text", gridSpan: 6 },
          { label: "Location", key: "location", type: "text", gridSpan: 6 },
          {
            label: "Capacity",
            key: "capacity",
            type: "text",
            gridSpan: 6,
            render: (rec) => (rec.capacity != null ? String(rec.capacity) : "Unlimited"),
          },
          {
            label: "Registration Deadline",
            key: "registrationDeadline",
            type: "datetime",
            gridSpan: 6,
          },
          { label: "Is Free", key: "isFree", type: "boolean", gridSpan: 6 },
          { label: "Order", key: "order", type: "text", gridSpan: 6 },
        ],
      },
      {
        title: "Content Body",
        fields: [
          {
            label: "Content",
            key: "contentJson",
            type: "editor",
            editorVariant: "event",
            gridSpan: 12,
          },
        ],
      },
      {
        title: "Meeting & Registration Links",
        fields: [
          { label: "Meeting URL", key: "meetingUrl", type: "link", gridSpan: 6 },
          { label: "Registration URL", key: "registrationUrl", type: "link", gridSpan: 6 },
        ],
      },
      {
        title: "Media Assets",
        fields: [
          { label: "Card Image", key: "cardImage", type: "media", gridSpan: 6 },
          { label: "Hero Image", key: "heroImage", type: "media", gridSpan: 6 },
          { label: "OG Image", key: "ogImage", type: "media", gridSpan: 12 },
          { label: "Gallery Images", key: "galleryImages", type: "media-gallery", gridSpan: 12 },
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
        title: "FAQs",
        hrefPrefix: "faqs",
        variant: "badges",
        getRecords: (rec) => rec.faqs?.map((f: any) => ({ id: f.id, title: f.question })) || [],
      },
    ],
  };

  return <DetailEngine data={event} config={config as any} />;
}
