import { CategoryScope, PrismaClient, Status } from "@prisma/client";
import { TOPICS } from "./seed-data";

export default async function seedCategories(prisma: PrismaClient) {
  console.log("Seeding Categories...");

  await prisma.category.createMany({
    data: [
      ...TOPICS.map((topic, index) => ({
        title: topic.title,
        slug: topic.slug,
        scope: CategoryScope.BLOG,
        shortDesc: `Everything about ${topic.title.toLowerCase()} and related practices.`,
        order: index + 1,
        status: Status.PUBLISHED,
      })),
      ...TOPICS.map((topic, index) => ({
        title: topic.title,
        slug: topic.slug,
        scope: CategoryScope.PROJECT,
        shortDesc: `Project work related to ${topic.title.toLowerCase()}.`,
        order: index + 1,
        status: Status.PUBLISHED,
      })),
    ],
  });
}
