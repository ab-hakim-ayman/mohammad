"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { MessageSquare, Trash2 } from "lucide-react";

import {
  useContacts,
  useDeleteContact,
  useUpdateContact,
  useContactStore,
  contactTableColumns,
} from "@/features/contact";
import { StateScreen } from "@/shared/components";
import { DataTableEngine } from "@/shared/components/tables/DataTableEngine";
import { DataTableFilterConfig } from "@/shared/components/tables/data-table-engine.types";
import I18n from "@/shared/components/I18n";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";

export default function AdminContactsPage() {
  const router = useRouter();
  const locale = useLocale();
  const page = useContactStore((state) => state.page);
  const setPage = useContactStore((state) => state.setPage);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const statusFilter = filterValues["status"] === "All" ? undefined : (filterValues["status"] as any);

  const { data, isLoading, error } = useContacts({
    page,
    limit: 10,
    sort: "createdAt_desc",
    search: searchQuery.trim() !== "" ? searchQuery : undefined,
    status: statusFilter,
  });

  const deleteMutation = useDeleteContact();
  const updateMutation = useUpdateContact();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this contact?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (error) return <StateScreen state="error" title="Error loading contacts" />;

  const contacts = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const filters: DataTableFilterConfig[] = [
    {
      key: "status",
      placeholder: "Status",
      options: [
        { label: "New", value: "NEW" },
        { label: "Read", value: "READ" },
        { label: "Replied", value: "REPLIED" },
        { label: "Archived", value: "ARCHIVED" },
      ],
    },
  ];

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={MessageSquare}
        title={<I18n>Contacts</I18n>}
        description={<I18n>Manage incoming inquiries and communications.</I18n>}
        actions={<></>}
      />

      <DataTableEngine
        columns={contactTableColumns}
        data={contacts}
        searchKey="email"
        searchPlaceholder="Search by email..."
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
        onView={(item) => router.push(`/${locale}/admin/contacts/${item.id}`)}
        onEdit={(item) =>
          updateMutation.mutateAsync({
            id: item.id,
            data: { status: item.status === "NEW" ? "READ" : "NEW" },
          })
        }
        onDelete={(item) => handleDelete(item.id)}
        bulkActions={[
          {
            label: "Delete Selected",
            variant: "destructive",
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: async (selected) => {
              if (confirm(`Delete ${selected.length} selected contacts?`)) {
                await Promise.all(selected.map((item) => deleteMutation.mutateAsync(item.id)));
              }
            },
          },
        ]}
      />
    </div>
  );
}
