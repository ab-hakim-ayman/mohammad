import { PrismaClient, Status } from "@prisma/client";
import { TECH_STACK, slugify } from "./seed-data";

export default async function seedTags(prisma: PrismaClient) {
  console.log("Seeding Tags...");

  await prisma.tag.createMany({
    data: TECH_STACK.map((tech) => ({
      title: tech.title,
      slug: slugify(tech.title),
      shortDesc: `${tech.title} related content tag.`,
      status: Status.PUBLISHED,
    })),
  });
}
