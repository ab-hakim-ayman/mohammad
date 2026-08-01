import React from "react";

export function FeatureGridRenderer({ block }: { block: any }) {
  let features: any[] = [];
  try {
    features = JSON.parse(block.props.featuresJson);
  } catch {
    return null;
  }
  if (!features.length) return null;

  return (
    <div className="not-prose bg-card border-border my-10 grid gap-6 rounded-none sm:rounded-lg border p-6 shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-12 5xl:my-16 3xl:p-8 5xl:p-10 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4">
      {features.map((feature, idx) => (
        <div
          key={idx}
          className="border-border bg-card flex flex-col gap-4 rounded-md border p-6 shadow-xs"
        >
          {feature.imageUrl && (
            <div className="bg-primary/10 relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md">
              {}
              <img
                src={feature.imageUrl}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-8 w-8 object-contain"
              />
            </div>
          )}
          <div>
            <h4 className="text-foreground mb-2 text-lg font-bold">{feature.title}</h4>
            <p className="text-muted-foreground text-sm whitespace-pre-wrap">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
