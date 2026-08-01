"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Handshake } from "lucide-react";

import { useCreatePartner, PartnerForm } from "@/features/partner";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreatePartnerPage() {
  const router = useRouter();
  const locale = useLocale();
  const createPartner = useCreatePartner();

  const handleSubmit = async (data: any) => {
    await createPartner.mutateAsync(data);
    router.push(`/${locale}/admin/partners`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Handshake}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Partner</I18n>}
        description={<I18n>Add a partner or ecosystem relationship to the admin catalog.</I18n>}
        actions={
          <Link href={`/${locale}/admin/partners`}>
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
      <PartnerForm onSubmit={handleSubmit} isSubmitting={createPartner.isPending} />
    </div>
  );
}
