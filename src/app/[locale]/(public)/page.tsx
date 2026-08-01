import { AboutPreviewSection } from "@/features/about/server";
import { AchievementPreviewSection } from "@/features/achievement";
import { BlogPreviewSection } from "@/features/blog";
import { CaseStudyPreviewSection } from "@/features/case-study";
import { ClientPreviewSection } from "@/features/client";
import { ContactPreviewSection } from "@/features/contact";
import { EventPreviewSection } from "@/features/event";
import { FaqPreviewSection } from "@/features/faq";
import { GalleryPreviewSection } from "@/features/gallery";
import { HeroPreviewSection } from "@/features/hero";
import { PartnerPreviewSection } from "@/features/partner";
import { ProjectPreviewSection } from "@/features/project";
import { ServicePreviewSection } from "@/features/service";
import { SkillPreviewSection } from "@/features/skill";
import { SpecializationPreviewSection } from "@/features/specialization";
import { TechnologyPreviewSection } from "@/features/technology";
import { TestimonialPreviewSection } from "@/features/testimonial";

export default async function HomePage() {
  return (
    <>
      <HeroPreviewSection />
      <AboutPreviewSection />
      <ServicePreviewSection />
      <ProjectPreviewSection />
      <CaseStudyPreviewSection />

      <TestimonialPreviewSection />
      <ClientPreviewSection />
      <PartnerPreviewSection />

      <SpecializationPreviewSection />
      <TechnologyPreviewSection />
      <SkillPreviewSection />
      <BlogPreviewSection />
      <EventPreviewSection />
      <AchievementPreviewSection />
      <GalleryPreviewSection />

      <FaqPreviewSection />
      <ContactPreviewSection />
    </>
  );
}
