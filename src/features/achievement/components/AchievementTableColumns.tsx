import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Achievement } from "../types/achievement.types";
import { enumLabel } from "@/shared/utils/enum-label";

export const achievementTableColumns: ColumnConfig<Achievement>[] = [
  {
    key: "title",
    header: "Title",
    type: "text",
    sortable: true,
  },
  {
    key: "slug",
    header: "Slug",
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
    key: "issuer",
    header: "Issuer",
    type: "text",
  },
  {
    key: "achievedAt",
    header: "Achieved At",
    type: "date",
    sortable: true,
  },
  {
    key: "shortDesc",
    header: "Short Desc",
    type: "text",
  },
  {
    key: "order",
    header: "Order",
    type: "text",
  },
  {
    key: "status",
    header: "Status",
    type: "status",
  },
  {
    key: "isFeatured",
    header: "Featured",
    type: "boolean",
  },
  {
    key: "publishedAt",
    header: "Published",
    type: "datetime",
    sortable: true,
  },
  {
    key: "createdBy",
    header: "Created By",
    render: (item) => {
      const actor = item.createdBy;
      return actor ? (
        <Link
          href={`/admin/users/${actor.id}`}
          className="text-primary hover:text-primary/80 text-sm underline-offset-2 hover:underline"
        >
          {actor.profile?.fullName || actor.name || actor.email}
        </Link>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      );
    },
  },
  {
    key: "createdAt",
    header: "Created",
    type: "datetime",
    sortable: true,
  },
  {
    key: "updatedBy",
    header: "Updated By",
    render: (item) => {
      const actor = item.updatedBy;
      return actor ? (
        <Link
          href={`/admin/users/${actor.id}`}
          className="text-primary hover:text-primary/80 text-sm underline-offset-2 hover:underline"
        >
          {actor.profile?.fullName || actor.name || actor.email}
        </Link>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      );
    },
  },
];
