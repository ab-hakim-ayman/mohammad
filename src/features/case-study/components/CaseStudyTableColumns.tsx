import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { CaseStudy } from "../types/case-study.types";

export const caseStudyTableColumns: ColumnConfig<CaseStudy>[] = [
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
    key: "project",
    header: "Project",
    render: (item) => {
      const project = item.project;
      return project ? (
        <Link
          href={`/admin/projects/${project.id}`}
          className="text-primary hover:text-primary/80 text-sm underline-offset-2 hover:underline"
        >
          {project.title}
        </Link>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      );
    },
  },

  {
    key: "shortDesc",
    header: "Short Desc",
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
          className="text-primary hover:text-primary/80 text-sm underline-offset-2 hover:underline"
        >
          {actor.profile?.fullName || actor.name || actor.email}
        </Link>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
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
          className="text-primary hover:text-primary/80 text-sm underline-offset-2 hover:underline"
        >
          {actor.profile?.fullName || actor.name || actor.email}
        </Link>
      ) : (
        <span className="text-muted-foreground text-sm">—</span>
      );
    },
  },
];
