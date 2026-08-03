import { PrismaClient, Status } from "@prisma/client";
import { TOPICS, buildImage } from "./seed-data";

export default async function seedHeroes(prisma: PrismaClient, users?: Array<{ id: string }>) {
  console.log("Seeding Heroes...");

  if (!users || users.length < 2) return;

  await prisma.hero.createMany({
    data: TOPICS.map((topic, index) => ({
      key: index === 0 ? "main" : `hero-${String(index + 1).padStart(2, "0")}`,
      title: `Build ${topic.title}`,
      shortDesc: `${topic.title} for modern teams`,
      heroImage: buildImage("heroes", topic.slug),
      heroVideoUrl: index % 5 === 0 ? "https://www.youtube.com/watch?v=dQw4w9WgXcQ" : null,
      ctaText: "Start a project",
      ctaLink: "/contact",
      secondaryCtaText: "View case studies",
      secondaryCtaLink: "/case-studies",
      status: index < 3 ? Status.PUBLISHED : Status.DRAFT,
      isActive: index === 0,
      order: index + 1,
      publishedAt: index < 3 ? new Date("2024-01-01T12:00:00.000Z") : null,
      createdById: users[0].id,
      updatedById: users[1].id,
    })),
  });
}
