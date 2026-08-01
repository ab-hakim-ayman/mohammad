import React from "react";
import { Globe } from "lucide-react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface PartnerCardProps {
  partner: {
    id: string;
    title: string;
    shortDesc?: string | null;
    logo?: string | null;
    website?: string | null;
    type: string;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

function normalizeWebsite(url: string | null | undefined) {
  if (!url) return null;
  return url.startsWith("http://") || url.startsWith("https://") ? url : "https://" + url;
}

export function PartnerCard({ partner, className, size = "md", layout }: PartnerCardProps) {
  return (
    <CardEngine
      data={partner}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        href: (item) => `/partners/${item.id}`,
        titleKey: "title",
        descriptionKey: "shortDesc",
        logoKey: "logo",
        actionLabel: "View details",
        getBadges: (item) => [{ label: item.type }],
        getMetaItems: (item) => {
          const website = normalizeWebsite(item.website);
          return website
            ? [
                {
                  icon: <Globe className="h-3.5 w-3.5" />,
                  text: website.replace(/^https?:\/\//, ""),
                },
              ]
            : [];
        },
      }}
    />
  );
}
