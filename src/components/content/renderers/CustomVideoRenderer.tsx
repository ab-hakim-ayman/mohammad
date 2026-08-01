import React from "react";

export function CustomVideoRenderer({ block }: { block: any }) {
  if (!block.props.url) return null;
  return (
    <div className="border-border not-prose bg-muted relative my-8 w-full overflow-hidden rounded-none sm:rounded-xl border pt-[56.25%] shadow-lg transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12">
      <video
        src={block.props.url}
        controls
        preload="metadata"
        className="absolute top-0 left-0 h-full w-full object-contain"
      />
    </div>
  );
}
