"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { useCreateEvent, EventForm } from "@/features/event";
import { Button } from "@/components/ui/button";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import I18n from "@/shared/components/I18n";

export default function CreateEventPage() {
  const router = useRouter();
  const locale = useLocale();
  const createEvent = useCreateEvent();

  const handleSubmit = async (data: any) => {
    await createEvent.mutateAsync(data);
    router.push(`/${locale}/admin/events`);
  };

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={CalendarDays}
        eyebrow={<I18n>Create Record</I18n>}
        title={<I18n>Create Event</I18n>}
        description={<I18n>Add launches, workshops, and community events to the schedule.</I18n>}
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
      <EventForm onSubmit={handleSubmit} isSubmitting={createEvent.isPending} />
    </div>
  );
}
