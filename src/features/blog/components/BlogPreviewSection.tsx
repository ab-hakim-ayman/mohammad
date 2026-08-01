"use client";

import { useMemo } from "react";
import { PreviewSectionHeader } from "@/shared/components";
import { Skeleton } from "@/components/ui/skeleton";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BlogCard } from "./BlogCard";
import { usePublishedBlogs } from "../hooks/useBlog";
import type { Blog } from "../types/blog.types";

const sectionVariants = cva("relative w-full transition-all duration-500 overflow-hidden", {
  variants: {
    variant: {
      classic: "bg-transparent",
      glassmorphic: "bg-transparent",
      brutalist: "bg-transparent",
      "gradient-glow": "bg-transparent",
      minimal: "bg-transparent",
    },
    size: {
      sm: "py-6",
      default: "py-12",
      lg: "py-16",
    },
  },
  defaultVariants: {
    variant: "classic",
    size: "default",
  },
});

// 🎯 ১. এখানে items এবং অন্যান্য কাস্টম প্রপ্স ডিফাইন করা হয়েছে
interface BlogPreviewSectionProps extends VariantProps<typeof sectionVariants> {
  limit?: number;
  featured?: boolean;

  // 🟢 কাস্টম ব্লগ ডাটা পাস করার প্রপ্স
  items?: Blog[] | any[];
  blogs?: Blog[] | any[];

  // 🟢 কাস্টম হেডার কনফিগারেশন প্রপ্স
  eyebrow?: string;
  title?: string;
  description?: string;
  href?: string;
  ctaLabel?: string;
  hideHeader?: boolean;
}

export function BlogPreviewSection({
  limit = 4,
  featured = false,
  items: externalItems,
  blogs: legacyBlogs,
  eyebrow = "Insights Engine",
  title = "Latest updates & engineering logs",
  description = "Practical knowledge, architectural workflows, and perspectives from our core architecture team.",
  href = "/blogs",
  ctaLabel = "All posts",
  variant = "classic",
  size,
  hideHeader = false,
}: BlogPreviewSectionProps) {
  const requestedLimit = Math.max(limit, 1);
  const initialItems = externalItems || legacyBlogs;

  // 🎯 ২. বাইর থেকে items পাঠালে API ফেচ সম্পূর্ণ স্কিপ হবে
  const shouldFetch = !initialItems;

  const { data, isLoading: isApiLoading, error } = usePublishedBlogs(
    shouldFetch ? { page: 1, limit: requestedLimit } : undefined
  );

  const blogs = useMemo<any[]>(() => {
    if (initialItems) {
      return [...initialItems].slice(0, requestedLimit);
    }

    const rawList = (data?.data?.data || (Array.isArray(data) ? data : [])) as any[];
    return [...rawList].slice(0, requestedLimit);
  }, [initialItems, data, requestedLimit]);

  const isLoading = shouldFetch && isApiLoading;

  if (isLoading) {
    return (
      <section className={cn("relative w-full px-4 sm:px-6", sectionVariants({ variant, size }))}>
        <div className="container-custom mx-auto w-full">
          {!hideHeader && (
            <div className="mb-10 flex w-full flex-col items-center justify-center space-y-3 text-center">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-9 w-64 rounded-lg" />
            </div>
          )}

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: Math.min(requestedLimit, 4) }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-[380px] w-full shrink-0 rounded-xl"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 🎯 ৩. ডাটা না থাকলে পুরো সেকশন হাইড থাকবে
  if ((shouldFetch && error) || blogs.length === 0) return null;

  return (
    <section
      className={cn(
        "bg-background text-foreground relative w-full overflow-hidden px-4 transition-all duration-300 sm:px-6",
        sectionVariants({ variant, size })
      )}
    >
      <div className="container-custom mx-auto w-full">
        {!hideHeader && (
          <div className="mb-10 flex w-full flex-col items-center justify-center text-center">
            <PreviewSectionHeader
              variant="center"
              eyebrow={eyebrow}
              title={title}
              description={description}
              href={href}
              ctaLabel={ctaLabel}
            />
          </div>
        )}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {blogs.map((blog, index) => (
            <BlogCard
              key={blog.id ? String(blog.id) : index}
              blog={blog}
              variant="classic"
              layout="vertical"
              className="w-full shadow-xs"
            />
          ))}
        </div>
      </div>
    </section>
  );
}