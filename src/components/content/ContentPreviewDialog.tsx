"use client";

import { useState } from "react";
import { Eye, X } from "lucide-react";
import type { ContentModelVariant } from "./types";
import { getRenderedPreview } from "./actions";
import I18n from "@/shared/components/I18n";

interface ContentPreviewDialogProps {
  content: unknown;
  variant: ContentModelVariant;
  buttonLabel?: string;
}

export function ContentPreviewDialog({
  content,
  variant,
  buttonLabel = "Preview Content",
}: ContentPreviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [renderedContent, setRenderedContent] = useState<React.ReactNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = async () => {
    setIsOpen(true);
    if (!renderedContent) {
      setIsLoading(true);
      try {
        const result = await getRenderedPreview(content, variant);
        setRenderedContent(result);
      } catch (err) {
        console.error("Failed to render preview", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!content) return null;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="border-border bg-surface hover:bg-muted text-foreground inline-flex items-center gap-2 rounded-none sm:rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
      >
        <Eye className="h-4 w-4" />
        {buttonLabel}
      </button>

      {isOpen && (
        <div className="bg-background/80 fixed inset-0 z-100 flex items-center justify-center p-4 backdrop-blur-xs sm:p-6">
          <div className="border-border bg-background flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl border shadow-2xl">
            <div className="border-border flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-foreground text-lg font-semibold">
                <I18n>Content Preview</I18n>
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="hover:bg-muted text-muted-foreground rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-6 lg:p-10">
              {isLoading ? (
                <div className="text-muted-foreground flex h-32 items-center justify-center">
                  <I18n>Rendering preview...</I18n>
                </div>
              ) : (
                renderedContent
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
