import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Partner } from "../types/partner.types";
import { enumLabel } from "@/shared/utils/enum-label";

export const partnerTableColumns: ColumnConfig<Partner>[] = [
  {
    key: "title",
    header: "Title",
    sortable: true,
    render: (item) => (
      <Link
        href={`/admin/partners/${item.id}`}
        className="text-foreground block max-w-xs truncate font-medium hover:underline"
      >
        {item.title}
      </Link>
    ),
  },
  {
    key: "shortDesc",
    header: "Description",
    type: "text",
  },
  {
    key: "type",
    header: "Type",
    render: (item) => (
      <span className="text-muted-foreground text-xs tracking-wider">{enumLabel(item.type)}</span>
    ),
  },
  {
    key: "order",
    header: "Order",
    type: "text",
  },
  {
    key: "isFeatured",
    header: "Featured",
    type: "boolean",
  },
  {
    key: "website",
    header: "Website",
    type: "link",
  },
  {
    key: "status",
    header: "Status",
    type: "status",
  },
  {
    key: "createdAt",
    header: "Created At",
    type: "datetime",
    sortable: true,
  },
  {
    key: "publishedAt",
    header: "Published At",
    type: "datetime",
    sortable: true,
  },
  {
    key: "archivedAt",
    header: "Archived At",
    type: "datetime",
  },
  {
    key: "createdBy",
    header: "Created By",
    render: (item) => {
      const user = item.createdBy;
      if (!user) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <Link
          href={`/admin/users/${user.id}`}
          className="text-muted-foreground hover:text-foreground text-sm hover:underline"
        >
          {user.name || user.email}
        </Link>
      );
    },
  },
  {
    key: "updatedBy",
    header: "Updated By",
    render: (item) => {
      const user = item.updatedBy;
      if (!user) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <Link
          href={`/admin/users/${user.id}`}
          className="text-muted-foreground hover:text-foreground text-sm hover:underline"
        >
          {user.name || user.email}
        </Link>
      );
    },
  },
];
