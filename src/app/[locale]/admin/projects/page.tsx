"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { FolderKanban, Plus, Trash2 } from "lucide-react";

import { useDeleteProject, useProjects, projectTableColumns } from "@/features/project";
import { useProjectStore } from "@/features/project";
import { useClients } from "@/features/client";
import { useIndustries } from "@/features/industry";
import { StateScreen } from "@/shared/components/StateScreen";
import { DataTableEngine } from "@/shared/components/tables/DataTableEngine";
import { DataTableFilterConfig } from "@/shared/components/tables/data-table-engine.types";
import { Button } from "@/components/ui/button";
import I18n from "@/shared/components/I18n";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";

export default function AdminProjectsPage() {
  const router = useRouter();
  const locale = useLocale();
  const page = useProjectStore((state) => state.page);
  const setPage = useProjectStore((state) => state.setPage);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const statusFilter = filterValues["status"] === "All" ? undefined : (filterValues["status"] as any);
  const rawFeatured = filterValues["isFeatured"];
  const featuredFilter =
    rawFeatured === "true" ? true :
      rawFeatured === "false" ? false :
        undefined;
  const clientFilter = filterValues["clientId"] === "All" ? undefined : filterValues["clientId"];
  const industryFilter = filterValues["industryId"] === "All" ? undefined : filterValues["industryId"];

  const { data: clientsData } = useClients({ limit: 100 });
  const { data: industriesData } = useIndustries({ limit: 100 });

  const clients = clientsData?.data?.data || [];
  const industries = industriesData?.data?.data || [];

  const { data, isLoading, error } = useProjects({
    page,
    limit: 10,
    search: searchQuery.trim() !== "" ? searchQuery : undefined,
    status: statusFilter,
    isFeatured: featuredFilter,
    clientId: clientFilter,
    industryId: industryFilter,
  });

  const deleteProject = useDeleteProject();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will permanently delete the project and its media assets.")) {
      await deleteProject.mutateAsync(id);
    }
  };

  if (error) {
    return <StateScreen state="error" title="Unable to load projects" compact />;
  }

  const projects = data?.data?.data || [];
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
    {
      key: "clientId",
      placeholder: "Client",
      options: [
        { label: "All Clients", value: "All" },
        ...clients.map((c) => ({ label: c.title, value: c.id })),
      ],
    },
    {
      key: "industryId",
      placeholder: "Industry",
      options: [
        { label: "All Industries", value: "All" },
        ...industries.map((i) => ({ label: i.title, value: i.id })),
      ],
    },
  ];

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={FolderKanban}
        title={<I18n>Projects</I18n>}
        description={
          <I18n>
            Manage portfolio projects, publishing state, and archive status with a consistent
            workflow.
          </I18n>
        }
        actions={
          <Link href={`/${locale}/admin/projects/create`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/10 ui-card-hover h-11 rounded-xl px-5 font-semibold shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              <I18n>Create New</I18n>
            </Button>
          </Link>
        }
      />
      <DataTableEngine
        columns={projectTableColumns}
        data={projects}
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
        onView={(item) => router.push(`/${locale}/admin/projects/${item.id}`)}
        onEdit={(item) => router.push(`/${locale}/admin/projects/${item.id}/edit`)}
        onDelete={(item) => handleDelete(item.id)}
        bulkActions={[
          {
            label: "Delete Selected",
            variant: "destructive",
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: async (selected) => {
              if (confirm(`Delete ${selected.length} selected projects?`)) {
                await Promise.all(selected.map((item) => deleteProject.mutateAsync(item.id)));
              }
            },
          },
        ]}
      />
    </div>
  );
}
