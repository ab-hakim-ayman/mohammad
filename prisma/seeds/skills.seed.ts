import { PrismaClient, Status, CategoryScope } from "@prisma/client";
import { TECH_STACK, buildImage, slugify } from "./seed-data";

export default async function seedSkills(prisma: PrismaClient) {
  console.log("Seeding Skills...");

  // Since we want to build relations, we loop and create skills individually
  for (const tech of TECH_STACK) {
    const category = await prisma.category.upsert({
      where: {
        scope_title: {
          scope: CategoryScope.SKILL,
          title: tech.category,
        },
      },
      update: {},
      create: {
        title: tech.category,
        slug: slugify(tech.category),
        scope: CategoryScope.SKILL,
        status: Status.PUBLISHED,
      },
    });

    await prisma.skill.upsert({
      where: { title: tech.title },
      update: {
        categories: {
          connect: { id: category.id },
        },
      },
      create: {
        title: tech.title,
        shortDesc: `${tech.category} skill with ${tech.experience} years of visible experience.`,
        icon: buildImage("skills", slugify(tech.title), "svg"),
        order: tech.experience,
        status: Status.PUBLISHED,
        categories: {
          connect: { id: category.id },
        },
      },
    });
  }
}
