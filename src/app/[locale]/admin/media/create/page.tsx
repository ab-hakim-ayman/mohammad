"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, UploadCloud } from "lucide-react";

import { useUploadMedia, MediaForm } from "@/features/media";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateMediaPage() {
  const router = useRouter();
  const locale = useLocale();
  const uploadMedia = useUploadMedia();

  const handleSubmit = async (input: any) => {
    await uploadMedia.mutateAsync(input);
    router.push(`/${locale}/admin/media`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={UploadCloud}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Upload Media</I18n>}
        description={<I18n>Upload images and files to the media library.</I18n>}
        actions={
          <Link href={`/${locale}/admin/media`}>
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
      <MediaForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={uploadMedia.isPending}
      />
    </div>
  );
}

