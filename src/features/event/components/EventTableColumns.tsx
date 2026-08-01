import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Event } from "../types/event.types";

export const eventTableColumns: ColumnConfig<Event>[] = [
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
    key: "format",
    header: "Format",
    type: "text",
  },
  {
    key: "startsAt",
    header: "Starts",
    type: "datetime",
    sortable: true,
  },
  {
    key: "endsAt",
    header: "Ends",
    type: "datetime",
    sortable: true,
  },
  {
    key: "location",
    header: "Location",
    type: "text",
  },
  {
    key: "capacity",
    header: "Capacity",
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
    key: "isFree",
    header: "Is Free",
    type: "boolean",
  },
  {
    key: "faqs",
    header: "FAQs",
    type: "relation",
    hrefPrefix: "faqs",
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
