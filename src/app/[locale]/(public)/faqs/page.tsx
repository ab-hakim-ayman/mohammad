import { faqService } from "@/features/faq/server";
import { FaqSection } from "@/features/faq";
import { FeatureBanner } from "@/shared/components";
import { A2I_BANNER_MANIFEST } from "@/shared/utils/banner-menifest";
import { AlertCircle } from "lucide-react";
import I18n from "@/shared/components/I18n";

export default async function PublicFaqsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  let faqs: any[] = [];
  let error: string | null = null;

  try {
    faqs = await faqService.getPublished(100);
  } catch {
    error = "Error";
  }

  if (error) {
    return (
      <div className="container-custom px-4 py-16">
        <div className="border-destructive/20 bg-destructive/5 flex items-start gap-3.5 rounded-none border p-6 backdrop-blur-xs sm:rounded-xl">
          <AlertCircle className="text-destructive mt-0.5 h-5 w-5 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-destructive text-sm font-bold tracking-tight">
              <I18n>System Dispatch Error</I18n>
            </h4>
            <p className="text-destructive/80 text-xs leading-relaxed font-medium sm:text-sm">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <FeatureBanner {...A2I_BANNER_MANIFEST.faq} />

      <FaqSection
        faqs={faqs.map((faq) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,

          category:
            faq.categories && faq.categories.length > 0 ? faq.categories[0].title : "General",
        }))}
        emptyLabel={"No Faqs"}
        title={"Title"}
        
      />
    </>
  );
}
