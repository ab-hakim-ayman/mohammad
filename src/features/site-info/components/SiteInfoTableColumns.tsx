import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import { SiteInfoRecord } from "../types/site-info.types";

export const siteInfoTableColumns = (locale: string): ColumnConfig<SiteInfoRecord>[] => [
  // 1. Basic Info
  {
    key: "siteTitle",
    header: "Site Title",
    sortable: true,
    render: (item) => (
      <Link
        href={`/${locale}/admin/site-info/${item.id}`}
        className="text-foreground block max-w-xs truncate font-medium hover:underline"
      >
        {item.siteTitle}
      </Link>
    ),
  },
  {
    key: "companyTitle",
    header: "Company Title",
    type: "text",
  },
  {
    key: "tagline",
    header: "Tagline",
    type: "text",
    render: (item) => item.tagline ? <span className="truncate max-w-xs block">{item.tagline}</span> : <span className="text-muted-foreground/40">—</span>,
  },
  {
    key: "siteUrl",
    header: "Site URL",
    type: "link",
    render: (item) =>
      item.siteUrl ? (
        <a href={item.siteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate block max-w-[180px]">
          {item.siteUrl}
        </a>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      ),
  },

  // 2. Contact & Location
  {
    key: "email",
    header: "Email",
    type: "text",
    render: (item) => item.email || <span className="text-muted-foreground/40">—</span>,
  },
  {
    key: "phone",
    header: "Phone",
    type: "text",
    render: (item) => item.phone || <span className="text-muted-foreground/40">—</span>,
  },
  {
    key: "address",
    header: "Address",
    type: "text",
    render: (item) => item.address ? <span className="truncate max-w-xs block">{item.address}</span> : <span className="text-muted-foreground/40">—</span>,
  },
  {
    key: "officeHours",
    header: "Office Hours",
    type: "text",
    render: (item) => item.officeHours || <span className="text-muted-foreground/40">—</span>,
  },

  // 3. Social Links
  {
    key: "linkedin",
    header: "LinkedIn",
    type: "link",
    render: (item) => item.linkedin ? <a href={item.linkedin} target="_blank" rel="noreferrer" className="text-primary hover:underline">Link</a> : <span className="text-muted-foreground/40">—</span>,
  },
  {
    key: "github",
    header: "GitHub",
    type: "link",
    render: (item) => item.github ? <a href={item.github} target="_blank" rel="noreferrer" className="text-primary hover:underline">Link</a> : <span className="text-muted-foreground/40">—</span>,
  },
  {
    key: "youtube",
    header: "YouTube",
    type: "link",
    render: (item) => item.youtube ? <a href={item.youtube} target="_blank" rel="noreferrer" className="text-primary hover:underline">Link</a> : <span className="text-muted-foreground/40">—</span>,
  },
  {
    key: "behance",
    header: "Behance",
    type: "link",
    render: (item) => item.behance ? <a href={item.behance} target="_blank" rel="noreferrer" className="text-primary hover:underline">Link</a> : <span className="text-muted-foreground/40">—</span>,
  },
  {
    key: "facebook",
    header: "Facebook",
    type: "link",
    render: (item) => item.facebook ? <a href={item.facebook} target="_blank" rel="noreferrer" className="text-primary hover:underline">Link</a> : <span className="text-muted-foreground/40">—</span>,
  },

  // 4. SEO & Business Info
  {
    key: "seoTitle",
    header: "SEO Title",
    type: "text",
    render: (item) => item.seoTitle || <span className="text-muted-foreground/40">—</span>,
  },
  {
    key: "seoKeywords",
    header: "SEO Keywords",
    render: (item) =>
      item.seoKeywords && item.seoKeywords.length > 0 ? (
        <span className="text-xs bg-muted px-2 py-1 rounded-md">{item.seoKeywords.join(", ")}</span>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      ),
  },
  {
    key: "businessType",
    header: "Business Type",
    type: "text",
    render: (item) => item.businessType || <span className="text-muted-foreground/40">—</span>,
  },
  {
    key: "foundedYear",
    header: "Founded Year",
    type: "text",
    render: (item) => item.foundedYear || <span className="text-muted-foreground/40">—</span>,
  },

  // 5. Branding Colors & Footer URLs
  {
    key: "primaryColor",
    header: "Primary Color",
    render: (item) =>
      item.primaryColor ? (
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: item.primaryColor }} />
          <span className="text-xs">{item.primaryColor}</span>
        </div>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      ),
  },
  {
    key: "copyrightText",
    header: "Copyright",
    type: "text",
    render: (item) => item.copyrightText ? <span className="truncate max-w-xs block">{item.copyrightText}</span> : <span className="text-muted-foreground/40">—</span>,
  },

  // 6. Audit & Timestamps
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
        <Link href={`/${locale}/admin/users/${actor.id}`} className="text-primary text-xs font-semibold hover:underline">
          {actor.name || actor.email}
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
        <Link href={`/${locale}/admin/users/${actor.id}`} className="text-primary text-xs font-semibold hover:underline">
          {actor.name || actor.email}
        </Link>
      ) : (
        <span className="text-muted-foreground/40">—</span>
      );
    },
  },
];