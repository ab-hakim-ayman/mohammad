import { AboutPreviewSection } from "@/features/about/server";
import { AchEduExeSection } from "@/features/achievement";
import { BlogPreviewSection } from "@/features/blog";
import { CaseStudyPreviewSection } from "@/features/case-study";
import { ContactPreviewSection } from "@/features/contact";
import { FaqPreviewSection } from "@/features/faq";
import { GalleryPreviewSection } from "@/features/gallery";
import { HeroPreviewSection } from "@/features/hero";
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
      <AchEduExeSection />

      <TestimonialPreviewSection />

      <SpecializationPreviewSection />
      <TechnologyPreviewSection />
      <SkillPreviewSection />
      <BlogPreviewSection />

      <FaqPreviewSection />
      <ContactPreviewSection />
    </>
  );
}
