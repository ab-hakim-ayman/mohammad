import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Industry } from "../types/industry.types";

export const industryTableColumns: ColumnConfig<Industry>[] = [
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
    key: "shortDesc",
    header: "Short Desc",
    type: "text",
  },
  {
    key: "services",
    header: "Services",
    type: "relation",
    hrefPrefix: "services",
  },
  {
    key: "projects",
    header: "Projects",
    type: "relation",
    hrefPrefix: "projects",
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
