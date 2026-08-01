import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Specialization } from "../types/specialization.types";

export const specializationTableColumns: ColumnConfig<Specialization>[] = [
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
    key: "services",
    header: "Services",
    type: "relation",
    hrefPrefix: "services",
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
  {
    key: "updatedAt",
    header: "Updated At",
    type: "datetime",
    sortable: true,
  },
  {
    key: "createdBy",
    header: "Created By",
    render: (item) =>
      item.createdBy ? (
        <Link
          href={`/admin/users/${item.createdBy.id}`}
          className="text-primary text-sm hover:underline"
        >
          {item.createdBy.name || item.createdBy.email}
        </Link>
      ) : (
        <span className="text-muted-foreground/40 text-sm">—</span>
      ),
  },
  {
    key: "updatedBy",
    header: "Updated By",
    render: (item) =>
      item.updatedBy ? (
        <Link
          href={`/admin/users/${item.updatedBy.id}`}
          className="text-primary text-sm hover:underline"
        >
          {item.updatedBy.name || item.updatedBy.email}
        </Link>
      ) : (
        <span className="text-muted-foreground/40 text-sm">—</span>
      ),
  },
];
