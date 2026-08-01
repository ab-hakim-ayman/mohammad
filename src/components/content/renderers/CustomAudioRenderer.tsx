import React from "react";
import I18n from "@/shared/components/I18n";

export function CustomAudioRenderer({ block }: { block: any }) {
  if (!block.props.url) return null;
  return (
    <div className="bg-card border-border not-prose my-8 flex w-full flex-col gap-4 rounded-none sm:rounded-lg border p-6 shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12 3xl:p-8 5xl:p-10">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
          <svg
            className="text-primary h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        </div>
        <span className="text-sm font-semibold">
          <I18n>Audio Track</I18n>
        </span>
      </div>
      <audio src={block.props.url} controls className="h-12 w-full" />
    </div>
  );
}
