import { PrismaClient, Status, TestimonialSource, TestimonialType } from "@prisma/client";
import { TESTIMONIALS, buildImage, slugify } from "./seed-data";

export default async function seedTestimonials(prisma: PrismaClient) {
  console.log("Seeding Testimonials...");

  await prisma.testimonial.createMany({
    data: TESTIMONIALS.map((testimonial, index) => ({
      message: `A2ICoders delivered a reliable experience for ${testimonial.company}.`,
      rating: 5 - (index % 2),
      type: TestimonialType.CLIENT,
      authorName: testimonial.name,
      authorPosition: `${testimonial.position}, ${testimonial.company}`,
      authorImage: buildImage("testimonials", slugify(testimonial.name)),
      source: TestimonialSource.ADMIN,
      status: Status.PUBLISHED,
      isFeatured: index < 5,
      order: index + 1,
      publishedAt: new Date(2024, index % 12, Math.min(28, 1 + index)),
    })),
  });
}
