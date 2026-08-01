"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Plus, Trash2, UserCog } from "lucide-react";

import { useDeleteUser, useUsers, useUserStore, userTableColumns } from "@/features/user";
import { type AccountStatus, type UserRole } from "@/shared/types";
import { StateScreen } from "@/shared/components/StateScreen";
import { DataTableEngine } from "@/shared/components/tables/DataTableEngine";
import { DataTableFilterConfig } from "@/shared/components/tables/data-table-engine.types";
import { Button } from "@/components/ui/button";
import I18n from "@/shared/components/I18n";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";

export default function AdminUsersPage() {
  const router = useRouter();
  const locale = useLocale();
  const page = useUserStore((state) => state.page);
  const sort = useUserStore((state) => state.sort);
  const setPage = useUserStore((state) => state.setPage);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const roleFilter = filterValues["role"] === "All" ? undefined : (filterValues["role"] as any);
  const statusFilter = filterValues["status"] === "All" ? undefined : (filterValues["status"] as any);

  const { data, isLoading, error } = useUsers({
    page,
    limit: 10,
    search: searchQuery.trim() !== "" ? searchQuery : undefined,
    sort,
    role: roleFilter,
    status: statusFilter,
  });

  const deleteUser = useDeleteUser();

  const handleDelete = async (id: string) => {
    if (confirm("Delete this user permanently?")) {
      await deleteUser.mutateAsync(id);
    }
  };

  if (error) {
    return <StateScreen state="error" title="Unable to load users" compact />;
  }

  const users = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const filters: DataTableFilterConfig[] = [
    {
      key: "role",
      placeholder: "Role",
      options: [
        { label: "Owner", value: "OWNER" },
        { label: "Admin", value: "ADMIN" },
        { label: "Manager", value: "MANAGER" },
        { label: "HR", value: "HR" },
        { label: "Content Manager", value: "CONTENT_MANAGER" },
        { label: "Employee", value: "EMPLOYEE" },
      ],
    },
    {
      key: "status",
      placeholder: "Account Status",
      options: [
        { label: "Invited", value: "INVITED" },
        { label: "Active", value: "ACTIVE" },
        { label: "Inactive", value: "INACTIVE" },
        { label: "Suspended", value: "SUSPENDED" },
      ],
    },
  ];

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={UserCog}
        title={<I18n>Users</I18n>}
        description={<I18n>Manage access, account status, invitations, and user profiles.</I18n>}
        actions={
          <Link href={`/${locale}/admin/users/create`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/10 ui-card-hover h-11 rounded-xl px-5 font-semibold shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              <I18n>Create / Invite</I18n>
            </Button>
          </Link>
        }
      />

      <DataTableEngine
        columns={userTableColumns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search by name..."
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
        onView={(item) => router.push(`/${locale}/admin/users/${item.id}`)}
        onEdit={(item) => router.push(`/${locale}/admin/users/${item.id}/edit`)}
        onDelete={(item) => handleDelete(item.id)}
        bulkActions={[
          {
            label: "Delete Selected",
            variant: "destructive",
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: async (selected) => {
              if (confirm(`Delete ${selected.length} selected users?`)) {
                await Promise.all(selected.map((item) => deleteUser.mutateAsync(item.id)));
              }
            },
          },
        ]}
      />
    </div>
  );
}
