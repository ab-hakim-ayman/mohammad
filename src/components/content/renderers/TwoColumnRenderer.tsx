import React from "react";

export function TwoColumnRenderer({ block }: { block: any }) {
  const { leftHeading, leftContent, rightHeading, rightContent } = block.props;

  return (
    <div className="not-prose bg-card border-border my-8 grid gap-8 rounded-none sm:rounded-lg border p-6 shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12 3xl:gap-10 5xl:gap-12 md:grid-cols-2 md:gap-12 5xl:grid-cols-2">
      <div className="space-y-4">
        {leftHeading && <h4 className="text-foreground text-xl font-bold">{leftHeading}</h4>}
        {leftContent && (
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{leftContent}</p>
        )}
      </div>
      <div className="space-y-4">
        {rightHeading && <h4 className="text-foreground text-xl font-bold">{rightHeading}</h4>}
        {rightContent && (
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {rightContent}
          </p>
        )}
      </div>
    </div>
  );
}
