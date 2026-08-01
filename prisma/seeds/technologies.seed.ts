import { PrismaClient, Status } from "@prisma/client";
import { TECH_STACK, buildImage, slugify } from "./seed-data";

export default async function seedTechnologies(prisma: PrismaClient) {
  console.log("Seeding Technologies...");

  await prisma.technology.createMany({
    data: TECH_STACK.map((tech) => ({
      title: tech.title,
      shortDesc: `${tech.category} technology used across delivery.`,
      logo: buildImage("technologies", slugify(tech.title), "svg"),
      order: tech.experience,
      status: Status.PUBLISHED,
    })),
  });
}
