import { PrismaClient, Status } from "@prisma/client";
import { PARTNERS } from "./seed-data";

export default async function seedPartners(prisma: PrismaClient) {
  console.log("Seeding Partners...");

  await prisma.partner.createMany({
    data: PARTNERS.map((partner, index) => ({
      title: partner.title,
      shortDesc: partner.shortDesc,
      logo: partner.logo,
      website: partner.website,
      type: partner.type,
      isFeatured: index < 4,
      order: index + 1,
      status: Status.PUBLISHED,
    })),
  });
}
