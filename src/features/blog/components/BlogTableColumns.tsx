import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Blog } from "../types/blog.types";

export const blogTableColumns: ColumnConfig<Blog>[] = [
  {
    key: "cardImage",
    header: "Image",
    type: "image",
  },
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
    key: "createdBy",
    header: "Author",
    render: (blog) => {
      const actor = blog.createdBy;
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
    key: "categories",
    header: "Categories",
    type: "relation",
    hrefPrefix: "categories",
  },
  {
    key: "tags",
    header: "Tags",
    type: "relation",
    hrefPrefix: "tags",
  },
  {
    key: "readTime",
    header: "Read Time",
    render: (blog) => (
      <span className="text-foreground/80 font-mono text-xs">
        {blog.readTime ? `${blog.readTime} min` : "—"}
      </span>
    ),
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
    header: "Published At",
    type: "datetime",
    sortable: true,
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
    render: (blog) => {
      const actor = blog.updatedBy;
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