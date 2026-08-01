"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Briefcase } from "lucide-react";

import { useCreateCaseStudy, CaseStudyForm } from "@/features/case-study";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateCaseStudyPage() {
  const router = useRouter();
  const locale = useLocale();
  const createCaseStudy = useCreateCaseStudy();

  const handleSubmit = async (data: any) => {
    await createCaseStudy.mutateAsync(data);
    router.push(`/${locale}/admin/case-studies`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Briefcase}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Case Study</I18n>}
        description={<I18n>Document a client engagement, outcome, and proof of delivery.</I18n>}
        actions={
          <Link href={`/${locale}/admin/case-studies`}>
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
      <CaseStudyForm onSubmit={handleSubmit} isSubmitting={createCaseStudy.isPending} />
    </div>
  );
}
