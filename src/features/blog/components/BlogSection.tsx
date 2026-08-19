"use client";

import { usePublishedBlogs } from "../hooks/useBlog";
import { BlogCard } from "./BlogCard";
import { SectionEngine } from "@/shared/components/sections/SectionEngine";
import { Blog } from "../types/blog.types";

export function BlogSection() {
  const { data, isLoading, error } = usePublishedBlogs();

  return (
    <SectionEngine<Blog>
      data={data}
      isLoading={isLoading}
      error={error}
      searchKey="title"
      searchPlaceholder="Filter blogs by keyword..."
      searchVariant="capsule" // 'default' | 'capsule' | 'glass' | 'solid' | 'underline'
      filters={[
        {
          key: "categories",
          placeholder: "Category",
          type: "single-pill", // 'single-pill' | 'multi-pill' | 'select'
        },
      ]}
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