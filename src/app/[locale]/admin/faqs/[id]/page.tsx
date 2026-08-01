"use client";

import { useParams } from "next/navigation";
import { HelpCircle } from "lucide-react";
import { useFaq } from "@/features/faq";
import { StateScreen } from "@/shared/components";
import { DetailEngine } from "@/shared/components/details/DetailEngine";
import { DetailEngineConfig } from "@/shared/components/details/detail-engine.types";

export default function ViewFaqPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isPending, error } = useFaq(id);

  if (isLoading || isPending)
    return <StateScreen state="loading" title="Loading FAQ details" compact />;
  if (error || !data?.data)
    return <StateScreen state={error ? "error" : "notFound"} title="FAQ not found" compact />;

  const faq = data.data;

  const config: DetailEngineConfig<typeof faq> = {
    titleKey: "question",
    statusKey: "status",
    isFeaturedKey: "isFeatured",
    headerIcon: HelpCircle,
    eyebrow: "FAQ Details",
    actions: {
      editHref: `/admin/faqs/${faq.id}/edit`,
      backHref: "/admin/faqs",
    },
    mainSections: [
      {
        title: "Overview",
        fields: [{ label: "Order", key: "order", type: "text", gridSpan: 6 }],
      },
      {
        title: "Q&A Content",
        fields: [
          {
            label: "Question",
            key: "question",
            type: "custom",
            gridSpan: 12,
            render: () => <p className="text-foreground text-base font-semibold">{faq.question}</p>,
          },
          {
            label: "Answer",
            key: "answer",
            type: "custom",
            gridSpan: 12,
            render: () => (
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                {faq.answer}
              </p>
            ),
          },
        ],
      },
    ],
    sidebarSections: [
      {
        title: "Audit Trail",
        fields: [
          { label: "Published At", key: "publishedAt", type: "datetime" },
          { label: "Archived At", key: "archivedAt", type: "datetime" },
          { label: "Created At", key: "createdAt", type: "datetime" },
          { label: "Updated At", key: "updatedAt", type: "datetime" },
          {
            label: "Created By",
            key: "createdBy",
            type: "user",
            render: (rec) =>
              rec.createdBy?.profile?.fullName ||
              rec.createdBy?.name ||
              rec.createdBy?.email ||
              "—",
          },
          {
            label: "Updated By",
            key: "updatedBy",
            type: "user",
            render: (rec) =>
              rec.updatedBy?.profile?.fullName ||
              rec.updatedBy?.name ||
              rec.updatedBy?.email ||
              "—",
          },
        ],
      },
    ],
    relatedSections: [
      {
        title: "Categories",
        hrefPrefix: "categories",
        variant: "badges",
        getRecords: (rec) => rec.categories?.map((c: any) => ({ id: c.id, title: c.title })) || [],
      },
      {
        title: "Events",
        hrefPrefix: "events",
        variant: "badges",
        getRecords: (rec) => rec.events?.map((e: any) => ({ id: e.id, title: e.title })) || [],
      },
      {
        title: "Services",
        hrefPrefix: "services",
        variant: "badges",
        getRecords: (rec) => rec.services?.map((s: any) => ({ id: s.id, title: s.title })) || [],
      },
    ],
  };

  return <DetailEngine data={faq} config={config as any} />;
}
