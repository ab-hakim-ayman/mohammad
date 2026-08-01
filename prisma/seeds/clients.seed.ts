import { PrismaClient, Status } from "@prisma/client";
import { CLIENTS, slugify } from "./seed-data";

export default async function seedClients(prisma: PrismaClient) {
  console.log("Seeding Clients...");

  await prisma.client.createMany({
    data: CLIENTS.map((client, index) => ({
      title: client.title,
      slug: slugify(client.title),
      shortDesc: `${client.title} client profile.`,
      logo: client.logo,
      heroImage: `/seed/clients/client-hero-${String(index + 1).padStart(2, "0")}.jpg`,
      ogImage: `/seed/clients/client-og-${String(index + 1).padStart(2, "0")}.jpg`,
      website: client.website,
      isFeatured: index < 5,
      order: index + 1,
      status: Status.PUBLISHED,
    })),
  });
}
