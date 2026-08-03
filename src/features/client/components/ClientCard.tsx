import React from "react";
import { Globe } from "lucide-react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface ClientCardProps {
  client: {
    id: string;
    title: string;
    logo?: string | null;
    website?: string | null;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function ClientCard({ client, className, size = "md", layout }: ClientCardProps) {
  return (
    <CardEngine
      data={client}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      alignment="center"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        href: (item) => `/clients/${item.id}`,
        titleKey: "title",
        logoKey: "logo",
      }}
    />
  );
}
