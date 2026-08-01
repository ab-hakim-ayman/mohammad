import React from "react";
import { Briefcase } from "lucide-react";
import { CardEngine } from "@/shared/components/cards/CardEngine";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  profile: {
    id: string;
    fullName?: string | null;
    bio?: string | null;
    designation?: string | null;
    headline?: string | null;
    experienceYears?: number | null;
    avatar?: string | null;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
  variant?: any;
}

export function ProfileCard({ profile, className, size = "md", layout }: ProfileCardProps) {
  return (
    <CardEngine
      data={profile}
      size={size}
      layout={layout}
      mediaPosition="top"
      imageBleed="edge-to-edge"
      shadow="md"
      className={cn("border border-border/80 hover:border-primary/50 transition-all", className)}
      config={{
        titleKey: "fullName",
        descriptionKey: "bio",
        imageKey: "avatar",
        href: (item) => `/profiles/${item.id}`,
        actionLabel: "View profile",
        getMetaItems: (item) => [
          ...(item.designation || item.headline
            ? [
                {
                  icon: <Briefcase className="h-3.5 w-3.5" />,
                  text: item.designation || item.headline || "",
                },
              ]
            : []),
        ],
        getBadges: (item) =>
          item.experienceYears != null ? [{ label: `${item.experienceYears} yrs` }] : [],
      }}
    />
  );
}
