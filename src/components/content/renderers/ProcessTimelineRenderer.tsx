import React from "react";

export function ProcessTimelineRenderer({ block }: { block: any }) {
  let steps: any[] = [];
  try {
    steps = JSON.parse(block.props.stepsJson);
  } catch {
    return null;
  }
  if (!steps.length) return null;

  return (
    <div className="not-prose bg-card border-border my-8 space-y-6 rounded-none sm:rounded-lg border p-6 shadow-xs transition-all duration-300 hover:shadow-md 3xl:my-10 5xl:my-12 3xl:p-8 5xl:p-10 md:p-8">
      {steps.map((step, idx) => (
        <div key={idx} className="flex gap-4">
          <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold shadow-xs">
            {idx + 1}
          </div>
          <div className="border-border flex-1 space-y-2 border-b pt-2 pb-6 last:border-0 last:pb-0">
            <h4 className="text-foreground text-lg font-bold">{step.title}</h4>
            <p className="text-muted-foreground whitespace-pre-wrap">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
