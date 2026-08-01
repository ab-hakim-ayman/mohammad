"use client";

import { useMemo } from "react";
import { usePublishedBlogs } from "../hooks/useBlog";
import { BlogCard } from "./BlogCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Blog } from "../types/blog.types";

export function BlogSection() {
  const { data, isLoading, error } = usePublishedBlogs();

  const blogs = useMemo<Blog[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return data.data?.data || data.data || [];
  }, [data]);

  const filters = useMemo(() => {
    const list = new Set<string>();
    blogs.forEach((blog) => {
      blog.categories?.forEach((cat) => {
        if (cat.title) list.add(cat.title);
      });
    });

    if (list.size === 0) return [];

    return [
      {
        key: "categories",
        placeholder: "Category",
        options: Array.from(list).map((cat) => ({ label: cat, value: cat })),
      },
    ];
  }, [blogs]);

  return (
    <SectionEngine<Blog>
      data={data}
      isLoading={isLoading}
      error={error}
      searchKey="title"
      searchPlaceholder="Filter blogs by keyword..."
      filters={filters}
      renderCard={(blog) => (
        <BlogCard
          blog={blog}
          variant="classic"
          size="md"
          className="h-full w-full"
        />
      )}
    />
  );
}