"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, PencilLine } from "lucide-react";

import { useEvent, useUpdateEvent, EventForm } from "@/features/event";
import { Button } from "@/components/ui/button";
import { StateScreen } from "@/shared/components/StateScreen";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const locale = useLocale();

  const { data, isLoading, error } = useEvent(id);
  const updateEvent = useUpdateEvent();

  const handleSubmit = async (formData: any) => {
    await updateEvent.mutateAsync({ id, data: formData });
    router.push(`/${locale}/admin/events`);
  };

  if (isLoading) {
    return <StateScreen state="loading" title="Loading event editor..." compact />;
  }

  if (error || !data?.data) {
    return <StateScreen state="notFound" title="Event record not found" compact />;
  }

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={PencilLine}
        eyebrow={<I18n>Edit Record</I18n>}
        title={<I18n>Edit Event</I18n>}
        description={
          <I18n>Refine event details, schedule, and registration options in one editor.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/events`}>
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
      <EventForm
        initialData={data.data}
        onSubmit={handleSubmit}
        isSubmitting={updateEvent.isPending}
      />
    </div>
  );
}
