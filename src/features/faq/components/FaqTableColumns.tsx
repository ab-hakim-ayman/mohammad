import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Faq } from "../types/faq.types";

export const faqTableColumns: ColumnConfig<Faq>[] = [
  {
    key: "question",
    header: "Question",
    type: "text",
    sortable: true,
  },
  {
    key: "answer",
    header: "Answer",
    type: "text",
  },
  {
    key: "categories",
    header: "Categories",
    type: "relation",
    hrefPrefix: "categories",
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
