import React from "react";
import I18n from "@/shared/components/I18n";

export function CustomFileRenderer({ block }: { block: any }) {
  if (!block.props.url) return null;
  return (
    <div className="bg-card border-border not-prose my-8 flex items-center justify-between rounded-none sm:rounded-lg border p-4 shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12 3xl:p-6 5xl:p-6">
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-md">
          <svg
            className="text-primary h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-semibold">
            {block.props.filename || "Download File"}
          </span>
          <span className="text-muted-foreground text-xs">
            <I18n>Document File</I18n>
          </span>
        </div>
      </div>
      <a
        href={block.props.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary ml-4 flex items-center gap-2 rounded-full p-2 px-5 text-xs font-semibold transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span className="hidden sm:inline">
          <I18n>Download</I18n>
        </span>
      </a>
    </div>
  );
}
