import { PrismaClient, Status } from "@prisma/client";
import { TOPICS, buildImage, cycle } from "./seed-data";

export default async function seedBlogs(prisma: PrismaClient, users?: Array<{ id: string }>) {
  console.log("Seeding Blogs...");

  if (!users?.length) return;

  await prisma.blog.createMany({
    data: TOPICS.map((topic, index) => ({
      title: `${topic.title} Playbook`,
      slug: `${topic.slug}-playbook`,
      excerpt: `Practical guidance for ${topic.title.toLowerCase()}.`,
      contentJson: {
        blocks: [
          {
            type: "paragraph",
            content: `A seeded editorial post about ${topic.title.toLowerCase()}.`,
          },
        ],
      },
      cardImage: buildImage("blogs", topic.slug),
      heroImage: buildImage("blogs", `${topic.slug}-hero`),
      galleryImages: [buildImage("blogs", `${topic.slug}-gallery`)],
      ogImage: buildImage("blogs", `${topic.slug}-og`),
      readTime: 4 + index,
      status: cycle([Status.PUBLISHED, Status.DRAFT, Status.ARCHIVED], index),
      isFeatured: index < 5,
      publishedAt: index % 3 === 0 ? new Date(2024, index % 12, 5) : null,
      archivedAt: index % 3 === 2 ? new Date(2024, index % 12, 25) : null,
      seoTitle: `${topic.title} Guide`,
      seoDescription: `Guide about ${topic.title.toLowerCase()}.`,
      createdById: users[index % users.length].id,
      updatedById: users[(index + 1) % users.length].id,
    })),
  });
}
