"use client";

import { Button } from "@/components/ui/button";
import { useContact, useDeleteContact, useUpdateContact } from "@/features/contact";
import { StateScreen } from "@/shared/components";
import I18n from "@/shared/components/I18n";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";
import { useRouter } from "next/navigation";
import { CheckCircle2, Mail, MailOpen } from "lucide-react";
import { useParams } from "next/navigation";

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isPending, error } = useContact(id);
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading contact details" compact />;
  if (error || !data?.data)
    return <StateScreen state={error ? "error" : "notFound"} title="Contact not found" compact />;

  const contact = data.data;

  const handleMarkRead = async () => {
    await updateContact.mutateAsync({ id, data: { status: "READ" } });
  };
  const handleMarkReplied = async () => {
    await updateContact.mutateAsync({ id, data: { status: "REPLIED" } });
  };
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this message?")) {
      await deleteContact.mutateAsync(id);
      router.push("/admin/contacts");
    }
  };

  const config: DetailEngineConfig<typeof contact> = {
    titleKey: "name",
    subtitleKey: "subject",
    statusKey: "status",
    headerIcon: Mail,
    eyebrow: "Contact Inquiry",
    actions: {
      backHref: "/admin/contacts",
      onDelete: handleDelete,
      isDeleting: deleteContact.isPending,
    },
    mainSections: [
      {
        title: "Message Details",
        fields: [
          { label: "Email", key: "email", type: "text", gridSpan: 6 },
          {
            label: "Phone",
            key: "phone",
            type: "text",
            gridSpan: 6,
            render: (rec) => rec.phone || "—",
          },
          { label: "Subject", key: "subject", type: "text", gridSpan: 12 },
          {
            label: "Message Content",
            key: "message",
            type: "custom",
            gridSpan: 12,
            render: (rec) => (
              <div className="bg-background/30 border-border rounded-xl border p-4 text-sm leading-relaxed whitespace-pre-wrap">
                {rec.message}
              </div>
            ),
          },
        ],
      },
      {
        title: "Inquiry Actions",
        fields: [
          {
            label: "Update Status",
            key: "status",
            type: "custom",
            gridSpan: 12,
            render: (rec) => (
              <div className="flex flex-wrap items-center gap-3">
                {rec.status === "NEW" && (
                  <Button
                    onClick={handleMarkRead}
                    className="h-10 rounded-xl"
                    disabled={updateContact.isPending}
                  >
                    <MailOpen className="mr-2 h-4 w-4" />
                    <I18n>Mark as Read</I18n>
                  </Button>
                )}
                {rec.status !== "REPLIED" && (
                  <Button
                    onClick={handleMarkReplied}
                    className="h-10 rounded-xl"
                    variant="secondary"
                    disabled={updateContact.isPending}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <I18n>Mark as Replied</I18n>
                  </Button>
                )}
              </div>
            ),
          },
        ],
      },
    ],
    sidebarSections: [
      {
        title: "Inquiry Meta",
        fields: [
          { label: "Received At", key: "createdAt", type: "datetime", gridSpan: 12 },
          { label: "Updated At", key: "updatedAt", type: "datetime", gridSpan: 12 },
          { label: "Replied At", key: "repliedAt", type: "datetime", gridSpan: 12 },
          { label: "Archived At", key: "archivedAt", type: "datetime", gridSpan: 12 },
        ],
      },
    ],
    relatedSections: [
      {
        title: "Service",
        hrefPrefix: "services",
        variant: "list",
        getRecords: (rec: any) =>
          rec.service ? [{ id: rec.service.id, title: rec.service.title }] : [],
      },
    ],
  };

  return <DetailEngine data={contact} config={config as any} />;
}
