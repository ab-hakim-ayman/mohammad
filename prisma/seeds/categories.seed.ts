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
      { title: "Developer Tools", slug: "developer-tools", scope: CategoryScope.TOOL, shortDesc: "Utilities and helpers for software developers.", order: 1, status: Status.PUBLISHED },
      { title: "Encoding & Decoding", slug: "encoding-decoding", scope: CategoryScope.TOOL, shortDesc: "Base64, URL, HTML, and data encoding tools.", order: 2, status: Status.PUBLISHED },
      { title: "Security & Crypto", slug: "security-crypto", scope: CategoryScope.TOOL, shortDesc: "JWT inspect, password, hash, and crypto tools.", order: 3, status: Status.PUBLISHED },
      { title: "Formatters & Validators", slug: "formatters-validators", scope: CategoryScope.TOOL, shortDesc: "JSON, SQL, CSV formatters and syntax validators.", order: 4, status: Status.PUBLISHED },
      { title: "Generators", slug: "generators", scope: CategoryScope.TOOL, shortDesc: "UUID, NanoID, Password, and dummy data generators.", order: 5, status: Status.PUBLISHED },
      { title: "Converters", slug: "converters", scope: CategoryScope.TOOL, shortDesc: "Case, number base, and data format converters.", order: 6, status: Status.PUBLISHED },
      { title: "General Utility", slug: "general-utility", scope: CategoryScope.TOOL, shortDesc: "General productivity and system utility tools.", order: 7, status: Status.PUBLISHED },
    ],
  });
}
