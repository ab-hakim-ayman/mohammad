"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Factory } from "lucide-react";

import { useCreateIndustry, IndustryForm } from "@/features/industry";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateIndustryPage() {
  const router = useRouter();
  const locale = useLocale();
  const createIndustry = useCreateIndustry();

  const handleSubmit = async (data: any) => {
    await createIndustry.mutateAsync(data);
    router.push(`/${locale}/admin/industries`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Factory}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Industry</I18n>}
        description={<I18n>Set up a new industry sector record.</I18n>}
        actions={
          <Link href={`/${locale}/admin/industries`}>
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
      <IndustryForm onSubmit={handleSubmit} isSubmitting={createIndustry.isPending} />
    </div>
  );
}
