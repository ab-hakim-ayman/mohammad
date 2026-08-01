import { PrismaClient, Status } from "@prisma/client";
import { INDUSTRIES, buildImage } from "./seed-data";

export default async function seedIndustries(prisma: PrismaClient) {
  console.log("Seeding Industries...");

  await prisma.industry.createMany({
    data: INDUSTRIES.map((industry, index) => ({
      title: industry.title,
      slug: industry.slug,
      shortDesc: industry.shortDesc,
      contentJson: {
        blocks: [{ type: "paragraph", content: industry.shortDesc }],
      },
      icon: buildImage("industries", `${industry.slug}-icon`, "svg"),
      cardImage: buildImage("industries", industry.slug),
      heroImage: buildImage("industries", `${industry.slug}-hero`),
      ogImage: buildImage("industries", `${industry.slug}-og`),
      isFeatured: index < 2,
      order: index + 1,
      status: Status.PUBLISHED,
    })),
  });
}
