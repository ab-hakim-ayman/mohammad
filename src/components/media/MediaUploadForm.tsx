"use client";

import React, { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import type { MediaEntityType, MediaUsageType } from "@/shared/types";
import type { MediaUploadInput } from "@/features/media";
import { Select } from "@/shared/components";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";

export type MediaUploadFormProps = {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  defaultFolder?: string;
};

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

export function MediaUploadForm({
  onSubmit,
  isSubmitting = false,
  submitLabel,
  defaultFolder = "a2icoders/media",
}: MediaUploadFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [folder, setFolder] = useState(defaultFolder);
  const [altText, setAltText] = useState("");
  const [entityType, setEntityType] = useState("");
  const [entityId, setEntityId] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [usageType, setUsageType] = useState<MediaUsageType>("OTHER");
  const [isPrimary, setIsPrimary] = useState(false);

  const fileSummary = useMemo(
    () => files.map((file) => `${file.name} (${Math.ceil(file.size / 1024)} KB)`),
    [files]
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(event.target.files || []));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      files,
      folder: folder.trim() || null,
      altText: altText.trim() || null,
      attachment:
        entityType.trim() && entityId.trim()
          ? {
              entityType: entityType.trim() as MediaEntityType,
              entityId: entityId.trim(),
              fieldName: fieldName.trim() || "default",
              usageType,
              isPrimary,
              sortOrder: 0,
            }
          : null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "border-border bg-card space-y-5 rounded-xl border p-6 shadow-xs transition-all duration-300 md:p-7 lg:p-8 3xl:p-10 5xl:p-12",
        "hover:border-border hover:-translate-y-0.5 hover:shadow-md"
      )}
    >
      {}
      <div className="space-y-2">
        <label className="text-foreground text-sm font-semibold tracking-tight">
          <>
            <I18n>Select files to upload</I18n>
          </>
        </label>
        <input
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
          onChange={handleFileChange}
          disabled={isSubmitting}
          className={cn(
            "border-border bg-background text-foreground file:bg-primary/10 file:text-primary hover:file:bg-primary/20 block w-full rounded-lg border px-4 py-3 text-xs outline-hidden transition-all file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-1 file:text-xs file:font-semibold md:text-sm",
            "focus:border-primary/50 focus:ring-primary/20 focus:ring-1",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
        <p className="text-muted-foreground/80 text-xs leading-relaxed">
          <>
            <I18n>Supports multiple files.</I18n>
          </>
        </p>
      </div>

      {}
      {fileSummary.length > 0 && (
        <div className="border-border bg-muted/20 animate-in fade-in rounded-none sm:rounded-xl border p-4 text-xs duration-200 md:text-sm md:p-6 lg:p-6 3xl:p-7 5xl:p-8">
          <div className="text-muted-foreground border-border flex items-center justify-between gap-3 border-b pb-2 font-semibold">
            <span className="inline-flex items-center gap-2">
              <UploadCloud className="text-primary h-4 w-4" />
              <>
                <I18n>Queued Files</I18n>
              </>
            </span>
            <button
              type="button"
              onClick={() => setFiles([])}
              className="text-destructive inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent text-xs font-semibold outline-hidden hover:underline"
            >
              <X className="h-3.5 w-3.5" />
              <>
                <I18n>Clear</I18n>
              </>
            </button>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 5xl:grid-cols-8">
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

      {}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-5 5xl:grid-cols-8">
        <div className="space-y-2">
          <label className="text-foreground block text-sm font-semibold tracking-tight">
            <>
              <I18n>Folder Name (Optional)</I18n>
            </>
          </label>
          <input
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            disabled={isSubmitting}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-primary/20 w-full rounded-lg border px-4 py-3 text-xs outline-hidden transition-all focus:ring-1 md:text-sm"
            placeholder={defaultFolder}
          />
        </div>

        <div className="space-y-2">
          <label className="text-foreground block text-sm font-semibold tracking-tight">
            <>
              <I18n>Usage Type (Optional)</I18n>
            </>
          </label>
          <Select
            value={usageType}
            onValueChange={(value) => setUsageType(value as MediaUsageType)}
            options={usageOptions.map((option) => ({
              value: option,
              label: option,
            }))}
            className="w-full"
            ariaLabel="Select Usage Type"
          />
        </div>
      </div>

      {}
      <div className="space-y-2">
        <label className="text-foreground block text-sm font-semibold tracking-tight">
          <>
            <I18n>Alt Text (Optional)</I18n>
          </>
        </label>
        <input
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          disabled={isSubmitting}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-primary/20 w-full rounded-lg border px-4 py-3 text-xs outline-hidden transition-all focus:ring-1 md:text-sm"
        />
      </div>

      {}
      <div className="border-border space-y-3 border-t pt-3 md:pt-4 lg:pt-5 3xl:pt-6 5xl:pt-7">
        <div className="text-muted-foreground/80 text-xs font-bold tracking-wider uppercase">
          <I18n>Attachment Bindings (Optional)</I18n>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 3xl:grid-cols-5 5xl:grid-cols-8">
          <div className="space-y-2">
            <label className="text-muted-foreground block text-xs font-semibold">
              <>
                <I18n>Entity Type (Optional)</I18n>
              </>
            </label>
            <input
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              disabled={isSubmitting}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-primary/20 w-full rounded-lg border px-4 py-3 text-xs outline-hidden transition-all focus:ring-1 md:text-sm"
              placeholder="e.g. BlogPost, User"
            />
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground block text-xs font-semibold">
              <>
                <I18n>Entity ID (Optional)</I18n>
              </>
            </label>
            <input
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              disabled={isSubmitting}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-primary/20 w-full rounded-lg border px-4 py-3 text-xs outline-hidden transition-all focus:ring-1 md:text-sm"
              placeholder="e.g. 123e4567-e89b-12d3..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground block text-xs font-semibold">
              <>
                <I18n>Field Name (Optional)</I18n>
              </>
            </label>
            <input
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              disabled={isSubmitting}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-primary/20 w-full rounded-lg border px-4 py-3 text-xs outline-hidden transition-all focus:ring-1 md:text-sm"
              placeholder="e.g. avatar, cover, thumbnail"
            />
          </div>
        </div>
      </div>

      {}
      <div className="pt-2">
        <label className="text-foreground inline-flex cursor-pointer items-center gap-3 text-xs font-medium select-none md:text-sm">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
            disabled={isSubmitting}
            className={cn(
              "border-border text-primary accent-primary focus:ring-primary/30 h-4 w-4 cursor-pointer rounded-xs outline-hidden transition-all focus:ring-1",
              "disabled:cursor-not-allowed disabled:opacity-40"
            )}
          />
          <>
            <I18n>Mark as Primary</I18n>
          </>
        </label>
      </div>

      {}
      <div className="border-border flex justify-end border-t pt-3 md:pt-4 3xl:pt-5 5xl:pt-6">
        <button
          type="submit"
          disabled={isSubmitting || files.length === 0}
          className={cn(
            "bg-primary text-primary-foreground inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-6 text-xs font-medium shadow-xs outline-hidden transition-all md:text-sm",
            "hover:bg-primary/90 hover:shadow-sm",
            "select-none disabled:pointer-events-none disabled:opacity-40"
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <>
                <I18n>Uploading...</I18n>
              </>
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4" />
              {submitLabel ?? "Upload Media"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
