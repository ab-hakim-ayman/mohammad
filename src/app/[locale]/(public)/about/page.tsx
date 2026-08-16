import { AboutSection } from "@/features/about";
import { AchievementPreviewSection } from "@/features/achievement";
import { GalleryPreviewSection } from "@/features/gallery";
import { FaqPreviewSection } from "@/features/faq";

import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-manifest";
import { ScrollReveal } from "@/shared/components/ScrollReveal";
import I18n from "@/shared/components/I18n";

export default function PublicAboutPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <FeatureBanner {...A2I_BANNER_MANIFEST.about} />

      {/* 2. The Mission (About Details) */}
      <section id="our-mission" className="bg-background py-12 sm:py-16 lg:py-20">
        <AboutSection />
      </section>

      {/* Separator */}
      <div className="via-border h-px w-full bg-gradient-to-r from-transparent to-transparent opacity-50"></div>

      {/* 3. Scale & Impact (Achievements) */}
      <section className="bg-muted/20 py-10">
        <AchievementPreviewSection />
      </section>



      {/* Separator */}
      <div className="via-border h-px w-full bg-gradient-to-r from-transparent to-transparent opacity-50"></div>

      {/* 6. Company Culture (Galleries) */}
      <section className="bg-background py-24">
        <GalleryPreviewSection />
      </section>

      {/* Separator */}
      <div className="via-border h-px w-full bg-gradient-to-r from-transparent to-transparent opacity-50"></div>

      {/* 7. Support & Knowledge (FAQ) */}
      <section className="bg-muted/20 py-24">
        <FaqPreviewSection />
      </section>


    </div>
  );
}
