"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Award, Plus, Trash2 } from "lucide-react";

import {
  useAchievements,
  useDeleteAchievement,
  useAchievementStore,
  achievementTableColumns,
} from "@/features/achievement";
import { StateScreen } from "@/shared/components/StateScreen";
import { DataTableEngine } from "@/shared/components/tables/DataTableEngine";
import { DataTableFilterConfig } from "@/shared/components/tables/data-table-engine.types";
import { Button } from "@/components/ui/button";
import I18n from "@/shared/components/I18n";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";

export default function AdminAchievementsPage() {
  const router = useRouter();
  const locale = useLocale();
  const page = useAchievementStore((state) => state.page);
  const setPage = useAchievementStore((state) => state.setPage);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const statusFilter = filterValues["status"] === "All" ? undefined : (filterValues["status"] as any);
  const typeFilter = filterValues["type"] === "All" ? undefined : filterValues["type"];
  const isFeaturedFilter = filterValues["isFeatured"] === "All" ? undefined : filterValues["isFeatured"];

  const { data, isLoading, error } = useAchievements({
    page,
    limit: 10,
    search: searchQuery.trim() !== "" ? searchQuery : undefined,
    status: statusFilter,
    type: typeFilter,
    isFeatured: isFeaturedFilter === "true" ? true : isFeaturedFilter === "false" ? false : undefined,
  });
  const deleteAchievement = useDeleteAchievement();

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this achievement?")) await deleteAchievement.mutateAsync(id);
  };

  if (error) {
    return <StateScreen state="error" title="Unable to load achievements" compact />;
  }

  const achievements = data?.data?.data || [];
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
      key: "type",
      placeholder: "Type",
      options: [
        { label: "Award", value: "AWARD" },
        { label: "Certification", value: "CERTIFICATION" },
        { label: "Recognition", value: "RECOGNITION" },
        { label: "Milestone", value: "MILESTONE" },
        { label: "Other", value: "OTHER" },
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
        icon={Award}
        title={<I18n>Achievements</I18n>}
        description={
          <I18n>Track awards, milestones, and recognition that support the brand story.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/achievements/create`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/10 ui-card-hover h-11 rounded-xl px-5 font-semibold shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              <I18n>Create New</I18n>
            </Button>
          </Link>
        }
      />

      <DataTableEngine
        columns={achievementTableColumns}
        data={achievements}
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
        onView={(item) => router.push(`/${locale}/admin/achievements/${item.id}`)}
        onEdit={(item) => router.push(`/${locale}/admin/achievements/${item.id}/edit`)}
        onDelete={(item) => handleDelete(item.id)}
        bulkActions={[
          {
            label: "Delete Selected",
            variant: "destructive",
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: async (selected) => {
              if (confirm(`Delete ${selected.length} selected achievements?`)) {
                await Promise.all(selected.map((item) => deleteAchievement.mutateAsync(item.id)));
              }
            },
          },
        ]}
      />
    </div>
  );
}
