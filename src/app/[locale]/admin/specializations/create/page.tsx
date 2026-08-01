"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Layers3 } from "lucide-react";

import { useCreateSpecialization, SpecializationForm } from "@/features/specialization";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateSpecializationPage() {
  const router = useRouter();
  const locale = useLocale();
  const createSpecialization = useCreateSpecialization();

  const handleSubmit = async (data: any) => {
    await createSpecialization.mutateAsync(data);
    router.push(`/${locale}/admin/specializations`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Layers3}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Specialization</I18n>}
        description={<I18n>Add a new specialization area with details and metadata.</I18n>}
        actions={
          <Link href={`/${locale}/admin/specializations`}>
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
      <SpecializationForm onSubmit={handleSubmit} isSubmitting={createSpecialization.isPending} />
    </div>
  );
}
