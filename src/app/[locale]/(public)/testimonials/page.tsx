import { TestimonialSection } from "@/features/testimonial";
import { Metadata } from "next";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-manifest";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What our clients say about us",
};

export default async function PublicTestimonialsPage() {
  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.testimonial} />
      <TestimonialSection />
    </>
  );
}
