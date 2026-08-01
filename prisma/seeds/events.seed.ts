import { EventFormat, PrismaClient, Status } from "@prisma/client";
import { TOPICS, buildImage } from "./seed-data";

export default async function seedEvents(prisma: PrismaClient) {
  console.log("Seeding Events...");

  await prisma.event.createMany({
    data: TOPICS.map((topic, index) => ({
      title: `${topic.title} Meetup`,
      slug: `${topic.slug}-meetup`,
      shortDesc: `${topic.title} community event and knowledge share session.`,
      contentJson: {
        blocks: [{ type: "paragraph", content: `Event details for ${topic.title.toLowerCase()}.` }],
      },
      cardImage: buildImage("events", topic.slug),
      heroImage: buildImage("events", `${topic.slug}-hero`),
      ogImage: buildImage("events", `${topic.slug}-og`),
      startsAt: new Date(
        new Date("2024-01-01T12:00:00.000Z").getTime() + index * 14 * 24 * 60 * 60 * 1000
      ),
      endsAt: new Date(
        new Date("2024-01-01T12:00:00.000Z").getTime() + (index * 14 + 1) * 24 * 60 * 60 * 1000
      ),
      timeZone: "Asia/Dhaka",
      format:
        index % 3 === 0
          ? EventFormat.ONLINE
          : index % 3 === 1
            ? EventFormat.OFFLINE
            : EventFormat.HYBRID,
      location: index % 2 === 0 ? "Dhaka, Bangladesh" : "Online",
      meetingUrl: index % 2 === 1 ? `https://meet.example.com/${topic.slug}` : null,
      registrationUrl: `https://events.example.com/${topic.slug}`,
      isFree: index % 3 !== 0,
      isFeatured: index < 4,
      order: index + 1,
      status: Status.PUBLISHED,
    })),
  });
}
