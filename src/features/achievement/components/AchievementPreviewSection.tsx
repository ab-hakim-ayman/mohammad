"use client";

import { useMemo } from "react";
import { usePublishedAchievements } from "@/features/achievement/hooks/useAchievement";
import { Achievement } from "@/features/achievement/types/achievement.types";
import { Award, Shield, Cloud, Cpu } from "lucide-react";
import I18n from "@/shared/components/I18n";
import { useLocale } from "next-intl";

function formatDate(value: Date | string | null | undefined, locale: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
    }).format(date);
}

function getCategoryIcon(issuerOrCategory: string) {
  const text = issuerOrCategory.toLowerCase();
  if (text.includes("cloud") || text.includes("aws")) return <Cloud className="h-4 w-4 text-primary" />;
  if (text.includes("devops") || text.includes("security")) return <Shield className="h-4 w-4 text-primary" />;
  if (text.includes("ai") || text.includes("automation")) return <Cpu className="h-4 w-4 text-primary" />;
  return <Award className="h-4 w-4 text-primary" />;
}

export function AchievementPreviewSection() {
  const locale = useLocale();
  const { data: achData } = usePublishedAchievements({ limit: 20 });

  const achievements = useMemo<Achievement[]>(() => {
    const list = achData?.data || [];
    return [...list].sort((a, b) => a.order - b.order);
  }, [achData]);

  const groupedAchievements = useMemo(() => {
    const groups: { [key: string]: Achievement[] } = {};
    achievements.forEach((ach) => {
      const category = ach.issuer || "General Certifications";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(ach);
    });
    return groups;
  }, [achievements]);

  return (
    <div>
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-6 flex items-center gap-2">
        <Award className="h-4 w-4 text-primary" />
        <span><I18n>Licenses & Certifications</I18n></span>
      </h3>

      <div className="space-y-8">
        {Object.entries(groupedAchievements).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
              {getCategoryIcon(category)}
              <span>{category}</span>
            </div>

            <div className="space-y-4 pl-1">
              {items.map((ach) => {
                const achievedOn = formatDate(ach.achievedAt, locale);
                const description = (ach as any).shortDesc || (ach as any).description;

                return (
                  <div key={ach.id} className="relative pl-4 border-l-2 border-border hover:border-primary/50 transition">
                    <h4 className="text-foreground text-sm font-semibold">{ach.title}</h4>

                    {description && (
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {description}
                      </p>
                    )}

                    <p className="text-muted-foreground text-xs mt-1.5 flex items-center gap-1.5">
                      {ach.issuer ? <span>{ach.issuer}</span> : null}
                      {ach.issuer && achievedOn ? <span>•</span> : null}
                      {achievedOn ? <span>Achieved • {achievedOn}</span> : null}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}