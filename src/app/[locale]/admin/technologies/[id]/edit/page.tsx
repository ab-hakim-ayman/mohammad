"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, PencilLine } from "lucide-react";

import { useTechnology, useUpdateTechnology } from "@/features/technology";
import { TechnologyForm } from "@/features/technology/components/TechnologyForm";
import { Button } from "@/components/ui/button";
import { StateScreen } from "@/shared/components/StateScreen";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function EditTechnologyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const locale = useLocale();

  const { data, isLoading, error } = useTechnology(id);
  const updateTechnology = useUpdateTechnology();

  const handleSubmit = async (formData: any) => {
    await updateTechnology.mutateAsync({ id, data: formData });
    router.push(`/${locale}/admin/technologies`);
  };

  if (isLoading) {
    return <StateScreen state="loading" title="Loading technology editor..." compact />;
  }

  if (error || !data?.data) {
    return <StateScreen state="notFound" title="Technology not found" compact />;
  }

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={PencilLine}
        eyebrow={<I18n>Edit Record</I18n>}
        title={<I18n>Edit Technology</I18n>}
        description={
          <I18n>Refine stack metadata while staying inside the same aligned admin editor.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/technologies`}>
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
      <TechnologyForm
        initialData={data.data}
        onSubmit={handleSubmit}
        isSubmitting={updateTechnology.isPending}
      />
    </div>
  );
}
