import { PrismaClient, Status } from "@prisma/client";
import { TOPICS, buildImage } from "./seed-data";

export default async function seedAbouts(prisma: PrismaClient, users?: Array<{ id: string }>) {
  console.log("Seeding Abouts...");

  if (!users || users.length < 2) return;

  await prisma.about.createMany({
    data: TOPICS.map((topic, index) => ({
      key: `topic-${topic.slug}`,
      title: `${topic.title} Overview`,
      shortDesc: topic.shortDesc,
      contentJson: {
        blocks: [
          {
            type: "paragraph",
            content: `We use ${topic.title.toLowerCase()} to help teams ship better software.`,
          },
        ],
      },
      heroImage: buildImage("abouts", topic.slug),
      galleryImages: [
        buildImage("abouts", `${topic.slug}-1`),
        buildImage("abouts", `${topic.slug}-2`),
      ],
      ogImage: buildImage("abouts", `${topic.slug}-og`),
      status: index === 0 ? Status.PUBLISHED : Status.DRAFT,
      publishedAt: index === 0 ? new Date("2024-01-01T12:00:00.000Z") : null,
      createdById: users[0].id,
      updatedById: users[1].id,
    })),
  });
}
