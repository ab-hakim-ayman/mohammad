"use client";

import { useMedia } from "@/features/media";
import type { MediaRecord } from "@/features/media";
import { cn } from "@/lib/utils";
import { Pagination } from "@/shared/components";
import { Check, FileText, Loader2, PlayCircle, Search, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import I18n from "@/shared/components/I18n";

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (urls: string[], altTexts?: (string | null)[]) => void;
  multiple?: boolean;
  folder?: string;
}

export function MediaPicker({ open, onClose, ...props }: MediaPickerProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="border-border bg-card flex max-h-[90vh] max-w-4xl flex-col gap-0 overflow-hidden rounded-xl border p-0 shadow-2xl">
        <MediaPickerContent onClose={onClose} {...props} />
      </DialogContent>
    </Dialog>
  );
}

function MediaPickerContent({
  onClose,
  onSelect,
  multiple = false,
  folder,
}: Omit<MediaPickerProps, "open">) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pickerAltText, setPickerAltText] = useState("");

  const { data, isLoading } = useMedia({
    page,
    limit: 12,
    search: search || undefined,
    folder: folder || undefined,
    isArchived: false,
  });

  const mediaItems: MediaRecord[] = data?.data ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 12,
  };

  const toggleItem = (id: string) => {
    setPickerAltText("");
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const selected = mediaItems.filter((item) => selectedIds.has(item.id));
    const urls = selected.map((item) => item.url);
    const altTexts = multiple ? undefined : [pickerAltText || null];
    onSelect(urls, altTexts);
    onClose();
  };

  return (
    <>
      {/* 👉 হেডার থেকে এক্সট্রা কাস্টম ক্লোজ বাটনটি রিমুভ করে দেওয়া হয়েছে, এখন আর ডাবল বাটন দেখাবে না */}
      <DialogHeader className="border-border flex flex-row items-center justify-between space-y-0 border-b px-6 py-4">
        <DialogTitle className="text-foreground text-lg font-semibold tracking-tight">
          <>
            <I18n>Select Media</I18n>
          </>
        </DialogTitle>
      </DialogHeader>

      <div className="border-border bg-card/50 border-b px-6 py-3">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-primary/20 w-full rounded-lg border py-2 pr-4 pl-10 text-sm outline-hidden transition-all focus:ring-1"
          />
        </div>
      </div>

      <div className="min-h-[300px] flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : mediaItems.length === 0 ? (
          <div className="text-muted-foreground flex h-48 items-center justify-center text-sm font-medium">
            <>
              <I18n>No media found.</I18n>
            </>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {mediaItems.map((item) => {
              const isSelected = selectedIds.has(item.id);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={cn(
                    "group bg-card relative cursor-pointer overflow-hidden rounded-xl border-2 text-left shadow-xs outline-hidden transition-all duration-200",
                    isSelected
                      ? "border-primary ring-primary/20 ring-2"
                      : "border-border hover:border-muted-foreground/30 hover:bg-muted/10"
                  )}
                >
                  {item.resourceType === "IMAGE" ? (
                    <div className="bg-muted/30 relative h-28 w-full overflow-hidden">
                      <Image
                        src={item.url}
                        alt={item.altText || ""}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-102"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  ) : (
                    <div className="bg-muted/40 flex h-28 w-full items-center justify-center">
                      {item.resourceType === "VIDEO" ? (
                        <PlayCircle className="text-muted-foreground group-hover:text-primary h-8 w-8 transition-colors" />
                      ) : (
                        <FileText className="text-muted-foreground group-hover:text-primary h-8 w-8 transition-colors" />
                      )}
                    </div>
                  )}
                  <div className="border-border bg-card border-t px-3 py-2">
                    <p className="text-foreground truncate text-xs font-semibold">
                      {item.originalFilename || item.providerAssetId}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="bg-primary text-primary-foreground animate-in scale-in absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full shadow-xs duration-100">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-border bg-card flex flex-col items-center justify-between gap-4 border-t px-6 py-4 sm:flex-row">
        <div className="w-full flex-1 sm:w-auto">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
            className="pr-4"
          />
        </div>

        <div className="flex w-full flex-wrap items-center justify-end gap-4 sm:w-auto">
          <span className="text-muted-foreground text-xs font-semibold whitespace-nowrap md:text-sm">
            <>
              <I18n>Selected</I18n>
            </>
          </span>

          {selectedIds.size === 1 && !multiple && (
            <div className="animate-in fade-in slide-in-from-left-2 flex items-center gap-2 duration-200">
              <label className="text-muted-foreground text-xs font-semibold whitespace-nowrap">
                <>
                  <I18n>Alt text</I18n>
                </>
              </label>
              <input
                type="text"
                placeholder="Alt text for this usage (optional)"
                value={pickerAltText}
                onChange={(e) => setPickerAltText(e.target.value)}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20 w-40 rounded-lg border px-3 py-2 text-xs outline-hidden transition-all focus:ring-1"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="border-border bg-background text-foreground hover:bg-muted inline-flex h-10 cursor-pointer items-center justify-center rounded-none sm:rounded-lg border px-4 text-xs font-semibold shadow-xs outline-hidden transition-colors md:text-sm"
            >
              <>
                <I18n>Cancel</I18n>
              </>
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selectedIds.size === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 -ml-1 cursor-pointer items-center justify-center rounded-full px-6 text-xs font-medium shadow-xs outline-hidden transition-all disabled:pointer-events-none disabled:opacity-40 md:text-sm"
            >
              <>
                <I18n>Select</I18n>
              </>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}