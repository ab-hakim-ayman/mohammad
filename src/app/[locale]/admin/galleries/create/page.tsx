"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, Images } from "lucide-react";

import { useCreateGallery, GalleryForm } from "@/features/gallery";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateGalleryPage() {
  const router = useRouter();
  const locale = useLocale();
  const createGallery = useCreateGallery();

  const handleSubmit = async (data: any) => {
    await createGallery.mutateAsync(data);
    router.push(`/${locale}/admin/galleries`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Images}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Gallery</I18n>}
        description={
          <I18n>Build a visual collection and prepare it for the public gallery index.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/galleries`}>
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
      <GalleryForm onSubmit={handleSubmit} isSubmitting={createGallery.isPending} />
    </div>
  );
}
