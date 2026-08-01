import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Skill } from "../types/skill.types";

export const skillTableColumns: ColumnConfig<Skill>[] = [
  {
    key: "title",
    header: "Name",
    type: "text",
    sortable: true,
  },
  {
    key: "shortDesc",
    header: "Description",
    type: "text",
  },
  {
    key: "order",
    header: "Order",
    type: "text",
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
    key: "profiles",
    header: "Profiles",
    type: "relation",
    hrefPrefix: "profiles",
  },
  {
    key: "status",
    header: "Status",
    type: "status",
  },
  {
    key: "createdAt",
    header: "Created At",
    type: "datetime",
    sortable: true,
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
    key: "createdById",
    header: "Created By",
    type: "text",
  },
  {
    key: "updatedById",
    header: "Updated By",
    type: "text",
  },
];
