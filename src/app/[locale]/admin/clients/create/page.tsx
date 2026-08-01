"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, ImageIcon } from "lucide-react";

import { useCreateClient, ClientForm } from "@/features/client";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateClientPage() {
  const router = useRouter();
  const locale = useLocale();
  const createClient = useCreateClient();

  const handleSubmit = async (data: any) => {
    await createClient.mutateAsync(data);
    router.push(`/${locale}/admin/clients`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={ImageIcon}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Client</I18n>}
        description={<I18n>Add a new client logo and company link to the showcase.</I18n>}
        actions={
          <Link href={`/${locale}/admin/clients`}>
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
      <ClientForm onSubmit={handleSubmit} isSubmitting={createClient.isPending} />
    </div>
  );
}
