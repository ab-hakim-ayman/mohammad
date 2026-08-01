"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { FolderTree, Plus, Trash2 } from "lucide-react";

import {
  useCategories,
  useDeleteCategory,
  useCategoryStore,
  categoryTableColumns,
} from "@/features/category";
import { StateScreen } from "@/shared/components/StateScreen";
import { DataTableEngine } from "@/shared/components/tables/DataTableEngine";
import { DataTableFilterConfig } from "@/shared/components/tables/data-table-engine.types";
import { Button } from "@/components/ui/button";
import I18n from "@/shared/components/I18n";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";

export default function CategoriesPage() {
  const router = useRouter();
  const locale = useLocale();
  const page = useCategoryStore((state) => state.page);
  const setPage = useCategoryStore((state) => state.setPage);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const statusFilter = filterValues["status"] === "All" ? undefined : (filterValues["status"] as any);
  const scopeFilter = filterValues["scope"] === "All" ? undefined : (filterValues["scope"] as any);

  const { data, isLoading, error } = useCategories({
    page,
    limit: 10,
    search: searchQuery.trim() !== "" ? searchQuery : undefined,
    status: statusFilter,
    scope: scopeFilter,
  });

  const deleteCategory = useDeleteCategory();

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this category?")) await deleteCategory.mutateAsync(id);
  };

  if (error) {
    return <StateScreen state="error" title="Unable to load categories" compact />;
  }

  const categories = data?.data?.data || [];
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
      key: "scope",
      placeholder: "Scope",
      options: [
        { label: "Blog", value: "BLOG" },
        { label: "Project", value: "PROJECT" },
        { label: "Service", value: "SERVICE" },
        { label: "Case Study", value: "CASE_STUDY" },
        { label: "Technology", value: "TECHNOLOGY" },
        { label: "Skill", value: "SKILL" },
        { label: "FAQ", value: "FAQ" },
      ],
    },
  ];

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={FolderTree}
        title={<I18n>Categories</I18n>}
        description={<I18n>Manage taxonomy and organize your content logically.</I18n>}
        actions={
          <Link href={`/${locale}/admin/categories/create`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/10 ui-card-hover h-11 rounded-xl px-5 font-semibold shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              <I18n>Create New</I18n>
            </Button>
          </Link>
        }
      />

      <DataTableEngine
        columns={categoryTableColumns}
        data={categories}
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
        onView={(item) => router.push(`/${locale}/admin/categories/${item.id}`)}
        onEdit={(item) => router.push(`/${locale}/admin/categories/${item.id}/edit`)}
        onDelete={(item) => handleDelete(item.id)}
        bulkActions={[
          {
            label: "Delete Selected",
            variant: "destructive",
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: async (selected) => {
              if (confirm(`Delete ${selected.length} selected categories?`)) {
                await Promise.all(selected.map((item) => deleteCategory.mutateAsync(item.id)));
              }
            },
          },
        ]}
      />
    </div>
  );
}
