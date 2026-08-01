import { PrismaClient, ContactStatus } from "@prisma/client";
import { TOTAL, TOPICS, cycle } from "./seed-data";

export default async function seedContacts(prisma: PrismaClient) {
  console.log("Seeding Contacts...");

  await prisma.contact.createMany({
    data: Array.from({ length: TOTAL }, (_, index) => ({
      name: `Lead ${index + 1}`,
      email: `lead${String(index + 1).padStart(2, "0")}@example.com`,
      subject: `Inquiry about ${cycle(TOPICS, index).title}`,
      message: `We are interested in your ${cycle(TOPICS, index).title} services.`,
      phone: `+1 (555) 000-${String(index).padStart(4, "0")}`,
      status:
        index === 14
          ? ContactStatus.ARCHIVED
          : index % 3 === 0
            ? ContactStatus.REPLIED
            : index % 2 === 0
              ? ContactStatus.READ
              : ContactStatus.NEW,
      repliedAt: index % 3 === 0 ? new Date(2024, index % 12, 10) : null,
      archivedAt: index === 14 ? new Date(2024, 11, 31) : null,
    })),
  });
}
