"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { CalendarDays, Plus, Trash2 } from "lucide-react";

import { useDeleteEvent, useEvents, useEventStore, eventTableColumns } from "@/features/event";
import { StateScreen } from "@/shared/components/StateScreen";
import { DataTableEngine } from "@/shared/components/tables/DataTableEngine";
import { DataTableFilterConfig } from "@/shared/components/tables/data-table-engine.types";
import { Button } from "@/components/ui/button";
import I18n from "@/shared/components/I18n";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";

export default function AdminEventsPage() {
  const router = useRouter();
  const locale = useLocale();
  const page = useEventStore((state) => state.page);
  const setPage = useEventStore((state) => state.setPage);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const statusFilter = filterValues["status"] === "All" ? undefined : (filterValues["status"] as any);
  const formatFilter = filterValues["format"] === "All" ? undefined : (filterValues["format"] as any);
  const rawFeatured = filterValues["isFeatured"];
  const featuredFilter =
    rawFeatured === "true" ? true :
      rawFeatured === "false" ? false :
        undefined;
  const rawFree = filterValues["isFree"];
  const freeFilter =
    rawFree === "true" ? true :
      rawFree === "false" ? false :
        undefined;

  const { data, isLoading, error } = useEvents({
    page,
    limit: 10,
    search: searchQuery.trim() !== "" ? searchQuery : undefined,
    status: statusFilter,
    format: formatFilter,
    isFeatured: featuredFilter,
    isFree: freeFilter,
  });

  const deleteEvent = useDeleteEvent();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will permanently delete this event.")) {
      await deleteEvent.mutateAsync(id);
    }
  };

  if (error) {
    return <StateScreen state="error" title="Unable to load events" compact />;
  }

  const events = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const filters: DataTableFilterConfig[] = [
    {
      key: "status",
      placeholder: "Status",
      options: [
        { label: "Draft", value: "DRAFT" },
        { label: "Published", value: "PUBLISHED" },
        { label: "Archived", value: "ARCHIVED" },
      ],
    },
    {
      key: "format",
      placeholder: "Format",
      options: [
        { label: "Online", value: "ONLINE" },
        { label: "Offline", value: "OFFLINE" },
        { label: "Hybrid", value: "HYBRID" },
      ],
    },
    {
      key: "isFeatured",
      placeholder: "Featured",
      options: [
        { label: "Featured", value: "true" },
        { label: "Not Featured", value: "false" },
      ],
    },
    {
      key: "isFree",
      placeholder: "Pricing",
      options: [
        { label: "Free", value: "true" },
        { label: "Paid", value: "false" },
      ],
    },
  ];

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={CalendarDays}
        title={<I18n>Events</I18n>}
        description={
          <I18n>Manage launch events, workshops, and upcoming community activities.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/events/create`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/10 ui-card-hover h-11 rounded-xl px-5 font-semibold shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              <I18n>Create New</I18n>
            </Button>
          </Link>
        }
      />

      <DataTableEngine
        columns={eventTableColumns}
        data={events}
        searchKey="title"
        searchPlaceholder="Search by title..."
        searchValue={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setPage(1);
        }}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={(newVals) => {
          setFilterValues(newVals);
          setPage(1);
        }}
        isLoading={isLoading}
        pageCount={pagination?.totalPages || 1}
        currentPage={page}
        onPageChange={setPage}
        onView={(item) => router.push(`/${locale}/admin/events/${item.id}`)}
        onEdit={(item) => router.push(`/${locale}/admin/events/${item.id}/edit`)}
        onDelete={(item) => handleDelete(item.id)}
        bulkActions={[
          {
            label: "Delete Selected",
            variant: "destructive",
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: async (selected) => {
              if (confirm(`Delete ${selected.length} selected events?`)) {
                await Promise.all(selected.map((item) => deleteEvent.mutateAsync(item.id)));
              }
            },
          },
        ]}
      />
    </div>
  );
}
