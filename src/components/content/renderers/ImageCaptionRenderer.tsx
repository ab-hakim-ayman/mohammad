import React from "react";

export function ImageCaptionRenderer({ block }: { block: any }) {
  const { imageUrl, alt, caption, alignment } = block.props;
  if (!imageUrl) return null;

  const alignClasses = {
    left: "mr-auto text-left",
    center: "mx-auto text-center",
    right: "ml-auto text-right",
  };
  const wrapperClass = alignClasses[alignment as keyof typeof alignClasses] || alignClasses.center;

  return (
    <figure
      className={`not-prose my-8 flex flex-col container-custom ${wrapperClass} bg-card border-border rounded-xl border p-6 shadow-xs transition-all duration-300 hover:shadow-md`}
    >
      <div
        className="bg-muted/30 border-border relative w-full overflow-hidden rounded-none sm:rounded-xl border shadow-xs"
        style={{ aspectRatio: "16/9" }}
      >
        {}
        <img
          src={imageUrl}
          alt={alt || caption || ""}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
      {caption && (
        <figcaption className="text-muted-foreground mt-3 text-sm italic">{caption}</figcaption>
      )}
    </figure>
  );
}
