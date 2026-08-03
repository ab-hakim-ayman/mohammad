import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface SiteInfoCardProps {
  siteInfo: {
    id: string;
    title: string;
    tagline?: string | null;
    logo?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    updatedAt: Date | string;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function SiteInfoCard({ siteInfo, className, size = "md", layout }: SiteInfoCardProps) {
  return (
    <CardEngine
      data={siteInfo}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        href: (item) => `/site-infos/${item.id}`,
        titleKey: "title",
        descriptionKey: "tagline",
        logoKey: "logo",
        actionLabel: "View details",
        getMetaItems: (item) =>
          [
            item.email
              ? {
                  icon: <Mail className="h-3.5 w-3.5" />,
                  text: item.email,
                }
              : null,
            item.phone
              ? {
                  icon: <Phone className="h-3.5 w-3.5" />,
                  text: item.phone,
                }
              : null,
            item.address
              ? {
                  icon: <MapPin className="h-3.5 w-3.5" />,
                  text: item.address,
                }
              : null,
            {
              icon: <MapPin className="h-3.5 w-3.5" />,
              text: new Date(item.updatedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric"
              }),
            },
          ].filter(Boolean) as any,
      }}
    />
  );
}
