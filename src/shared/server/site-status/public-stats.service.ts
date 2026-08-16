import { prisma } from "@/core/server/prisma";

export type PublicStatsData = {
  overview: {
    publishedContent: number;
    activeBusinessRecords: number;
    activeShowcase: number;
    configuredBrandAssets: number;
    lastUpdatedAt: string | null;
  };
  entities: {
    projects: number;
    blogs: number;
    services: number;
    caseStudies: number;
    testimonials: number;
    technologies: number;
    skills: number;
    specializations: number;
    achievements: number;
    faqs: number;
    categories: number;
    tags: number;
    galleries: number;
    galleryItems: number;
    activeHero: number;
    siteInfos: number;
  };
};

export async function getPublicStats(): Promise<PublicStatsData> {
  const [
    projects,
    blogs,
    services,
    caseStudies,
    testimonials,
    technologies,
    skills,
    specializations,
    achievements,
    faqs,
    categories,
    tags,
    galleries,
    galleryItems,
    activeHero,
    siteInfos,
    latestProject,
    latestBlog,
    latestService,
    latestCaseStudy,
    latestTestimonial,
    latestTechnology,
    latestAchievement,
    latestGallery,
    latestSiteInfo,
  ] = await Promise.all([
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.blog.count({ where: { status: "PUBLISHED" } }),
    prisma.service.count({ where: { status: "PUBLISHED" } }),
    prisma.caseStudy.count({ where: { status: "PUBLISHED" } }),
    prisma.testimonial.count({ where: { status: "PUBLISHED" } }),
    prisma.technology.count({ where: { status: "PUBLISHED" } }),
    prisma.skill.count({ where: { status: "PUBLISHED" } }),
    prisma.specialization.count({ where: { status: "PUBLISHED" } }),
    prisma.achievement.count({ where: { status: "PUBLISHED" } }),
    prisma.faq.count({ where: { status: "PUBLISHED" } }),
    prisma.category.count({ where: { status: "PUBLISHED" } }),
    prisma.tag.count({ where: { status: "PUBLISHED" } }),
    prisma.gallery.count(),
    prisma.galleryItem.count({ where: { status: "PUBLISHED" } }),
    prisma.hero.count({ where: { status: "PUBLISHED", isActive: true } }),
    prisma.siteInfo.count(),
    prisma.project.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    prisma.blog.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    prisma.service.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    prisma.caseStudy.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    prisma.testimonial.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    prisma.technology.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    prisma.achievement.findFirst({
      where: { status: "PUBLISHED" },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    prisma.gallery.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
    prisma.siteInfo.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
  ]);

  const lastUpdatedAt =
    [
      latestProject?.updatedAt,
      latestBlog?.updatedAt,
      latestService?.updatedAt,
      latestCaseStudy?.updatedAt,
      latestTestimonial?.updatedAt,
      latestTechnology?.updatedAt,
      latestAchievement?.updatedAt,
      latestGallery?.updatedAt,
      latestSiteInfo?.updatedAt,
    ]
      .filter((value): value is Date => value instanceof Date)
      .sort((a, b) => b.getTime() - a.getTime())[0]
      ?.toISOString() ?? null;

  return {
    overview: {
      publishedContent:
        projects +
        blogs +
        services +
        caseStudies +
        testimonials +
        technologies +
        skills +
        specializations +
        achievements +
        faqs +
        categories +
        tags +
        galleries +
        galleryItems,
      activeBusinessRecords: 0,
      activeShowcase: projects + caseStudies + testimonials + galleryItems,
      configuredBrandAssets: activeHero + siteInfos,
      lastUpdatedAt,
    },
    entities: {
      projects,
      blogs,
      services,
      caseStudies,
      testimonials,
      technologies,
      skills,
      specializations,
      achievements,
      faqs,
      categories,
      tags,
      galleries,
      galleryItems,
      activeHero,
      siteInfos,
    },
  };
}
