"use client";

import { useParams } from "next/navigation";
import { ImageIcon, FileVideo, FileAudio, File } from "lucide-react";
import { useDeleteMedia, useMediaItem } from "@/features/media";
import { StateScreen } from "@/shared/components";
import { CopyButton } from "@/shared/components/CopyButton";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";
import I18n from "@/shared/components/I18n";

function formatFileSize(bytes: number | null | undefined) {
  if (bytes == null) return "\u2014";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function getHeaderIcon(resourceType: string) {
  switch (resourceType) {
    case "IMAGE":
      return ImageIcon;
    case "VIDEO":
      return FileVideo;
    case "AUDIO":
      return FileAudio;
    default:
      return File;
  }
}

export default function ViewMediaPage() {
  const { id } = useParams<{ id: string }>();
  const { data: media, isLoading, isPending, error } = useMediaItem(id);
  const deleteMedia = useDeleteMedia();

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading media details" compact />;
  if (error) return <StateScreen state="error" title="Failed to load media" compact />;
  if (!media) return <StateScreen state="notFound" title="Media not found" compact />;

  const item = {
    ...media,
    status: media.isArchived ? "ARCHIVED" : "ACTIVE",
  };

  const config: DetailEngineConfig<typeof item> = {
    titleKey: "originalFilename",
    subtitleKey: "mimeType",
    statusKey: "status",
    headerIcon: getHeaderIcon(media.resourceType),
    eyebrow: "Media Details",
    actions: {
      customActions: (
        <CopyButton
          text={media.url}
          label="Copy Media URL"
          copiedLabel="URL Copied!"
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 cursor-pointer rounded-xl px-4 text-xs font-bold shadow-2xs"
        />
      ),
      editHref: `/admin/media/${media.id}/edit`,
      backHref: "/admin/media",
      onDelete: async () => {
        if (confirm("Are you sure you want to archive this media?")) {
          await deleteMedia.mutateAsync(media.id);
        }
      },
      isDeleting: deleteMedia.isPending,
    },
    mainSections: [
      {
        title: "Overview",
        fields: [
          { label: "ID", key: "id", type: "text", gridSpan: 12 },
          { label: "URL", key: "url", type: "link", gridSpan: 12 },
          { label: "Provider", key: "provider", type: "text", gridSpan: 6 },
          { label: "Resource Type", key: "resourceType", type: "text", gridSpan: 6 },
          { label: "Provider Asset ID", key: "providerAssetId", type: "text", gridSpan: 12 },
        ],
      },
      {
        title: "File Details",
        fields: [
          { label: "Original Filename", key: "originalFilename", type: "text", gridSpan: 6 },
          { label: "MIME Type", key: "mimeType", type: "text", gridSpan: 6 },
          {
            label: "File Size",
            key: "fileSize",
            type: "text",
            gridSpan: 6,
            render: (rec) => formatFileSize(rec.fileSize),
          },
          { label: "Folder", key: "folder", type: "text", gridSpan: 6 },
          {
            label: "Width",
            key: "width",
            type: "text",
            gridSpan: 4,
            render: (rec) => (rec.width != null ? `${rec.width}px` : "\u2014"),
          },
          {
            label: "Height",
            key: "height",
            type: "text",
            gridSpan: 4,
            render: (rec) => (rec.height != null ? `${rec.height}px` : "\u2014"),
          },
          {
            label: "Duration",
            key: "duration",
            type: "text",
            gridSpan: 4,
            render: (rec) => (rec.duration != null ? `${rec.duration.toFixed(2)}s` : "\u2014"),
          },
        ],
      },
      {
        title: "Accessibility",
        fields: [{ label: "Alt Text", key: "altText", type: "text", gridSpan: 12 }],
      },
      {
        title: "Preview",
        fields: [
          {
            label: "Media Preview",
            key: "url",
            type: "media",
            gridSpan: 12,
          },
        ],
      },
    ],
    sidebarSections: [
      {
        title: "Audit Trail",
        fields: [
          { label: "Is Archived", key: "isArchived", type: "boolean" },
          { label: "Archived At", key: "archivedAt", type: "datetime" },
          { label: "Created At", key: "createdAt", type: "datetime" },
          { label: "Updated At", key: "updatedAt", type: "datetime" },
        ],
      },
    ],
  };

  return <DetailEngine data={item} config={config as any} />;
}
