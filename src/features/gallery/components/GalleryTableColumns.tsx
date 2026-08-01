import Link from "next/link";
import Image from "next/image";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Gallery } from "../types/gallery.types";

export const galleryTableColumns: ColumnConfig<Gallery>[] = [
  {
    key: "title",
    header: "Title",
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-3">
        {item.coverImage && (
          <div className="bg-muted/20 relative h-8 w-8 shrink-0 overflow-hidden rounded-lg">
            <Image src={item.coverImage} alt="" fill unoptimized className="object-cover" />
          </div>
        )}
        <span className="text-foreground block max-w-[180px] truncate font-medium">
          {item.title}
        </span>
      </div>
    ),
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
    key: "items",
    header: "Items",
    type: "relation",
    hrefPrefix: "media",
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
    key: "createdBy",
    header: "Created By",
    render: (item) => {
      const actor = item.createdBy;
      return actor ? (
        <Link
          href={`/admin/users/${actor.id}`}
          className="text-primary hover:text-primary/80 text-xs font-semibold underline-offset-2 hover:underline"
        >
          {actor.name || actor.email}
        </Link>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      );
    },
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
          {actor.name || actor.email}
        </Link>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      );
    },
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
