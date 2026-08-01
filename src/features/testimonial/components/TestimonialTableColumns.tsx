import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Testimonial } from "../types/testimonial.types";
import { Star } from "lucide-react";

export const testimonialTableColumns: ColumnConfig<Testimonial>[] = [
  {
    key: "authorName",
    header: "Author Name",
    type: "text",
    sortable: true,
  },
  {
    key: "message",
    header: "Message",
    render: (item) => (
      <span className="text-muted-foreground block max-w-md truncate text-sm">
        {item.message.length > 80 ? item.message.slice(0, 80) + "..." : item.message}
      </span>
    ),
  },
  {
    key: "rating",
    header: "Rating",
    render: (item) => (
      <span className="text-warning inline-flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < item.rating ? "fill-current" : "text-muted-foreground/30"}`}
          />
        ))}
      </span>
    ),
  },
  {
    key: "source",
    header: "Source",
    render: (item) => (
      <span className="text-muted-foreground text-sm capitalize">
        {item.source.split("_").join(" ").toLowerCase()}
      </span>
    ),
  },
  {
    key: "type",
    header: "Type",
    render: (item) => (
      <span className="text-muted-foreground text-sm capitalize">{item.type.toLowerCase()}</span>
    ),
  },
  {
    key: "email",
    header: "Email",
    type: "text",
    sortable: true,
  },
  {
    key: "client",
    header: "Client",
    render: (item) =>
      item.clientId ? (
        <Link
          href={`/admin/clients/${item.clientId}`}
          className="text-primary text-sm hover:underline"
        >
          {item.client?.title || item.clientId.slice(0, 8) + "..."}
        </Link>
      ) : (
        <span className="text-muted-foreground/40 text-sm">—</span>
      ),
  },
  {
    key: "employee",
    header: "Employee",
    render: (item) =>
      item.employeeId ? (
        <Link
          href={`/admin/users/${item.employeeId}`}
          className="text-primary text-sm hover:underline"
        >
          {item.employee?.name || item.employeeId.slice(0, 8) + "..."}
        </Link>
      ) : (
        <span className="text-muted-foreground/40 text-sm">—</span>
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
    key: "order",
    header: "Order",
    type: "text",
  },
  {
    key: "caseStudies",
    header: "Case Studies",
    type: "relation",
    hrefPrefix: "case-studies",
  },
  {
    key: "services",
    header: "Services",
    type: "relation",
    hrefPrefix: "services",
  },
  {
    key: "submittedAt",
    header: "Submitted At",
    type: "datetime",
    sortable: true,
  },
  {
    key: "consentAt",
    header: "Consent At",
    type: "datetime",
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
    render: (item) =>
      item.createdBy ? (
        <Link
          href={`/admin/users/${item.createdBy.id}`}
          className="text-primary text-sm hover:underline"
        >
          {item.createdBy.name || item.createdBy.email}
        </Link>
      ) : (
        <span className="text-muted-foreground/40 text-sm">—</span>
      ),
  },
  {
    key: "updatedBy",
    header: "Updated By",
    render: (item) =>
      item.updatedBy ? (
        <Link
          href={`/admin/users/${item.updatedBy.id}`}
          className="text-primary text-sm hover:underline"
        >
          {item.updatedBy.name || item.updatedBy.email}
        </Link>
      ) : (
        <span className="text-muted-foreground/40 text-sm">—</span>
      ),
  },
];
