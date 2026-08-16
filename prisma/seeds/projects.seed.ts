import { PrismaClient, Status } from "@prisma/client";
import { TOPICS, buildDate, buildImage, cycle } from "./seed-data";

export default async function seedProjects(
  prisma: PrismaClient,
  users?: Array<{ id: string }>
) {
  console.log("Seeding Projects...");

  if (!users?.length) return;

  await prisma.project.createMany({
    data: TOPICS.map((topic, index) => ({
      title: `${topic.title} Platform`,
      slug: `${topic.slug}-platform`,
      shortDesc: `Platform build for ${topic.title.toLowerCase()}.`,
      contentJson: {
        blocks: [
          {
            type: "paragraph",
            content: `A product experience designed for ${topic.title.toLowerCase()} delivery.`,
          },
        ],
      },
      cardImage: buildImage("projects", topic.slug),
      heroImage: buildImage("projects", `${topic.slug}-hero`),
      galleryImages: [
        buildImage("projects", `${topic.slug}-1`),
        buildImage("projects", `${topic.slug}-2`),
      ],
      demoVideoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      ogImage: buildImage("projects", `${topic.slug}-og`),
      githubUrl: `https://github.com/a2icoders/${topic.slug}`,
      liveUrl: `https://${topic.slug}.example.com`,
      startDate: buildDate(2023, index % 12, 1),
      endDate: buildDate(2024, index % 12, 15),
      status: cycle([Status.DRAFT, Status.PUBLISHED, Status.ARCHIVED], index),
      isFeatured: index < 5,
      publishedAt: index % 3 === 1 ? new Date(2024, index % 12, 1) : null,
      archivedAt: index % 3 === 2 ? new Date(2024, index % 12, 20) : null,
      order: index + 1,
      createdById: users[index % users.length].id,
      updatedById: users[(index + 1) % users.length].id,
    })),
  });
}
