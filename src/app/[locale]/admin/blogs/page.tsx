"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Newspaper, Plus, Trash2 } from "lucide-react";

import { useBlogs, useDeleteBlog } from "@/features/blog";
import { blogTableColumns } from "@/features/blog/components/BlogTableColumns";
import { StateScreen } from "@/shared/components/StateScreen";
import { AdminPageBanner } from "@/shared/components/admin/AdminPageBanner";
import { DataTableEngine } from "@/shared/components/tables/DataTableEngine";
import { Button } from "@/components/ui/button";
import I18n from "@/shared/components/I18n";

export default function AdminBlogsPage() {
  const router = useRouter();
  const locale = useLocale();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const statusFilter = filterValues["status"] === "All" ? undefined : filterValues["status"];

  // "Not Featured" সিলেক্ট করলে সঠিক boolean false পাস করা
  const rawFeatured = filterValues["isFeatured"];
  const featuredFilter =
    rawFeatured === "true" ? true :
      rawFeatured === "false" ? false :
        undefined;

  const { data, isLoading, error } = useBlogs({
    page,
    limit: 10,
    search: searchQuery.trim() !== "" ? searchQuery : undefined,
    status: statusFilter as any,
    isFeatured: featuredFilter,
  });

  const deleteBlog = useDeleteBlog();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure? This will permanently delete this blog.")) {
      await deleteBlog.mutateAsync(id);
    }
  };

  if (error) {
    return <StateScreen state="error" title="Unable to load blog posts" compact />;
  }

  const blogs = data?.data?.data || [];
  const pagination = data?.data?.pagination;

  const filters = [
    {
      key: "status",
      placeholder: "Status",
      options: [
        { label: "Draft", value: "DRAFT" },
        { label: "Published", value: "PUBLISHED" },
        { label: "Archived", value: "ARCHIVED" },
      ],
    },
    {
      key: "isFeatured",
      placeholder: "Featured",
      options: [
        { label: "Featured", value: "true" },
        { label: "Not Featured", value: "false" },
      ],
    },
  ];

  return (
    <div className="ui-reveal-up w-full space-y-6 select-none">
      <AdminPageBanner
        icon={Newspaper}
        title={<I18n>Blog Posts</I18n>}
        description={
          <I18n>
            Manage writing pipeline, publishing state, and archive status with a consistent workflow.
          </I18n>
        }
        actions={
          <Link href={`/${locale}/admin/blogs/create`}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/10 ui-card-hover h-11 rounded-xl px-5 font-semibold shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              <I18n>Create New</I18n>
            </Button>
          </Link>
        }
      />

      <DataTableEngine
        data={blogs}
        columns={blogTableColumns}
        searchKey="title"
        searchPlaceholder="Search by title..."
        filters={filters}
        isLoading={isLoading}
        pageCount={pagination?.totalPages || 1}
        currentPage={page}
        onPageChange={setPage}
        searchValue={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          setPage(1);
        }}
        filterValues={filterValues}
        onFilterChange={(newVals) => {
          setFilterValues(newVals);
          setPage(1);
        }}
        onView={(blog) => router.push(`/${locale}/admin/blogs/${blog.id}`)}
        onEdit={(blog) => router.push(`/${locale}/admin/blogs/${blog.id}/edit`)}
        onDelete={(blog) => handleDelete(blog.id)}
        bulkActions={[
          {
            label: "Delete Selected",
            variant: "destructive",
            icon: <Trash2 className="h-3.5 w-3.5" />,
            onClick: async (selectedBlogs) => {
              if (confirm(`Delete ${selectedBlogs.length} selected blogs?`)) {
                await Promise.all(selectedBlogs.map((b) => deleteBlog.mutateAsync(b.id)));
              }
            },
          },
        ]}
      />
    </div>
  );
}