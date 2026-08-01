import { PrismaClient, Status } from "@prisma/client";
import { FAQ_QUESTIONS } from "./seed-data";

export default async function seedFaqs(prisma: PrismaClient) {
  console.log("Seeding Faqs...");

  await prisma.faq.createMany({
    data: FAQ_QUESTIONS.map((question, index) => ({
      question,
      answer: `We answer ${question.toLowerCase()} with a focused, company-style delivery process.`,
      isFeatured: index < 5,
      order: index + 1,
      status: Status.PUBLISHED,
    })),
  });
}
