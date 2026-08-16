import { MetadataRoute } from "next";
import prisma from "@/core/server/prisma";
import { locales } from "@/shared/i18n";

function getBaseUrl() {
  return (
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
}

function localizePath(path: string) {
  return locales.map((locale) => `/${locale}${path}`);
}

function createEntries(
  baseUrl: string,
  paths: string[],
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
  lastModified: Date
): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  let blogs: any[] = [];
  let projects: any[] = [];
  let categories: any[] = [];
  let tags: any[] = [];
  let galleries: any[] = [];

  try {
    const [
      blogsData,
      projectsData,
      categoriesData,
      tagsData,
      galleriesData,
    ] = await Promise.all([
      prisma.blog.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true, publishedAt: true },
      }),
      prisma.project.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true, publishedAt: true },
      }),
      prisma.category.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.tag.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.gallery.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    blogs = blogsData;
    projects = projectsData;
    categories = categoriesData;
    tags = tagsData;
    galleries = galleriesData;
  } catch (error) {
    console.warn("Failed to fetch dynamic sitemap data during build, falling back to static routes only:", error);
  }

  const staticPaths = [
    ...localizePath(""),
    ...localizePath("/about"),
    ...localizePath("/services"),
    ...localizePath("/case-studies"),
    ...localizePath("/projects"),
    ...localizePath("/blogs"),
    ...localizePath("/contact"),
    ...localizePath("/technologies"),
    ...localizePath("/skills"),
    ...localizePath("/specializations"),
    ...localizePath("/testimonials"),
    ...localizePath("/achievements"),
    ...localizePath("/galleries"),
    ...localizePath("/faqs"),
    ...localizePath("/categories"),
    ...localizePath("/tags"),
    ...localizePath("/heroes"),
    ...localizePath("/site-infos"),
  ];

  const staticEntries = createEntries(baseUrl, staticPaths, "weekly", 0.75, now);

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...blogs.flatMap((item) =>
      createEntries(
        baseUrl,
        localizePath(`/blogs/${item.slug}`),
        "weekly",
        0.72,
        item.publishedAt || item.updatedAt
      )
    ),
    ...projects.flatMap((item) =>
      createEntries(
        baseUrl,
        localizePath(`/projects/${item.slug}`),
        "weekly",
        0.78,
        item.publishedAt || item.updatedAt
      )
    ),
    ...categories.flatMap((item) =>
      createEntries(
        baseUrl,
        localizePath(`/categories/${item.slug}`),
        "weekly",
        0.62,
        item.updatedAt
      )
    ),
    ...tags.flatMap((item) =>
      createEntries(baseUrl, localizePath(`/tags/${item.slug}`), "weekly", 0.58, item.updatedAt)
    ),

    ...galleries.flatMap((item) =>
      createEntries(
        baseUrl,
        localizePath(`/galleries/${item.slug}`),
        "monthly",
        0.63,
        item.updatedAt
      )
    ),
  ];

  return [...staticEntries, ...dynamicEntries];
}
