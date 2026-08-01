import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import type { AdminProfileRecord } from "../types/profile.types";

export const profileTableColumns: ColumnConfig<AdminProfileRecord>[] = [
  {
    key: "fullName",
    header: "Full Name",
    sortable: true,
    render: (item) => (
      <Link
        href={`/admin/profiles/${item.id}`}
        className="text-foreground block max-w-xs truncate font-medium hover:underline"
      >
        {item.fullName}
      </Link>
    ),
  },
  {
    key: "designation",
    header: "Designation",
    type: "text",
  },
  {
    key: "email",
    header: "Email",
    sortable: true,
    render: (item) => (
      <Link
        href={`/admin/users/${item.user.id}`}
        className="text-muted-foreground hover:text-foreground text-sm hover:underline"
      >
        {item.user.email}
      </Link>
    ),
  },
  {
    key: "headline",
    header: "Headline",
    type: "text",
  },
  {
    key: "bio",
    header: "Bio",
    type: "text",
  },
  {
    key: "experienceYears",
    header: "Experience",
    render: (item) => (
      <span className="text-muted-foreground text-sm">
        {item.experienceYears != null ? `${item.experienceYears}y` : "—"}
      </span>
    ),
  },
  {
    key: "githubUrl",
    header: "GitHub",
    type: "link",
  },
  {
    key: "linkedinUrl",
    header: "LinkedIn",
    type: "link",
  },
  {
    key: "portfolioUrl",
    header: "Portfolio",
    type: "link",
  },
  {
    key: "isPublic",
    header: "Is Public",
    type: "boolean",
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
];
