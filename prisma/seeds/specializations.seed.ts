import { PrismaClient, Status } from "@prisma/client";
import { TOPICS, buildImage } from "./seed-data";

export default async function seedSpecializations(prisma: PrismaClient) {
  console.log("Seeding Specializations...");

  await prisma.specialization.createMany({
    data: TOPICS.map((topic, index) => ({
      title: `${topic.title} Specialization`,
      slug: `${topic.slug}-specialization`,
      shortDesc: topic.shortDesc,
      contentJson: {
        blocks: [
          {
            type: "paragraph",
            content: `Specialization details for ${topic.title.toLowerCase()}.`,
          },
        ],
      },
      icon: buildImage("specializations", topic.slug, "svg"),
      cardImage: buildImage("specializations", topic.slug),
      heroImage: buildImage("specializations", `${topic.slug}-hero`),
      galleryImages: [buildImage("specializations", `${topic.slug}-gallery`)],
      ogImage: buildImage("specializations", `${topic.slug}-og`),
      isFeatured: index < 5,
      status: Status.PUBLISHED,
      order: index + 1,
    })),
  });
}
