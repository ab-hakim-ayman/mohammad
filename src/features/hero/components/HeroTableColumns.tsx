import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Hero } from "../types/hero.types";

export const heroTableColumns: ColumnConfig<Hero>[] = [
  {
    key: "title",
    header: "Title",
    type: "text",
    sortable: true,
  },
  {
    key: "shortDesc",
    header: "Short Desc",
    type: "text",
  },
  {
    key: "status",
    header: "Status",
    type: "status",
  },
  {
    key: "isActive",
    header: "Active",
    type: "boolean",
  },
  {
    key: "order",
    header: "Order",
    type: "text",
  },
  {
    key: "createdBy",
    header: "Created By",
    render: (item) => (
      <span className="text-muted-foreground text-sm">
        {item.createdBy?.name || item.createdBy?.email || "—"}
      </span>
    ),
  },
  {
    key: "updatedBy",
    header: "Updated By",
    render: (item) => (
      <span className="text-muted-foreground text-sm">
        {item.updatedBy?.name || item.updatedBy?.email || "—"}
      </span>
    ),
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
    key: "createdAt",
    header: "Created At",
    type: "datetime",
    sortable: true,
  },
];
