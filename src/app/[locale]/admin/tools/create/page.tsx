"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Wrench } from "lucide-react";

import { useCreateTool, ToolForm } from "@/features/tool";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateToolPage() {
  const router = useRouter();
  const locale = useLocale();
  const createTool = useCreateTool();

  const handleSubmit = async (data: any) => {
    await createTool.mutateAsync(data);
    router.push(`/${locale}/admin/tools`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Wrench}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Developer Tool</I18n>}
        description={
          <I18n>Configure a client-side execution tool or interactive component engine.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/tools`}>
            <Button
              variant="outline"
              className="border-border bg-card text-foreground ui-card-hover h-10 cursor-pointer rounded-xl px-4 shadow-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <I18n>Back</I18n>
            </Button>
          </Link>
        }
      />
      <ToolForm onSubmit={handleSubmit} isSubmitting={createTool.isPending} />
    </div>
  );
}
