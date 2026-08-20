"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Plus, Trash2, Wrench } from "lucide-react";

import {
  useDeleteTool,
  useTools,
  useToolStore,
  toolTableColumns,
} from "@/features/tool";
import { StateScreen } from "@/shared/components/StateScreen";
import { DataTableEngine } from "@/shared/components/tables/DataTableEngine";
import type { DataTableFilterConfig } from "@/shared/components/tables/data-table-engine.types";
import { Button } from "@/components/ui/button";
import I18n from "@/shared/components/I18n";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";

export default function AdminToolsPage() {
  const router = useRouter();
  const locale = useLocale();
  const page = useToolStore((state) => state.page);
  const setPage = useToolStore((state) => state.setPage);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const statusFilter = filterValues["status"] === "All" ? undefined : (filterValues["status"] as any);
  const categoryFilter = filterValues["category"] === "All" ? undefined : filterValues["category"];
  const engineTypeFilter = filterValues["engineType"] === "All" ? undefined : (filterValues["engineType"] as any);

  const { data, isLoading, error } = useTools({
    page,
    limit: 10,
    search: searchQuery.trim() !== "" ? searchQuery : undefined,
    status: statusFilter,
    category: categoryFilter,
    engineType: engineTypeFilter,
  });

  const deleteTool = useDeleteTool();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this developer tool?")) {
      await deleteTool.mutateAsync(id);
    }
  };

  if (error) {
    return <StateScreen state="error" title="Unable to load developer tools" compact />;
  }

  const tools = (data as any)?.data?.data || (data as any)?.data || [];
  const pagination = (data as any)?.data?.pagination || (data as any)?.pagination;

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
      key: "engineType",
      placeholder: "Engine Mode",
      options: [
        { label: "SCHEMA", value: "SCHEMA" },
        { label: "CUSTOM", value: "CUSTOM" },
      ],
    },
    {
      key: "category",
      placeholder: "Category",
      options: [
        { label: "Developer", value: "DEVELOPER" },
        { label: "Encoding", value: "ENCODING" },
        { label: "Security", value: "SECURITY" },
        { label: "Formatters", value: "FORMATTER" },
        { label: "Generators", value: "GENERATOR" },
        { label: "Converters", value: "CONVERTER" },
        { label: "Utilities", value: "UTILITY" },
      ],
    },
  ];

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Wrench}
        title={<I18n>Developer Tools Management</I18n>}
        description={
          <I18n>
            Manage client-side developer utilities, execution modes, categories, and homepage display settings.
          </I18n>
        }
        actions={
          <Link href={`/${locale}/admin/tools/create`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/10 ui-card-hover h-11 rounded-xl px-5 font-semibold shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              <I18n>Create New Tool</I18n>
            </Button>
          </Link>
        }
      />

      <DataTableEngine
        columns={toolTableColumns}
        data={tools}
        searchKey="title"
        searchPlaceholder="Search by title, category, or key..."
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
        onView={(item) => router.push(`/${locale}/admin/tools/${item.id}`)}
        onEdit={(item) => router.push(`/${locale}/admin/tools/${item.id}/edit`)}
        onDelete={(item) => handleDelete(item.id)}
        bulkActions={[
          {
            label: "Delete Selected",
            variant: "destructive",
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: async (selected) => {
              if (confirm(`Delete ${selected.length} selected tools?`)) {
                await Promise.all(selected.map((item) => deleteTool.mutateAsync(item.id)));
              }
            },
          },
        ]}
      />
    </div>
  );
}
