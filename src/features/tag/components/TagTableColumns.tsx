import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Tag } from "../types/tag.types";

export const tagTableColumns: ColumnConfig<Tag>[] = [
  {
    key: "title",
    header: "Name",
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
    key: "blogs",
    header: "Blogs",
    type: "relation",
    hrefPrefix: "blogs",
  },
  {
    key: "projects",
    header: "Projects",
    type: "relation",
    hrefPrefix: "projects",
  },
  {
    key: "services",
    header: "Services",
    type: "relation",
    hrefPrefix: "services",
  },
  {
    key: "caseStudies",
    header: "Case Studies",
    type: "relation",
    hrefPrefix: "case-studies",
  },
  {
    key: "status",
    header: "Status",
    type: "status",
  },
  {
    key: "technologies",
    header: "Technologies",
    type: "relation",
    hrefPrefix: "technologies",
  },
  {
    key: "skills",
    header: "Skills",
    type: "relation",
    hrefPrefix: "skills",
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
