"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { UserCog } from "lucide-react";
import Link from "next/link";

import { useProfiles, useProfileStore, profileTableColumns } from "@/features/profile";
import { useRouter } from "@/shared/i18n";
import { StateScreen } from "@/shared/components/StateScreen";
import { DataTableEngine } from "@/shared/components/tables/DataTableEngine";
import { DataTableFilterConfig } from "@/shared/components/tables/data-table-engine.types";
import { Button } from "@/components/ui/button";
import I18n from "@/shared/components/I18n";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";

export default function AdminProfilesPage() {
  const router = useRouter();
  const locale = useLocale();
  const store = useProfileStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const rawPublic = filterValues["isPublic"];
  const publicFilter =
    rawPublic === "true" ? true :
      rawPublic === "false" ? false :
        undefined;

  const { data, isLoading, error } = useProfiles({
    page: store.page,
    limit: store.limit,
    sort: store.sort,
    search: searchQuery.trim() !== "" ? searchQuery : undefined,
    isPublic: publicFilter,
  });
  const result = data?.data;
  const profiles = result?.data ?? [];
  const meta = result?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.page ?? store.page;

  const filters: DataTableFilterConfig[] = [
    {
      key: "isPublic",
      placeholder: "Visibility",
      options: [
        { label: "Public", value: "true" },
        { label: "Private", value: "false" },
      ],
    },
  ];

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={UserCog}
        title={<I18n>Profiles</I18n>}
        description={
          <I18n>Manage member profiles, visibility, and public presence from one workspace.</I18n>
        }
        actions={
          <Link href={`/${locale}/admin/profiles/me`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/10 ui-card-hover h-11 rounded-xl px-5 font-semibold shadow-md">
              <UserCog className="mr-2 h-4 w-4" />
              <I18n>My profile</I18n>
            </Button>
          </Link>
        }
      />

      <DataTableEngine
        columns={profileTableColumns}
        data={profiles}
        searchKey="fullName"
        searchPlaceholder="Search profiles..."
        searchValue={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          store.setPage(1);
        }}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={(newVals) => {
          setFilterValues(newVals);
          store.setPage(1);
        }}
        isLoading={isLoading}
        pageCount={totalPages}
        currentPage={currentPage}
        onPageChange={store.setPage}
        onView={(item) => router.push(`/${locale}/admin/profiles/${item.id}`)}
        onEdit={(item) => router.push(`/${locale}/admin/profiles/${item.id}/edit`)}
      />
    </div>
  );
}

