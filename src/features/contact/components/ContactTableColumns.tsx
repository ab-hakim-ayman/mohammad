import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { Contact } from "../types/contact.types";

export const contactTableColumns: ColumnConfig<Contact>[] = [
  {
    key: "name",
    header: "Name",
    type: "text",
    sortable: true,
  },
  {
    key: "email",
    header: "Email",
    type: "text",
    sortable: true,
  },
  {
    key: "phone",
    header: "Phone",
    type: "text",
  },
  {
    key: "subject",
    header: "Subject",
    type: "text",
  },
  {
    key: "service",
    header: "Service",
    render: (item) => {
      const service = item.service;
      return service ? (
        <Link
          href={`/admin/services/${service.id}`}
          className="text-primary hover:text-primary/80 text-sm font-medium hover:underline"
        >
          {service.title}
        </Link>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    render: (item) => {
      const status = item.status;

      if (status === "NEW") {
        return (
          <span className="bg-warning/10 text-warning border-warning/20 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase">
            Unread
          </span>
        );
      }
      if (status === "REPLIED") {
        return (
          <span className="bg-success/10 text-success border-success/20 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase">
            Replied
          </span>
        );
      }
      if (status === "ARCHIVED") {
        return (
          <span className="bg-muted/50 text-muted-foreground border-border inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase">
            Archived
          </span>
        );
      }
      return (
        <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wider uppercase">
          Read
        </span>
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
    key: "updatedAt",
    header: "Updated At",
    type: "datetime",
    sortable: true,
  },
];
