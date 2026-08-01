"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Plus, Trash2, Wrench } from "lucide-react";

import {
  useDeleteService,
  useServices,
  useServiceStore,
  serviceTableColumns,
} from "@/features/service";
import { StateScreen } from "@/shared/components/StateScreen";
import { DataTableEngine } from "@/shared/components/tables/DataTableEngine";
import { DataTableFilterConfig } from "@/shared/components/tables/data-table-engine.types";
import { Button } from "@/components/ui/button";
import I18n from "@/shared/components/I18n";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";

export default function AdminServicesPage() {
  const router = useRouter();
  const locale = useLocale();
  const page = useServiceStore((state) => state.page);
  const setPage = useServiceStore((state) => state.setPage);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const statusFilter = filterValues["status"] === "All" ? undefined : (filterValues["status"] as any);
  const rawFeatured = filterValues["isFeatured"];
  const featuredFilter =
    rawFeatured === "true" ? true :
      rawFeatured === "false" ? false :
        undefined;

  const { data, isLoading, error } = useServices({
    page,
    limit: 10,
    search: searchQuery.trim() !== "" ? searchQuery : undefined,
    status: statusFilter,
    isFeatured: featuredFilter,
  });

  const deleteService = useDeleteService();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will permanently delete this service.")) {
      await deleteService.mutateAsync(id);
    }
  };

  if (error) {
    return <StateScreen state="error" title="Unable to load services" compact />;
  }

  const services = data?.data?.data || [];
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
      key: "isFeatured",
      placeholder: "Featured",
      options: [
        { label: "Featured", value: "true" },
        { label: "Not Featured", value: "false" },
      ],
    },
  ];

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Wrench}
        title={<I18n>Services</I18n>}
        description={
          <I18n>
            Manage packaged services, visibility, and display order from one consistent workspace.
          </I18n>
        }
        actions={
          <Link href={`/${locale}/admin/services/create`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/10 ui-card-hover h-11 rounded-xl px-5 font-semibold shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              <I18n>Create New</I18n>
            </Button>
          </Link>
        }
      />

      <DataTableEngine
        columns={serviceTableColumns}
        data={services}
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
        onView={(item) => router.push(`/${locale}/admin/services/${item.id}`)}
        onEdit={(item) => router.push(`/${locale}/admin/services/${item.id}/edit`)}
        onDelete={(item) => handleDelete(item.id)}
        bulkActions={[
          {
            label: "Delete Selected",
            variant: "destructive",
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: async (selected) => {
              if (confirm(`Delete ${selected.length} selected services?`)) {
                await Promise.all(selected.map((item) => deleteService.mutateAsync(item.id)));
              }
            },
          },
        ]}
      />
    </div>
  );
}
