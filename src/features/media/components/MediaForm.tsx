"use client";

import { useMemo } from "react";
import { ExternalLink, File } from "lucide-react";
import { z } from "zod";
import { FormEngine } from "@/shared/components/forms/FormEngine";
import { FormEngineConfig } from "@/shared/components/forms/form-engine.types";
import I18n from "@/shared/components/I18n";
import { MediaUpdateSchema } from "../schemas/media.schema";
import type { MediaUpdatePayload, MediaRecord } from "../types/media.types";

interface MediaFormProps {
  initialData?: MediaRecord;
  onSubmit: (data: any) => Promise<void> | void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

const usageOptions = [
  "FAVICON",
  "HERO",
  "HERO_VIDEO",
  "BANNER",
  "COVER",
  "CARD",
  "OG_IMAGE",
  "GALLERY",
  "AVATAR",
  "THUMBNAIL",
  "VIDEO",
  "DOCUMENT",
  "OTHER",
];

const MediaCreateSchema = z.object({
  files: z.any().refine(
    (files) => {
      if (!files) return false;
      if (files instanceof FileList) return files.length > 0;
      if (Array.isArray(files)) return files.length > 0;
      return false;
    },
    { message: "At least one file is required" }
  ),
  folder: z
    .string()
    .trim()
    .max(250)
    .nullish()
    .transform((value) => value || null),
  altText: z
    .string()
    .trim()
    .max(250)
    .nullish()
    .transform((value) => value || null),
  usageType: z.string().default("OTHER"),
  entityType: z
    .string()
    .trim()
    .nullish()
    .transform((value) => value || null),
  entityId: z
    .string()
    .trim()
    .nullish()
    .transform((value) => value || null),
  fieldName: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .nullish()
    .transform((value) => value || "default"),
  isPrimary: z.boolean().default(false),
});

function formatFileSize(bytes: number | null | undefined) {
  if (bytes == null) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function MediaForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  mode = "edit",
}: MediaFormProps) {
  const schema = mode === "create" ? MediaCreateSchema : MediaUpdateSchema;

  const config: FormEngineConfig<any> = useMemo(() => {
    if (mode === "create") {
      return {
        sections: [
          {
            title: "Upload Files",
            fields: [
              {
                name: "files",
                label: "Select files to upload",
                type: "custom",
                required: true,
                gridSpan: 12,
                renderCustom: (methods) => {
                  const filesVal = methods.watch("files");
                  const fileList = filesVal
                    ? Array.from(filesVal instanceof FileList ? filesVal : (filesVal as File[]))
                    : [];

                  const fileSummary = fileList.map(
                    (file) => `${file.name} (${Math.ceil(file.size / 1024)} KB)`
                  );

                  return (
                    <div className="space-y-4">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                        onChange={(e) => {
                          if (e.target.files) {
                            methods.setValue("files", e.target.files, { shouldValidate: true });
                          }
                        }}
                        className="border-border bg-background text-foreground file:bg-primary/10 file:text-primary hover:file:bg-primary/20 block w-full rounded-lg border px-4 py-3 text-xs outline-hidden transition-all file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-1 file:text-xs file:font-semibold md:text-sm focus:border-primary/50 focus:ring-primary/20 focus:ring-1"
                      />
                      {fileSummary.length > 0 && (
                        <div className="border-border bg-muted/20 animate-in fade-in rounded-xl border p-4 text-xs duration-200">
                          <div className="text-muted-foreground border-border flex items-center justify-between gap-3 border-b pb-2 font-semibold">
                            <span className="inline-flex items-center gap-2">
                              <File className="text-primary h-4 w-4" />
                              <I18n>Queued Files</I18n>
                            </span>
                            <button
                              type="button"
                              onClick={() => methods.setValue("files", null as any, { shouldValidate: true })}
                              className="text-destructive inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent text-xs font-semibold outline-hidden hover:underline"
                            >
                              <I18n>Clear</I18n>
                            </button>
                          </div>
                          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {fileSummary.map((item) => (
                              <li
                                key={item}
                                className="bg-background text-foreground border-border truncate rounded-lg border px-3 py-2 text-xs font-medium shadow-2xs"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                },
              },
            ],
          },
          {
            title: "Upload Settings",
            fields: [
              {
                name: "folder",
                label: "Folder Name (Optional)",
                type: "text",
                placeholder: "a2icoders/media",
                gridSpan: 6,
              },
              {
                name: "usageType",
                label: "Usage Type (Optional)",
                type: "select",
                options: usageOptions.map((o) => ({ label: o, value: o })),
                gridSpan: 6,
              },
              {
                name: "altText",
                label: "Alt Text (Optional)",
                type: "text",
                placeholder: "Enter descriptive alt text for accessibility...",
                gridSpan: 12,
              },
            ],
          },
          {
            title: "Attachment Bindings (Optional)",
            description: "Link this media to a specific database record right away.",
            fields: [
              {
                name: "entityType",
                label: "Entity Type (Optional)",
                type: "text",
                placeholder: "e.g., SITE_INFO, ABOUT, HERO...",
                gridSpan: 4,
              },
              {
                name: "entityId",
                label: "Entity ID (Optional)",
                type: "text",
                placeholder: "e.g., cuid string...",
                gridSpan: 4,
              },
              {
                name: "fieldName",
                label: "Field Name (Optional)",
                type: "text",
                placeholder: "e.g., logo, heroImage...",
                gridSpan: 4,
              },
              {
                name: "isPrimary",
                label: "Mark as Primary",
                type: "switch",
                gridSpan: 12,
              },
            ],
          },
        ],
      };
    }

    return {
      sections: [
        {
          title: "Media Preview",
          fields: [
            {
              name: "altText" as any,
              label: "Preview",
              type: "custom",
              gridSpan: 12,
              renderCustom: () => {
                if (!initialData) return null;
                const { resourceType, url, altText, originalFilename } = initialData;

                return (
                  <div className="flex flex-col items-center justify-center p-6 border border-border/60 bg-muted/10 rounded-2xl w-full select-none">
                    {resourceType === "IMAGE" && (
                      <div className="relative group max-h-80 overflow-hidden rounded-xl border border-border bg-muted/30 shadow-md">
                        <img
                          src={url}
                          alt={altText || originalFilename || "Media preview"}
                          className="max-h-80 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      </div>
                    )}

                    {resourceType === "VIDEO" && (
                      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-muted/30 shadow-md">
                        <video src={url} controls className="w-full max-h-80 object-contain" />
                      </div>
                    )}

                    {resourceType === "AUDIO" && (
                      <div className="w-full max-w-xl p-4 rounded-xl border border-border bg-muted/30 shadow-sm">
                        <audio src={url} controls className="w-full" />
                      </div>
                    )}

                    {resourceType !== "IMAGE" && resourceType !== "VIDEO" && resourceType !== "AUDIO" && (
                      <div className="flex flex-col items-center gap-3 p-8 border border-dashed border-border/80 rounded-xl bg-muted/20">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <File className="h-8 w-8" />
                        </div>
                        <span className="text-xs font-semibold text-foreground/80 max-w-xs truncate">
                          {originalFilename || "Document File"}
                        </span>
                      </div>
                    )}
                  </div>
                );
              },
            },
          ],
        },
        {
          title: "Edit Details",
          fields: [
            {
              name: "altText",
              label: "Alt Text",
              type: "text",
              placeholder: "Enter descriptive alt text for accessibility...",
              gridSpan: 6,
            },
            {
              name: "folder",
              label: "Folder",
              type: "text",
              placeholder: "e.g., abouts, gallery...",
              gridSpan: 6,
            },
            {
              name: "isArchived",
              label: "Archived Status",
              type: "switch",
              description: "Archived media will not be displayed on public frontend views.",
              gridSpan: 12,
            },
          ],
        },
        {
          title: "Technical Specifications",
          fields: [
            {
              name: "altText" as any,
              label: "Technical Information",
              type: "custom",
              gridSpan: 12,
              renderCustom: () => {
                if (!initialData) return null;
                const {
                  id,
                  url,
                  provider,
                  resourceType,
                  providerAssetId,
                  originalFilename,
                  mimeType,
                  fileSize,
                  width,
                  height,
                  duration,
                  createdAt,
                  updatedAt,
                } = initialData;

                const formatVal = (val: any) => (val != null ? val : "—");

                const specItems = [
                  { label: "Media ID", value: id },
                  { label: "Original Filename", value: formatVal(originalFilename) },
                  { label: "MIME Type", value: formatVal(mimeType) },
                  { label: "File Size", value: fileSize ? formatFileSize(fileSize) : "—" },
                  { label: "Storage Provider", value: provider },
                  { label: "Resource Type", value: resourceType },
                  { label: "Provider Asset ID", value: providerAssetId },
                  ...(width && height
                    ? [{ label: "Dimensions", value: `${width}px × ${height}px` }]
                    : []),
                  ...(duration
                    ? [{ label: "Duration", value: `${duration.toFixed(2)}s` }]
                    : []),
                  {
                    label: "Created At",
                    value: createdAt ? new Date(createdAt).toLocaleString() : "—",
                  },
                  {
                    label: "Updated At",
                    value: updatedAt ? new Date(updatedAt).toLocaleString() : "—",
                  },
                ];

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border/60 bg-muted/5 rounded-2xl p-4 text-xs">
                    {specItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col space-y-1 p-2 bg-background/40 border border-border/40 rounded-xl"
                      >
                        <span className="text-foreground/50 font-bold uppercase tracking-wider text-[10px]">
                          <I18n>{item.label}</I18n>
                        </span>
                        <span className="font-semibold text-foreground break-all select-all font-mono">
                          {item.value}
                        </span>
                      </div>
                    ))}
                    <div className="col-span-1 md:col-span-2 flex flex-col space-y-1 p-2 bg-background/40 border border-border/40 rounded-xl">
                      <span className="text-foreground/50 font-bold uppercase tracking-wider text-[10px]">
                        <I18n>File URL</I18n>
                      </span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-primary hover:underline flex items-center gap-1.5 break-all select-all font-mono"
                      >
                        {url}
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                );
              },
            },
          ],
        },
      ],
    };
  }, [initialData, mode]);

  const formattedDefaults = useMemo(() => {
    if (mode === "create") {
      return {
        files: null,
        folder: "a2icoders/media",
        altText: "",
        usageType: "OTHER",
        entityType: "",
        entityId: "",
        fieldName: "default",
        isPrimary: false,
      };
    }
    if (!initialData) return undefined;
    return {
      altText: initialData.altText || "",
      folder: initialData.folder || "",
      isArchived: !!initialData.isArchived,
    };
  }, [initialData, mode]);

  const onFormSubmit = async (values: any) => {
    if (mode === "create") {
      const fileList = values.files
        ? Array.from(values.files instanceof FileList ? values.files : (values.files as File[]))
        : [];

      const payload = {
        files: fileList,
        folder: values.folder?.trim() || null,
        altText: values.altText?.trim() || null,
        attachment:
          values.entityType?.trim() && values.entityId?.trim()
            ? {
                entityType: values.entityType.trim(),
                entityId: values.entityId.trim(),
                fieldName: values.fieldName?.trim() || "default",
                usageType: values.usageType,
                isPrimary: values.isPrimary,
                sortOrder: 0,
              }
            : null,
      };
      await onSubmit(payload);
    } else {
      await onSubmit(values);
    }
  };

  return (
    <FormEngine
      schema={schema}
      config={config}
      defaultValues={formattedDefaults as any}
      onSubmit={onFormSubmit}
      isSubmitting={isSubmitting}
      submitText={mode === "create" ? "Upload Media" : "Save Changes"}
      folderPrefix="a2icoders"
    />
  );
}


