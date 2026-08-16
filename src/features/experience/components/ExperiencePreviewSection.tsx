"use client";

import { useMemo } from "react";
import { usePublishedExperiences } from "@/features/experience/hooks/useExperience";
import { Experience } from "@/features/experience/types/experience.types";
import { Briefcase } from "lucide-react";
import I18n from "@/shared/components/I18n";
import { useLocale } from "next-intl";

import { ContentRenderer } from "@/components/content/ContentRenderer";

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

export function ExperiencePreviewSection() {
    const locale = useLocale();
    const { data: expData } = usePublishedExperiences();

    const experiences = useMemo<Experience[]>(() => {
        if (!expData) return [];
        if (Array.isArray(expData)) return expData;
        return (expData as any).data?.data || (expData as any).data || [];
    }, [expData]);

    return (
        <div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-8">
                <Briefcase className="h-4 w-4 text-primary" />
                <span><I18n>Work Experience</I18n></span>
            </div>

            <div className="relative pl-6 sm:pl-8 ml-2">
                <div className="absolute left-[7px] sm:left-[9px] top-2 bottom-2 w-0.5 bg-border" />

                <div className="space-y-12">
                    {experiences.map((exp) => {
                        const startStr = formatDate(exp.startDate, locale);
                        const endStr = exp.isCurrent ? "Present" : formatDate(exp.endDate, locale);
                        const highlights: string[] = (exp.contentJson as any)?.highlights || [];

                        return (
                            <div key={exp.id} className="relative">
                                <div className="absolute -left-[25px] sm:-left-[29px] top-1.5 w-3.5 h-3.5 rounded-full bg-background border-2 border-primary z-10" />

                                <span className="text-xs text-muted-foreground font-mono">
                                    {startStr} {endStr ? `— ${endStr}` : ""}
                                </span>

                                <h3 className="text-xl font-semibold text-foreground mt-1">
                                    {exp.position}
                                </h3>
                                <p className="text-primary font-medium text-sm mb-3">{exp.companyName}</p>

                                {exp.shortDesc && (
                                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                        {exp.shortDesc}
                                    </p>
                                )}

                                {exp.contentJson && (
                                    <div className="mt-3 text-sm text-muted-foreground">
                                        <ContentRenderer content={exp.contentJson} variant="career" />
                                    </div>
                                )}

                                {(!exp.contentJson || !(exp.contentJson as any)?.blocks) && highlights.length > 0 && (
                                    <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground mt-2">
                                        {highlights.map((item, idx) => (
                                            <li key={idx} className="leading-relaxed">{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}