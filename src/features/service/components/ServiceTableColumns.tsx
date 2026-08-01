import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Service } from "../types/service.types";
import { Settings } from "lucide-react";
import Image from "next/image";

export const serviceTableColumns: ColumnConfig<Service>[] = [
  {
    key: "icon",
    header: "Icon",
    render: (item) => {
      const icon = item.icon;
      return (
        <div className="text-primary flex h-8 w-8 shrink-0 items-center justify-center">
          {icon?.includes("/") || icon?.includes(".") ? (
            <div className="relative h-full w-full">
              <Image
                src={icon || ""}
                alt={item.title}
                fill
                sizes="32px"
                className="object-contain p-1"
              />
            </div>
          ) : icon ? (
            <span className="text-sm">{icon}</span>
          ) : (
            <Settings className="h-4 w-4" />
          )}
        </div>
      );
    },
  },
  {
    key: "title",
    header: "Title",
    sortable: true,
    render: (item) => (
      <Link
        href={`/admin/services/${item.id}`}
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
    key: "order",
    header: "Order",
    type: "text",
  },
  {
    key: "isFeatured",
    header: "Featured",
    type: "boolean",
  },
  {
    key: "status",
    header: "Status",
    type: "status",
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
    key: "industries",
    header: "Industries",
    type: "relation",
    hrefPrefix: "industries",
  },
  {
    key: "technologies",
    header: "Technologies",
    type: "relation",
    hrefPrefix: "technologies",
  },
  {
    key: "projects",
    header: "Projects",
    type: "relation",
    hrefPrefix: "projects",
  },
  {
    key: "faqs",
    header: "FAQs",
    type: "relation",
    hrefPrefix: "faqs",
  },
  {
    key: "testimonials",
    header: "Testimonials",
    type: "relation",
    hrefPrefix: "testimonials",
  },
  {
    key: "specializations",
    header: "Specializations",
    type: "relation",
    hrefPrefix: "specializations",
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
