import { AchievementType, PrismaClient, Status } from "@prisma/client";
import { ACHIEVEMENTS, slugify } from "./seed-data";

function getAchievementType(index: number): AchievementType {
  const types: AchievementType[] = [
    AchievementType.AWARD,
    AchievementType.CERTIFICATION,
    AchievementType.RECOGNITION,
    AchievementType.MILESTONE,
    AchievementType.OTHER,
  ];
  return types[index % types.length];
}

export default async function seedAchievements(prisma: PrismaClient) {
  console.log("Seeding Achievements...");

  await prisma.achievement.createMany({
    data: ACHIEVEMENTS.map((achievement, index) => ({
      title: achievement.title,
      slug: slugify(achievement.title),
      type: getAchievementType(index),
      issuer: achievement.issuer,
      achievedAt: achievement.achievedAt,
      shortDesc: achievement.shortDesc,
      contentJson: {
        blocks: [{ type: "paragraph", content: achievement.shortDesc }],
      },
      icon: achievement.icon,
      image: achievement.image,
      cardImage: achievement.image,
      heroImage: achievement.image,
      certificateUrl: `/seed/achievements/certificate-${String(index + 1).padStart(2, "0")}.pdf`,
      ogImage: achievement.image,
      isFeatured: index < 5,
      order: index + 1,
      status: Status.PUBLISHED,
    })),
  });
}
