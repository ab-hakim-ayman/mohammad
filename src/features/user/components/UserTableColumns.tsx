import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { UserRecord } from "../types/user.types";
import { enumLabel } from "@/shared/utils/enum-label";

export const userTableColumns: ColumnConfig<UserRecord>[] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    render: (item) => (
      <div className="flex flex-col">
        <span className="text-foreground font-medium">{item.name || item.email}</span>
        <span className="text-muted-foreground text-xs">{item.email}</span>
      </div>
    ),
  },
  {
    key: "phone",
    header: "Phone",
    type: "text",
  },
  {
    key: "role",
    header: "Role",
    render: (item) => (
      <span className="text-foreground text-sm font-medium">{enumLabel(item.role)}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    type: "status",
  },
  {
    key: "isVerified",
    header: "Verified",
    type: "boolean",
  },
  {
    key: "lastLoginAt",
    header: "Last Login",
    type: "datetime",
  },
  {
    key: "createdAt",
    header: "Created At",
    type: "datetime",
    sortable: true,
  },
  {
    key: "updatedAt",
    header: "Updated At",
    type: "datetime",
    sortable: true,
  },
  {
    key: "profile",
    header: "Profile",
    render: (item) =>
      item.profile?.id ? (
        <Link
          href={`/admin/profiles/${item.profile.id}`}
          className="text-primary text-sm font-medium hover:underline"
        >
          View Profile
        </Link>
      ) : (
        <span className="text-muted-foreground/40 text-sm">—</span>
      ),
  },
];
