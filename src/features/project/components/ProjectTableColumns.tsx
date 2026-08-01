import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Project } from "../types/project.types";

export const projectTableColumns: ColumnConfig<Project>[] = [
  {
    key: "title",
    header: "Title",
    sortable: true,
    render: (item) => (
      <Link
        href={`/admin/projects/${item.id}`}
        className="text-foreground block max-w-xs truncate font-medium hover:underline"
      >
        {item.title}
      </Link>
    ),
  },
  {
    key: "slug",
    header: "Slug",
    type: "text",
  },
  {
    key: "shortDesc",
    header: "Description",
    type: "text",
  },
  {
    key: "client",
    header: "Client",
    render: (item) => {
      const client = item.client;
      if (!client) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <Link
          href={`/admin/clients/${client.id}`}
          className="text-muted-foreground hover:text-foreground text-sm hover:underline"
        >
          {client.title}
        </Link>
      );
    },
  },
  {
    key: "industry",
    header: "Industry",
    render: (item) => {
      const industry = item.industry;
      if (!industry) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <Link
          href={`/admin/industries/${industry.id}`}
          className="text-muted-foreground hover:text-foreground text-sm hover:underline"
        >
          {industry.title}
        </Link>
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
    key: "technologies",
    header: "Tech",
    type: "relation",
    hrefPrefix: "technologies",
  },
  {
    key: "services",
    header: "Services",
    type: "relation",
    hrefPrefix: "services",
  },
  {
    key: "caseStudy",
    header: "Case Study",
    render: (item) => {
      const cs = item.caseStudy;
      if (!cs) return <span className="text-muted-foreground/40">—</span>;
      return (
        <Link
          href={`/admin/case-studies/${cs.id}`}
          className="text-muted-foreground hover:text-foreground text-sm hover:underline"
        >
          {cs.title}
        </Link>
      );
    },
  },
  {
    key: "liveUrl",
    header: "Live URL",
    type: "link",
  },
  {
    key: "githubUrl",
    header: "GitHub",
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
    key: "startDate",
    header: "Start Date",
    type: "date",
  },
  {
    key: "endDate",
    header: "End Date",
    type: "date",
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
    key: "createdBy",
    header: "Created By",
    render: (item) => {
      const user = item.createdBy;
      if (!user) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <Link
          href={`/admin/users/${user.id}`}
          className="text-muted-foreground hover:text-foreground text-sm hover:underline"
        >
          {user.name || user.email}
        </Link>
      );
    },
  },
  {
    key: "updatedBy",
    header: "Updated By",
    render: (item) => {
      const user = item.updatedBy;
      if (!user) return <span className="text-muted-foreground text-sm">—</span>;
      return (
        <Link
          href={`/admin/users/${user.id}`}
          className="text-muted-foreground hover:text-foreground text-sm hover:underline"
        >
          {user.name || user.email}
        </Link>
      );
    },
  },
];
