interface MetricProps {
  value: string;
  label: string;
  description?: string;
}

interface MetricGridProps {
  metrics: MetricProps[];
}

export function MetricGrid({ metrics }: MetricGridProps) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-5 5xl:grid-cols-8">
      {metrics.map((metric, index) => (
        <div key={index} className="border-border bg-card shadow-soft rounded-none sm:rounded-lg border p-6 sm:p-8">
          <div className="text-primary text-4xl font-semibold tracking-tighter sm:text-5xl">
            {metric.value}
          </div>
          <h4 className="text-foreground mt-4 text-lg font-semibold">{metric.label}</h4>
          {metric.description && (
            <p className="text-muted-foreground mt-2 text-sm">{metric.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
