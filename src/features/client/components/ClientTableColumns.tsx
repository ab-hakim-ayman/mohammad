import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Client } from "../types/client.types";

export const clientTableColumns: ColumnConfig<Client>[] = [
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
    key: "website",
    header: "Website",
    type: "link",
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
    key: "projects",
    header: "Projects",
    type: "relation",
    hrefPrefix: "projects",
  },
  {
    key: "testimonials",
    header: "Testimonials",
    type: "relation",
    hrefPrefix: "testimonials",
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
          className="text-primary hover:text-primary/80 text-xs font-semibold underline-offset-2 hover:underline"
        >
          {actor.profile?.fullName || actor.name || actor.email}
        </Link>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      );
    },
  },
  {
    key: "createdAt",
    header: "Created At",
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
          className="text-primary hover:text-primary/80 text-xs font-semibold underline-offset-2 hover:underline"
        >
          {actor.profile?.fullName || actor.name || actor.email}
        </Link>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      );
    },
  },
];
