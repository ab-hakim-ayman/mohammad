"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import type { Specialization } from "../types/specialization.types";

export interface SpecializationContentPayload {
    highlights?: string[];
    skills?: string[];
    relatedProjects?: string[];
}

interface SpecializationItemProps {
    specialization: Specialization;
    className?: string;
}

export function SpecializationItem({
    specialization,
    className,
}: SpecializationItemProps) {
    // 🟢 contentJson থেকে ডেটা সেফলি রিড করা
    const content = (specialization.contentJson || {}) as SpecializationContentPayload;
    const highlights = Array.isArray(content.highlights) ? content.highlights : [];
    const skills = Array.isArray(content.skills) ? content.skills : [];
    const relatedProjects = Array.isArray(content.relatedProjects)
        ? content.relatedProjects
        : [];

    return (
        <AccordionItem
            value={specialization.id}
            className={cn(
                "group/item mb-3.5 overflow-hidden rounded-xl border border-border/80 bg-card/50 transition-all duration-300",
                "hover:border-lime-500/40 hover:bg-card/80",
                "data-[state=open]:border-lime-500/50 data-[state=open]:bg-lime-500/[0.03] data-[state=open]:shadow-xs",
                className
            )}
        >
            {/* 🟢 Trigger (Title + Subtitle) */}
            <AccordionTrigger className="flex w-full cursor-pointer items-center justify-between p-5 text-left transition-colors outline-hidden hover:no-underline [&>svg]:hidden sm:p-6">
                <div className="flex flex-1 flex-col pr-4 text-left">
                    <h3 className="text-base font-bold tracking-tight text-foreground transition-colors duration-200 group-hover/item:text-lime-500 group-data-[state=open]/item:text-lime-500 sm:text-lg">
                        {specialization.title}
                    </h3>

                    {specialization.shortDesc && (
                        <p className="mt-1 text-xs font-normal leading-relaxed text-muted-foreground sm:text-sm">
                            {specialization.shortDesc}
                        </p>
                    )}
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground/60 transition-transform duration-300 group-hover/item:text-foreground group-data-[state=open]/item:rotate-180 group-data-[state=open]/item:text-lime-500">
                    <ChevronDown className="h-4 w-4" />
                </div>
            </AccordionTrigger>

            {/* 🟢 Expanded Content */}
            <AccordionContent className="px-5 pb-6 pt-1 text-xs text-muted-foreground sm:px-6 sm:text-sm">
                <div className="space-y-5 border-t border-border/50 pt-4">
                    {/* Bullet Points */}
                    {highlights.length > 0 && (
                        <ul className="space-y-2.5">
                            {highlights.map((point, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-2.5 text-muted-foreground/90"
                                >
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-500" />
                                    <span className="leading-relaxed">{point}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Skill Pills */}
                    {skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-2">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="rounded-md border border-border/70 bg-muted/40 px-2.5 py-1 text-[11px] font-medium tracking-wide text-foreground/80 transition-colors hover:border-lime-500/40 hover:text-lime-500"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Related Projects / Services */}
                    {(relatedProjects.length > 0 || (specialization.services && specialization.services.length > 0)) && (
                        <div className="text-[11px] font-medium text-muted-foreground/60 sm:text-xs">
                            <span className="text-muted-foreground/80">Related:</span>{" "}
                            {[
                                ...relatedProjects,
                                ...(specialization.services?.map((s) => s.title) || []),
                            ].join(", ")}
                        </div>
                    )}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}