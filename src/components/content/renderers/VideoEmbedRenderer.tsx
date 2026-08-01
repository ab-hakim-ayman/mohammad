import React from "react";
import I18n from "@/shared/components/I18n";

export function VideoEmbedRenderer({ block }: { block: any }) {
  const { provider, url, title } = block.props;
  if (!url) return null;

  let embedUrl = "";
  if (provider === "youtube") {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
    );
    if (match?.[1]) embedUrl = `https://www.youtube-nocookie.com/embed/${match[1]}`;
  } else if (provider === "vimeo") {
    const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (match?.[1]) embedUrl = `https://player.vimeo.com/video/${match[1]}`;
  }

  if (!embedUrl)
    return (
      <div className="bg-muted text-muted-foreground border-border not-prose my-8 rounded-none sm:rounded-lg border p-4 text-center text-sm 3xl:my-10 5xl:my-12 3xl:p-6 5xl:p-6">
        <I18n>Invalid video URL</I18n>
      </div>
    );

  return (
    <div className="border-border not-prose bg-muted relative my-8 w-full overflow-hidden rounded-none sm:rounded-xl border pt-[56.25%] shadow-lg transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12">
      <iframe
        src={embedUrl}
        title={title || "Video player"}
        className="absolute top-0 left-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
