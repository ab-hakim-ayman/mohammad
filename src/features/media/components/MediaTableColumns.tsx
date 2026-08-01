import Link from "next/link";
import { ColumnConfig } from "@/shared/components/tables/data-table-engine.types";
import type { MediaRecord } from "../types/media.types";

export const mediaTableColumns: ColumnConfig<MediaRecord>[] = [
  {
    key: "url",
    header: "Preview",
    type: "image",
  },
  {
    key: "originalFilename",
    header: "Filename",
    sortable: true,
    render: (media) => (
      <div className="flex min-w-[180px] flex-col">
        <span className="text-foreground truncate text-xs font-semibold">
          {media.originalFilename || media.providerAssetId}
        </span>
        <span className="text-muted-foreground truncate text-[11px]">{media.folder || "root"}</span>
      </div>
    ),
  },
  {
    key: "resourceType",
    header: "Type",
    type: "badge",
    sortable: true,
  },
  {
    key: "provider",
    header: "Provider",
    type: "badge",
  },
  {
    key: "fileSize",
    header: "Size",
    render: (media) => (
      <span className="text-muted-foreground font-mono text-xs">
        {media.fileSize ? `${Math.round(media.fileSize / 1024)} KB` : "\u2014"}
      </span>
    ),
  },
  {
    key: "isArchived",
    header: "Archived",
    type: "boolean",
  },
  {
    key: "createdBy",
    header: "Uploaded By",
    render: (media) => {
      const actor = media.createdBy;
      return actor ? (
        <Link
          href={`/admin/users/${actor.id}`}
          className="text-primary hover:text-primary/80 text-xs font-semibold underline-offset-2 hover:underline"
        >
          {actor.profile?.fullName || actor.name || actor.email}
        </Link>
      ) : (
        <span className="text-muted-foreground/40">\u2014</span>
      );
    },
  },
  {
    key: "createdAt",
    header: "Uploaded At",
    type: "datetime",
    sortable: true,
  },
  {
    key: "updatedBy",
    header: "Updated By",
    render: (media) => {
      const actor = media.updatedBy;
      return actor ? (
        <Link
          href={`/admin/users/${actor.id}`}
          className="text-primary hover:text-primary/80 text-xs font-semibold underline-offset-2 hover:underline"
        >
          {actor.profile?.fullName || actor.name || actor.email}
        </Link>
      ) : (
        <span className="text-muted-foreground/40">\u2014</span>
      );
    },
  },
];
