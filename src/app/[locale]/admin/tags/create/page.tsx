"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Tags } from "lucide-react";

import { useCreateTag, TagForm } from "@/features/tag";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateTagPage() {
  const router = useRouter();
  const locale = useLocale();
  const createTag = useCreateTag();

  const handleSubmit = async (data: any) => {
    await createTag.mutateAsync(data);
    router.push(`/${locale}/admin/tags`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Tags}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Tag</I18n>}
        description={
          <I18n>Add discoverability labels inside the same polished admin editing flow.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/tags`}>
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
      <TagForm onSubmit={handleSubmit} isSubmitting={createTag.isPending} />
    </div>
  );
}
