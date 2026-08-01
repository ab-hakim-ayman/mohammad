import prisma from "../src/core/server/prisma";
import { seedAllModels } from "./seeds/full-dataset.seed";

async function main() {
  console.log("Starting seed...");
  await seedAllModels(prisma);
  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
