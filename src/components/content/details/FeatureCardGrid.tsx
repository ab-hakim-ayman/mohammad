import { LucideIcon, Target } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
}

interface FeatureCardGridProps {
  items: FeatureCardProps[];
}

export function FeatureCardGrid({ items }: FeatureCardGridProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-5 5xl:grid-cols-8">
      {items.map((item, index) => (
        <div
          key={index}
          className="group border-border bg-card shadow-soft sm:p-8ui-card-hover flex flex-col rounded-none sm:rounded-lg border p-6"
        >
          <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
            {}
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-foreground text-xl font-semibold tracking-tight">{item.title}</h3>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
