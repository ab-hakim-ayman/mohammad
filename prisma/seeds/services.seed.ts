import { PrismaClient, Status } from "@prisma/client";
import { TOPICS, buildImage } from "./seed-data";

export default async function seedServices(prisma: PrismaClient, users?: Array<{ id: string }>) {
  console.log("Seeding Services...");

  if (!users?.length) return;

  await prisma.service.createMany({
    data: TOPICS.map((topic, index) => ({
      title: `${topic.title} Service`,
      slug: `${topic.slug}-service`,
      shortDesc: topic.shortDesc,
      contentJson: {
        blocks: [
          {
            type: "paragraph",
            content: `Service package focused on ${topic.title.toLowerCase()} delivery.`,
          },
        ],
      },
      icon: buildImage("services", topic.slug, "svg"),
      cardImage: buildImage("services", topic.slug),
      heroImage: buildImage("services", `${topic.slug}-hero`),
      galleryImages: [buildImage("services", `${topic.slug}-gallery`)],
      ogImage: buildImage("services", `${topic.slug}-og`),
      order: index + 1,
      status: Status.PUBLISHED,
      createdById: users[index % users.length].id,
      updatedById: users[(index + 1) % users.length].id,
    })),
  });
}
