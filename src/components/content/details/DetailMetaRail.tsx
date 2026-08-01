import React from "react";
import { Separator } from "@base-ui/react/separator";

interface MetaItem {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

interface DetailMetaRailProps {
  items: (MetaItem | null | undefined)[];
}

export function DetailMetaRail({ items }: DetailMetaRailProps) {
  const validItems = items.filter((item): item is MetaItem => Boolean(item && item.value));

  if (validItems.length === 0) return null;

  return (
    <section className="border-border bg-muted/30 border-y py-8">
      <div className="container-custom">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6 5xl:grid-cols-8">
          {validItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col gap-1 lg:px-6">
                <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase">
                  {item.icon} {item.label}
                </div>
                <div className="text-foreground mt-2 font-medium">{item.value}</div>
              </div>
              {idx < validItems.length - 1 && (
                <Separator
                  className="bg-border hidden h-auto w-px lg:block"
                  orientation="vertical"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
