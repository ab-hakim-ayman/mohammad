"use client";

import Image from "next/image";
import { type ChangeEvent, useMemo, useState } from "react";
import { Library, Loader2, UploadCloud, X, ImageIcon } from "lucide-react";
import { mediaApi } from "@/features/media";
import { MediaPicker } from "./MediaPicker";
import { cn } from "@/lib/utils";
import I18n from "@/shared/components/I18n";

interface MediaUploaderProps {
  label?: string;
  value: string | string[] | null | undefined;
  onChange: (value: string | string[] | null) => void;
  folder: string;
  accept?: string;
  multiple?: boolean;
  helperText?: string;
  name?: string;
  altText?: string | null;
  onAltTextChange?: (value: string) => void;
  showAltText?: boolean;
  altTexts?: (string | null)[];
  onAltTextsChange?: (altTexts: (string | null)[]) => void;
}

function isImageUrl(url: string) {
  return /\.(png|jpe?g|webp|gif|avif|bmp|svg)$/i.test(url) || url.includes("image/upload");
}

function isVideoUrl(url: string) {
  return (
    /\.(mp4|webm|ogg|mov|avi|mkv|m4v)$/i.test(url) ||
    url.includes("video/upload") ||
    (url.includes("res.cloudinary.com") && url.includes("/video/"))
  );
}

