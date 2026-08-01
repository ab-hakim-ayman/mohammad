"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Wrench } from "lucide-react";

import { useCreateService, ServiceForm } from "@/features/service";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateServicePage() {
  const router = useRouter();
  const locale = useLocale();
  const createService = useCreateService();

  const handleSubmit = async (data: any) => {
    await createService.mutateAsync(data);
    router.push(`/${locale}/admin/services`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Wrench}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Service</I18n>}
        description={
          <I18n>Add a service card with the same polished admin shell used elsewhere.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/services`}>
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
      <ServiceForm onSubmit={handleSubmit} isSubmitting={createService.isPending} />
    </div>
  );
}
