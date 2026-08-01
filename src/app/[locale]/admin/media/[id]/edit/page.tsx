"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, ImageIcon } from "lucide-react";

import { useMediaItem, useUpdateMedia, MediaForm } from "@/features/media";
import { Button } from "@/components/ui/button";
import { StateScreen } from "@/shared/components/StateScreen";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function EditMediaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const locale = useLocale();

  const { data: media, isLoading, error } = useMediaItem(id);
  const updateMedia = useUpdateMedia();

  const handleSubmit = async (formData: any) => {
    await updateMedia.mutateAsync({ id, data: formData });
    router.push(`/${locale}/admin/media`);
  };

  if (isLoading) {
    return <StateScreen state="loading" title="Loading media editor..." compact />;
  }

  if (error || !media) {
    return (
      <StateScreen
        state={error ? "error" : "notFound"}
        title={error ? "Failed to load media" : "Media not found"}
        compact
      />
    );
  }

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={ImageIcon}
        eyebrow={<I18n>Edit Record</I18n>}
        title={<I18n>Edit Media File</I18n>}
        description={<I18n>Update the media file details and metadata.</I18n>}
        actions={
          <Link href={`/${locale}/admin/media/${id}`}>
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
        initialData={media}
        onSubmit={handleSubmit}
        isSubmitting={updateMedia.isPending}
        mode="edit"
      />
    </div>
  );

}