export function MediaUploader({
  label,
  value,
  onChange,
  folder,
  accept = "image/*",
  multiple = false,
  helperText,
  name,
  altText,
  onAltTextChange,
  showAltText,
  altTexts,
  onAltTextsChange,
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const values = useMemo(() => (Array.isArray(value) ? value : value ? [value] : []), [value]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setIsUploading(true);
    try {
      setUploadError(null);
      const response = await mediaApi.upload({ files, folder, altText: altText || undefined });
      const urls = (response.data || []).map((item) => item.url).filter(Boolean);

      if (multiple) {
        onChange([...values, ...urls]);
      } else {
        onChange(urls[0] || null);
      }
      event.target.value = "";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload Failed";
      setUploadError(message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeItem = (index: number) => {
    if (!multiple) {
      onChange(null);
      return;
    }
    onChange(values.filter((_, i) => i !== index));
    if (altTexts && onAltTextsChange) {
      onAltTextsChange(altTexts.filter((_, i) => i !== index));
    }
  };

  const updateAltText = (index: number, value: string) => {
    if (!onAltTextsChange) return;
    const next = altTexts ? [...altTexts] : values.map(() => null);
    next[index] = value || null;
    onAltTextsChange(next);
  };

  return (
    <div className="border-border/70 bg-card/40 w-full space-y-3 rounded-2xl border p-4 shadow-2xs backdrop-blur-md select-none">
      {/* Label & Helper Text */}
      {label && (
        <div className="border-border/40 space-y-0.5 border-b pb-2">
          <div className="text-foreground/80 text-[11px] font-bold tracking-widest uppercase">
            <I18n>{label}</I18n>
          </div>
          {helperText && (
            <div className="text-muted-foreground text-xs leading-relaxed">{helperText}</div>
          )}
        </div>
      )}

      {/* Action Buttons Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="border-border/80 bg-background/80 hover:bg-card text-foreground inline-flex h-8 cursor-pointer items-center gap-2 rounded-xl border px-3 text-xs font-semibold shadow-2xs transition-all">
            {isUploading ? (
              <Loader2 className="text-primary h-3.5 w-3.5 animate-spin" />
            ) : (
              <UploadCloud className="text-primary h-3.5 w-3.5" />
            )}
            <span>
              {isUploading ? (
                <I18n>Uploading...</I18n>
              ) : multiple ? (
                <I18n>Upload Files</I18n>
              ) : (
                <I18n>Upload File</I18n>
              )}
            </span>
            <input
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={handleUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>

          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="border-border/80 bg-background/80 hover:bg-card text-muted-foreground hover:text-foreground inline-flex h-8 cursor-pointer items-center gap-2 rounded-xl border px-3 text-xs font-semibold shadow-2xs transition-all"
          >
            <Library className="h-3.5 w-3.5" />
            <span>
              <I18n>Browse Library</I18n>
            </span>
          </button>
        </div>

        {isUploading && (
          <span className="text-muted-foreground hidden animate-pulse text-xs font-medium sm:inline-block">
            <I18n>Processing asset...</I18n>
          </span>
        )}
      </div>

      {/* Alt Text Input */}
      {!multiple && showAltText !== false && values.length > 0 && !isVideoUrl(values[0]) && (
        <input
          type="text"
          placeholder="Alt text for image accessibility..."
          value={altText || ""}
          onChange={(e) => onAltTextChange?.(e.target.value)}
          maxLength={255}
          className="bg-background/60 border-border/80 focus-visible:ring-primary/20 text-foreground placeholder:text-muted-foreground/60 h-9 w-full rounded-xl border px-3 text-xs transition-all outline-none focus-visible:ring-2"
        />
      )}

      {name && !multiple && <input type="hidden" name={name} value={values[0] || ""} readOnly />}

      {/* Error Alert */}
      {uploadError && (
        <div className="border-destructive/20 bg-destructive/10 text-destructive animate-in fade-in rounded-xl border px-3.5 py-2 text-xs font-semibold">
          {uploadError}
        </div>
      )}

      {/* 🟢 Media Preview Area (Centered properly using mx-auto and flex-col) */}
      {values.length > 0 ? (
        <div
          className={cn(
            "pt-1 w-full",
            multiple
              ? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              : "flex flex-col items-center justify-center"
          )}
        >
          {values.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className={cn(
                "border-border/80 bg-background/80 group relative overflow-hidden rounded-xl border shadow-2xs transition-all",
                !multiple ? "w-full max-w-sm mx-auto" : "w-full max-w-[200px] mx-auto"
              )}
            >
              {isImageUrl(url) ? (
                <div
                  className={cn(
                    "relative w-full overflow-hidden bg-black/5 dark:bg-black/20",
                    multiple ? "h-28 sm:h-32" : "aspect-video"
                  )}
                >
                  <Image
                    src={url}
                    alt={
                      multiple
                        ? altTexts?.[index] || `${label || "Media"} ${index + 1}`
                        : `${label || "Media"} ${index + 1}`
                    }
                    fill
                    unoptimized
                    className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : isVideoUrl(url) ? (
                <video
                  src={url}
                  controls
                  className={cn(
                    "w-full bg-black/80",
                    multiple ? "h-28 object-cover sm:h-32" : "aspect-video object-contain"
                  )}
                />
              ) : (
                <div
                  className={cn(
                    "text-muted-foreground flex items-center justify-center p-3 font-mono text-xs break-all",
                    multiple ? "h-28 sm:h-32" : "h-40"
                  )}
                >
                  {url}
                </div>
              )}

              {/* Remove Button Badge */}
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute top-2 right-2 z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full shadow-md transition-transform hover:scale-110"
                title="Remove Media"
              >
                <X className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>

              {/* Alt Text for Multiple Media */}
              {multiple && showAltText !== false && !isVideoUrl(url) && (
                <div className="border-border/60 bg-background/50 border-t p-2">
                  <input
                    type="text"
                    placeholder={`Alt text #${index + 1}`}
                    value={altTexts?.[index] || ""}
                    onChange={(e) => updateAltText(index, e.target.value)}
                    maxLength={255}
                    className="border-border/40 focus:border-primary text-foreground placeholder:text-muted-foreground/50 block w-full rounded-lg border bg-transparent px-2 py-1 text-[11px] transition-all outline-none"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* 🟢 Empty State Dashed Dropzone Box (Centered properly) */
        <div className="mx-auto flex max-w-sm flex-col items-center justify-center">
          <div className="border-border/60 bg-background/40 hover:bg-muted/20 flex min-h-[110px] w-full flex-col items-center justify-center rounded-xl border border-dashed p-3.5 text-center transition-all">
            <ImageIcon className="text-muted-foreground/40 mb-1 h-6 w-6" />
            <p className="text-foreground text-xs font-semibold">
              <I18n>{multiple ? "No files selected" : "No media selected"}</I18n>
            </p>
            <p className="text-muted-foreground mt-0.5 text-[10px]">
              <I18n>Upload or select assets from media library</I18n>
            </p>
          </div>
        </div>
      )}

      {multiple &&
        name &&
        values.map((item, index) => (
          <input key={`${name}-${index}`} type="hidden" name={name} value={item} readOnly />
        ))}

      {/* Media Picker Modal */}
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(urls, selectedAltTexts) => {
          if (multiple) {
            onChange([...values, ...urls]);
          } else {
            onChange(urls[0] || null);
            if (selectedAltTexts?.[0]) {
              onAltTextChange?.(selectedAltTexts[0]);
            }
          }
        }}
        multiple={multiple}
        folder={folder}
      />
    </div>
  );
}