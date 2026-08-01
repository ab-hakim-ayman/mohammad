import { PrismaClient, Status } from "@prisma/client";
import { GALLERY_TITLES, buildImage, slugify } from "./seed-data";

export default async function seedGalleries(prisma: PrismaClient) {
  console.log("Seeding Galleries...");

  await prisma.gallery.createMany({
    data: GALLERY_TITLES.map((title, index) => ({
      title,
      slug: slugify(title),
      shortDesc: `${title} showcase for the A2ICoders portfolio site.`,
      contentJson: {
        blocks: [{ type: "paragraph", content: `${title} gallery narrative.` }],
      },
      coverImage: buildImage("galleries", slugify(title)),
      ogImage: buildImage("galleries", `${slugify(title)}-og`),
      order: index + 1,
      status: Status.PUBLISHED,
    })),
  });
}
