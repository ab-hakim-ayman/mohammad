"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FileText, ImageIcon, PlayCircle, Copy, Check } from "lucide-react";
import type { MediaRecord } from "../types/media.types";
import I18n from "@/shared/components/I18n";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="border-border/80 bg-card hover:bg-muted/80 text-foreground inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold shadow-2xs transition-all"
      title="Copy direct Cloudinary URL"
    >
      {copied ? (
        <Check className="text-success h-3.5 w-3.5" />
      ) : (
        <Copy className="text-muted-foreground h-3.5 w-3.5" />
      )}
      <span>{copied ? <I18n>Copied!</I18n> : <I18n>Copy URL</I18n>}</span>
    </button>
  );
}

export function MediaDetail({ media }: { media: MediaRecord }) {
  if (!media) return null;

  // 🎯 Normalize data for DetailEngine compatibility
  const normalizedData = {
    ...media,
    title: media.originalFilename || media.providerAssetId,
    status: media.isArchived ? "ARCHIVED" : "ACTIVE",
    createdByName:
      media.createdBy?.profile?.fullName || media.createdBy?.name || media.createdBy?.email || "—",
    updatedByName:
      media.updatedBy?.profile?.fullName || media.updatedBy?.name || media.updatedBy?.email || "—",
    fileSizeFormatted: media.fileSize ? `${Math.round(media.fileSize / 1024)} KB` : "—",
    dimensionsFormatted: media.width && media.height ? `${media.width} x ${media.height} px` : "—",
    durationFormatted: media.duration ? `${media.duration.toFixed(2)}s` : "—",
  };

  const config: DetailEngineConfig<typeof normalizedData> = {
    titleKey: "title",
    subtitleKey: "providerAssetId",
    statusKey: "status",
    headerIcon:
      media.resourceType === "IMAGE"
        ? ImageIcon
        : media.resourceType === "VIDEO"
          ? PlayCircle
          : FileText,
    eyebrow: "Cloudinary Asset",
    actions: {
      backHref: "/admin/media",
    },
    mainSections: [
      {
        title: "Asset Preview",
        fields: [
          {
            label: "Preview",
            key: "url",
            type: "custom",
            gridSpan: 12,
            render: (item) => (
              <div className="space-y-3">
                <div className="border-border/60 flex max-h-[480px] min-h-[320px] w-full items-center justify-center overflow-hidden rounded-xl border bg-black/5 dark:bg-black/40">
                  {item.resourceType === "IMAGE" ? (
                    <Image
                      src={item.url}
                      alt={item.altText || item.title || "Media"}
                      width={1600}
                      height={1000}
                      unoptimized
                      className="h-full w-full object-contain"
                    />
                  ) : item.resourceType === "VIDEO" ? (
                    <video src={item.url} controls className="h-full max-h-[480px] w-full" />
                  ) : (
                    <div className="space-y-3 p-6 text-center">
                      <FileText className="text-muted-foreground/60 mx-auto h-12 w-12" />
                      <p className="text-foreground max-w-xs truncate text-xs font-semibold">
                        {item.originalFilename || "File asset"}
                      </p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary inline-flex items-center gap-1 text-xs font-bold hover:underline"
                      >
                        <I18n>Open direct file</I18n>
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground text-xs font-medium">Direct URL</span>
                  <CopyUrlButton url={item.url} />
                </div>
              </div>
            ),
          },
        ],
      },
      {
        title: "Technical Specifications",
        fields: [
          { label: "Provider", key: "provider", type: "text", gridSpan: 6 },
          { label: "Resource Type", key: "resourceType", type: "text", gridSpan: 6 },
          { label: "Mime Type", key: "mimeType", type: "text", gridSpan: 6 },
          { label: "File Size", key: "fileSizeFormatted", type: "text", gridSpan: 6 },
          { label: "Dimensions", key: "dimensionsFormatted", type: "text", gridSpan: 6 },
          { label: "Duration", key: "durationFormatted", type: "text", gridSpan: 6 },
          { label: "Folder", key: "folder", type: "text", gridSpan: 6 },
          { label: "Alt Text", key: "altText", type: "text", gridSpan: 6 },
        ],
      },
    ],
    sidebarSections: [
      {
        title: "Ownership & Metadata",
        fields: [
          { label: "Created By", key: "createdByName", type: "text" },
          { label: "Updated By", key: "updatedByName", type: "text" },
          { label: "Created At", key: "createdAt", type: "datetime" },
          { label: "Updated At", key: "updatedAt", type: "datetime" },
        ],
      },
    ],
    relatedSections:
      media.attachments && media.attachments.length > 0
        ? [
            {
              title: "Linked Attachments",
              variant: "list",
              hrefPrefix: "attachments",
              getRecords: (item) =>
                item.attachments?.map((att: any) => ({
                  id: att.id,
                  title: att.entityType,
                  subtitle: `${att.entityId} ${att.fieldName ? `· ${att.fieldName}` : ""}`,
                })) || [],
            },
          ]
        : undefined,
  };

  return <DetailEngine data={normalizedData} config={config as any} />;
}
