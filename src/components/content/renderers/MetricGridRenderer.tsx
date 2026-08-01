import React from "react";

export function MetricGridRenderer({ block }: { block: any }) {
  let metrics: any[] = [];
  try {
    metrics = JSON.parse(block.props.metricsJson);
  } catch {
    return null;
  }
  if (!metrics.length) return null;

  return (
    <div className="not-prose bg-card border-border my-8 grid gap-4 rounded-none sm:rounded-lg border p-6 shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12 3xl:p-8 5xl:p-10 sm:grid-cols-2 md:grid-cols-4 3xl:grid-cols-5">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          className="border-border bg-muted/20 flex flex-col gap-2 rounded-md border p-6 text-center shadow-xs"
        >
          <div className="text-primary text-4xl font-bold">{metric.value}</div>
          <div className="text-foreground text-base font-semibold">{metric.label}</div>
          {metric.description && (
            <div className="text-muted-foreground text-sm">{metric.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
