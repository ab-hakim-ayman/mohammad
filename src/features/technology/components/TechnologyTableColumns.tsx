import Link from "next/link";
import Image from "next/image";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Technology } from "../types/technology.types";

export const technologyTableColumns: ColumnConfig<Technology>[] = [
  {
    key: "title",
    header: "Title",
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-3">
        {item.logo ? (
          <div className="bg-muted/20 relative h-7 w-7 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={item.logo}
              alt={item.title}
              fill
              unoptimized
              className="object-contain p-0.5"
            />
          </div>
        ) : (
          <div className="bg-primary/10 text-primary border-primary/20 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold">
            {item.title.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-foreground block max-w-[180px] truncate font-medium">
          {item.title}
        </span>
      </div>
    ),
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
    key: "order",
    header: "Order",
    type: "text",
  },
  {
    key: "projects",
    header: "Projects",
    type: "relation",
    hrefPrefix: "projects",
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
];
