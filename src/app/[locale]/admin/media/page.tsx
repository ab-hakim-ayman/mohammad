"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { ImageIcon, Plus, Trash2 } from "lucide-react";

import { useMedia, useDeleteMedia, useMediaStore, mediaTableColumns } from "@/features/media";
import { StateScreen } from "@/shared/components/StateScreen";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import { DataTableEngine } from "@/shared/components/tables/DataTableEngine";
import { DataTableFilterConfig } from "@/shared/components/tables/data-table-engine.types";
import { Button } from "@/components/ui/button";
import I18n from "@/shared/components/I18n";

export default function AdminMediaPage() {
  const router = useRouter();
  const locale = useLocale();

  const page = useMediaStore((state) => state.page);
  const setPage = useMediaStore((state) => state.setPage);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const resourceTypeFilter = filterValues["resourceType"] === "All" ? undefined : (filterValues["resourceType"] as any);
  const providerFilter = filterValues["provider"] === "All" ? undefined : (filterValues["provider"] as any);

  const { data, isLoading, error } = useMedia({
    page,
    limit: 10,
    search: searchQuery.trim() !== "" ? searchQuery : undefined,
    provider: providerFilter,
    resourceType: resourceTypeFilter,
    isArchived: undefined,
    folder: undefined,
  });

  const deleteMedia = useDeleteMedia();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will permanently delete this media.")) {
      await deleteMedia.mutateAsync(id);
    }
  };

  if (error) {
    return <StateScreen state="error" title="Unable to load media assets" compact />;
  }

  const items = data?.data || [];
  const pagination = data?.pagination;

  const filters: DataTableFilterConfig[] = [
    {
      key: "resourceType",
      placeholder: "Type",
      options: [
        { label: "Image", value: "IMAGE" },
        { label: "Video", value: "VIDEO" },
        { label: "Audio", value: "AUDIO" },
        { label: "Document", value: "DOCUMENT" },
        { label: "Other", value: "OTHER" },
      ],
    },
    {
      key: "provider",
      placeholder: "Provider",
      options: [{ label: "Cloudinary", value: "CLOUDINARY" }],
    },
  ];

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={ImageIcon}
        title={<I18n>Media Library</I18n>}
        description={
          <I18n>
            Manage, filter, and upload Cloudinary assets using full DataTable capabilities.
          </I18n>
        }
        actions={
          <Link href={`/${locale}/admin/media/create`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/10 ui-card-hover h-11 rounded-xl px-5 font-semibold shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              <I18n>Upload Asset</I18n>
            </Button>
          </Link>
        }
      />

      <DataTableEngine
        data={items}
        columns={mediaTableColumns}
        searchKey="originalFilename"
        searchPlaceholder="Search media by filename..."
        searchValue={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setPage(1);
        }}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={(newVals) => {
          setFilterValues(newVals);
          setPage(1);
        }}
        isLoading={isLoading}
        pageCount={pagination?.totalPages || 1}
        currentPage={page}
        onPageChange={setPage}
        onView={(media) => router.push(`/${locale}/admin/media/${media.id}`)}
        onEdit={(media) => router.push(`/${locale}/admin/media/${media.id}/edit`)}
        onDelete={(media) => handleDelete(media.id)}
        bulkActions={[
          {
            label: "Delete Selected",
            variant: "destructive",
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: async (selected) => {
              if (confirm(`Delete ${selected.length} selected media?`)) {
                await Promise.all(selected.map((item) => deleteMedia.mutateAsync(item.id)));
              }
            },
          },
        ]}
      />
    </div>
  );
}
