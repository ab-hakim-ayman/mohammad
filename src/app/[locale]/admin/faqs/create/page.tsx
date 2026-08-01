"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, HelpCircle } from "lucide-react";

import { useCreateFaq, FaqForm } from "@/features/faq";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateFaqPage() {
  const router = useRouter();
  const locale = useLocale();
  const createFaq = useCreateFaq();

  const handleSubmit = async (data: any) => {
    await createFaq.mutateAsync(data);
    router.push(`/${locale}/admin/faqs`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={HelpCircle}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create FAQ</I18n>}
        description={<I18n>Add a frequently asked question and its answer.</I18n>}
        actions={
          <Link href={`/${locale}/admin/faqs`}>
            <Button
              variant="outline"
              className="border-border bg-surface-elevated text-foreground ui-card-hover h-10 cursor-pointer rounded-xl px-4 shadow-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <I18n>Back</I18n>
            </Button>
          </Link>
        }
      />
      <FaqForm onSubmit={handleSubmit} isSubmitting={createFaq.isPending} />
    </div>
  );
}
