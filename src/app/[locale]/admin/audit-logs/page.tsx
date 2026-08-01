"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { ShieldAlert, Trash2 } from "lucide-react";

import {
  useAuditLogs,
  useDeleteAuditLog,
  useAuditStore,
  auditLogTableColumns,
} from "@/features/audit";
import { StateScreen } from "@/shared/components/StateScreen";
import { DataTableEngine } from "@/shared/components/tables/DataTableEngine";
import { DataTableFilterConfig } from "@/shared/components/tables/data-table-engine.types";
import I18n from "@/shared/components/I18n";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";

export default function AdminAuditLogsPage() {
  const router = useRouter();
  const locale = useLocale();

  const {
    page,
    limit,
    sort,
    actorId,
    entityId,
    from,
    to,
    setPage,
  } = useAuditStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const actionFilter = filterValues["action"] === "All" ? undefined : (filterValues["action"] as any);
  const entityTypeFilter = filterValues["entityType"] === "All" ? undefined : filterValues["entityType"];

  const query = useAuditLogs({
    page,
    limit,
    sort,
    search: searchQuery.trim() !== "" ? searchQuery : undefined,
    action: actionFilter,
    entityType: entityTypeFilter,
    actorId: actorId || undefined,
    entityId: entityId || undefined,
    from: from || undefined,
    to: to || undefined,
  });

  const deleteAuditLog = useDeleteAuditLog();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will permanently delete this security log entry.")) {
      await deleteAuditLog.mutateAsync(id);
    }
  };

  if (query.error) {
    return <StateScreen state="error" title="Unable to load system audit logs" compact />;
  }

  const logs = query.data?.data?.data || [];
  const pagination = query.data?.data?.pagination;

  const filters: DataTableFilterConfig[] = [
    {
      key: "action",
      placeholder: "Action",
      options: [
        { label: "Create", value: "CREATE" },
        { label: "Update", value: "UPDATE" },
        { label: "Delete", value: "DELETE" },
        { label: "Publish", value: "PUBLISH" },
        { label: "Unpublish", value: "UNPUBLISH" },
        { label: "Archive", value: "ARCHIVE" },
        { label: "Restore", value: "RESTORE" },
        { label: "Feature", value: "FEATURE" },
        { label: "Unfeature", value: "UNFEATURE" },
        { label: "Login", value: "LOGIN" },
        { label: "Logout", value: "LOGOUT" },
        { label: "Role Change", value: "ROLE_CHANGE" },
        { label: "Status Change", value: "STATUS_CHANGE" },
        { label: "Password Change", value: "PASSWORD_CHANGE" },
        { label: "Invite", value: "INVITE" },
        { label: "Accept Invite", value: "ACCEPT_INVITE" },
        { label: "Reset Password", value: "RESET_PASSWORD" },
      ],
    },
    {
      key: "entityType",
      placeholder: "Entity Type",
      options: [
        { label: "Site Info", value: "SITE_INFO" },
        { label: "About", value: "ABOUT" },
        { label: "Hero", value: "HERO" },
        { label: "Profile", value: "PROFILE" },
        { label: "Quote", value: "QUOTE" },
        { label: "Blog", value: "BLOG" },
        { label: "Industry", value: "INDUSTRY" },
        { label: "Project", value: "PROJECT" },
        { label: "Case Study", value: "CASE_STUDY" },
        { label: "Service", value: "SERVICE" },
        { label: "Specialization", value: "SPECIALIZATION" },
        { label: "Event", value: "EVENT" },
        { label: "Achievement", value: "ACHIEVEMENT" },
        { label: "Gallery", value: "GALLERY" },
        { label: "Gallery Item", value: "GALLERY_ITEM" },
        { label: "Client", value: "CLIENT" },
        { label: "Partner", value: "PARTNER" },
        { label: "Team", value: "TEAM" },
        { label: "Technology", value: "TECHNOLOGY" },
      ],
    },
  ];

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={ShieldAlert}
        title={<I18n>Security Audit Logs</I18n>}
        description={
          <I18n>
            Track real-time infrastructure alterations, authentication telemetry, and account
            mutation logs.
          </I18n>
        }
        actions={<></>}
      />

      <DataTableEngine
        columns={auditLogTableColumns}
        data={logs}
        searchKey="action"
        searchPlaceholder="Search audit logs..."
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
        isLoading={query.isLoading}
        pageCount={pagination?.totalPages || 1}
        currentPage={page}
        onPageChange={setPage}
        onView={(item) => router.push(`/${locale}/admin/audit-logs/${item.id}`)}
        onDelete={(item) => handleDelete(item.id)}
        bulkActions={[
          {
            label: "Delete Selected",
            variant: "destructive",
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: async (selected) => {
              if (confirm(`Delete ${selected.length} selected audit logs?`)) {
                await Promise.all(selected.map((item) => deleteAuditLog.mutateAsync(item.id)));
              }
            },
          },
        ]}
      />
    </div>
  );
}
