import React from "react";
import { ImageIcon, PlayCircle, FileText } from "lucide-react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  media: {
    id: string;
    resourceType: string;
    provider: string;
    url: string;
    originalFilename?: string | null;
    altText?: string | null;
    folder?: string | null;
    createdAt: Date | string;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function MediaCard({ media, className, size = "md", layout }: MediaCardProps) {
  return (
    <CardEngine
      data={media}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        titleKey: "originalFilename",
        descriptionKey: "altText",
        imageKey: "url",
        href: (item) => `/media/${item.id}`,
        actionLabel: "View details",
        getMetaItems: (item) => [
          {
            icon:
              item.resourceType === "IMAGE" ? (
                <ImageIcon className="h-3.5 w-3.5" />
              ) : item.resourceType === "VIDEO" ? (
                <PlayCircle className="h-3.5 w-3.5" />
              ) : (
                <FileText className="h-3.5 w-3.5" />
              ),
            text: `${item.resourceType} · ${item.provider}`,
          },
          {
            icon: <FileText className="h-3.5 w-3.5" />,
            text: item.folder || "root",
          },
          {
            icon: <FileText className="h-3.5 w-3.5" />,
            text: new Date(item.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric"
            }),
          },
        ],
      }}
    />
  );
}
