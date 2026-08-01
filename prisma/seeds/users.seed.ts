import { PrismaClient } from "@prisma/client";

export default async function seedUsers(prisma: PrismaClient) {
  console.log("Seeding Users...");
  // Users and profiles are seeded by seedUsersAndProfiles in full-dataset.seed.ts
}
