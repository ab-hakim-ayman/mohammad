"use client";

import { ExperiencePreviewSection } from "@/features/experience/components/ExperiencePreviewSection";
import { EducationPreviewSection } from "@/features/education/components/EducationPreviewSection";
import { AchievementPreviewSection } from "@/features/achievement/components/AchievementPreviewSection";
import I18n from "@/shared/components/I18n";

export function AchEduExeSection() {
    return (
        <section className="bg-background py-16 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="container-custom mx-auto w-full">

                {/* Main Section Header */}
                <div className="mb-12 border-b border-border pb-4">
                    <h2 className="text-3xl font-bold text-foreground tracking-tight">
                        <I18n>Career timeline</I18n>
                    </h2>
                </div>

                {/* Two Column Grid Layout: Left (Span 8) & Right (Span 4) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Column: Work Experience Timeline (Span 8) */}
                    <div className="lg:col-span-8">
                        <ExperiencePreviewSection />
                    </div>

                    {/* Right Column: Education & Certifications (Span 4) */}
                    <div className="lg:col-span-4 space-y-10">
                        <EducationPreviewSection />
                        <AchievementPreviewSection />
                    </div>

                </div>
            </div>
        </section>
    );
}