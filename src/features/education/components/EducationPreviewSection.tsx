"use client";

import { useMemo } from "react";
import { usePublishedEducations } from "@/features/education/hooks/useEducation";
import { Education } from "@/features/education/types/education.types";
import { GraduationCap } from "lucide-react";
import I18n from "@/shared/components/I18n";

export function EducationPreviewSection() {
    const { data: eduData } = usePublishedEducations();

    const educations = useMemo<Education[]>(() => {
        if (!eduData) return [];
        if (Array.isArray(eduData)) return eduData;
        return (eduData as any).data?.data || (eduData as any).data || [];
    }, [eduData]);

    return (
        <div>
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-4 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span><I18n>Education</I18n></span>
            </h3>

            <div className="space-y-4">
                {educations.map((edu) => {
                    const startYear = edu.startDate ? new Date(edu.startDate).getFullYear() : "";
                    const endYear = edu.isCurrent ? "Present" : edu.endDate ? new Date(edu.endDate).getFullYear() : "";

                    return (
                        <div key={edu.id} className="bg-card border border-border rounded-lg p-4 hover:border-border-strong transition shadow-2xs">
                            <h4 className="text-foreground font-semibold text-sm">
                                {edu.degree} {edu.fieldOfStudy ? `(${edu.fieldOfStudy})` : ""}
                            </h4>
                            <p className="text-primary text-xs mt-1">{edu.institution}</p>
                            <span className="text-muted-foreground text-xs font-mono block mt-2">
                                {startYear} {endYear ? `— ${endYear}` : ""}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}