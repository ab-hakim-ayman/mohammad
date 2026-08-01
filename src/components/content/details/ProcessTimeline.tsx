import { Separator } from "@base-ui/react/separator";

interface ProcessTimelineProps {
  steps: {
    step?: string;
    title: string;
    description: string;
  }[];
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="relative mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 5xl:grid-cols-8">
      {steps.map((step, index) => (
        <div key={index} className="relative">
          {}
          {index < steps.length - 1 && (
            <Separator
              className="bg-border absolute top-[28px] left-[28px] hidden h-[2px] w-[calc(100%-12px)] sm:block"
              orientation="horizontal"
            />
          )}

          <div className="border-border bg-card text-foreground relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 text-lg font-bold shadow-xs">
            {step.step || String(index + 1).padStart(2, "0")}
          </div>

          <h3 className="text-foreground mt-6 text-xl font-semibold tracking-tight">
            {step.title}
          </h3>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
