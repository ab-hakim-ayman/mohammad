"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Gauge, Plus, Trash2 } from "lucide-react";

import { useDeleteSkill, useSkills, useSkillStore, skillTableColumns } from "@/features/skill";
import { StateScreen } from "@/shared/components/StateScreen";
import { DataTableEngine } from "@/shared/components/tables/DataTableEngine";
import { DataTableFilterConfig } from "@/shared/components/tables/data-table-engine.types";
import { Button } from "@/components/ui/button";
import I18n from "@/shared/components/I18n";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";

export default function SkillsPage() {
  const router = useRouter();
  const locale = useLocale();
  const page = useSkillStore((state) => state.page);
  const setPage = useSkillStore((state) => state.setPage);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const statusFilter = filterValues["status"] === "All" ? undefined : (filterValues["status"] as any);

  const { data, isLoading, error } = useSkills({
    page,
    limit: 10,
    search: searchQuery.trim() !== "" ? searchQuery : undefined,
    status: statusFilter,
  });

  const deleteSkill = useDeleteSkill();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will permanently delete this skill.")) {
      await deleteSkill.mutateAsync(id);
    }
  };

  if (error) {
    return <StateScreen state="error" title="Unable to load skills" compact />;
  }

  const skills = data?.data?.data || [];
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
  ];

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Gauge}
        title={<I18n>Skills</I18n>}
        description={<I18n>Manage technical capabilities, ordering, and publishing state.</I18n>}
        actions={
          <Link href={`/${locale}/admin/skills/create`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/10 ui-card-hover h-11 rounded-xl px-5 font-semibold shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              <I18n>Create New</I18n>
            </Button>
          </Link>
        }
      />

      <DataTableEngine
        columns={skillTableColumns}
        data={skills}
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
        onView={(item) => router.push(`/${locale}/admin/skills/${item.id}`)}
        onEdit={(item) => router.push(`/${locale}/admin/skills/${item.id}/edit`)}
        onDelete={(item) => handleDelete(item.id)}
        bulkActions={[
          {
            label: "Delete Selected",
            variant: "destructive",
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: async (selected) => {
              if (confirm(`Delete ${selected.length} selected skills?`)) {
                await Promise.all(selected.map((item) => deleteSkill.mutateAsync(item.id)));
              }
            },
          },
        ]}
      />
    </div>
  );
}
