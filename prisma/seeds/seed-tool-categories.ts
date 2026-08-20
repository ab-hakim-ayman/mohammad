import dotenv from "dotenv";
dotenv.config();

import { CategoryScope, Status } from "@prisma/client";

const defaultToolCategories = [
  { title: "Developer Tools", slug: "developer-tools", shortDesc: "Utilities and helpers for software developers." },
  { title: "Encoding & Decoding", slug: "encoding-decoding", shortDesc: "Base64, URL, HTML, and data encoding tools." },
  { title: "Security & Crypto", slug: "security-crypto", shortDesc: "JWT inspect, password, hash, and crypto tools." },
  { title: "Formatters & Validators", slug: "formatters-validators", shortDesc: "JSON, SQL, CSV formatters and syntax validators." },
  { title: "Generators", slug: "generators", shortDesc: "UUID, NanoID, Password, and dummy data generators." },
  { title: "Converters", slug: "converters", shortDesc: "Case, number base, and data format converters." },
  { title: "General Utility", slug: "general-utility", shortDesc: "General productivity and system utility tools." },
];

export async function seedToolCategories() {
  const { default: prisma } = await import("../../src/core/server/prisma");

  console.log("Seeding Tool Categories...");

  const categoryMap = new Map<string, string>();

  for (const cat of defaultToolCategories) {
    const existing = await prisma.category.findFirst({
      where: { scope: CategoryScope.TOOL, slug: cat.slug },
    });

    if (existing) {
      categoryMap.set(cat.slug, existing.id);
      console.log(`Category exists: ${existing.title} (${existing.id})`);
    } else {
      const created = await prisma.category.create({
        data: {
          title: cat.title,
          slug: cat.slug,
          scope: CategoryScope.TOOL,
          shortDesc: cat.shortDesc,
          status: Status.PUBLISHED,
          order: 1,
        },
      });
      categoryMap.set(cat.slug, created.id);
      console.log(`Created Category: ${created.title} (${created.id})`);
    }
  }

  // Connect all existing tools to default categories
  const tools = await prisma.tool.findMany({
    include: { categories: true },
  });

  console.log(`Found ${tools.length} tools in database.`);

  const defaultCatId = categoryMap.get("developer-tools");

  for (const tool of tools) {
    if (tool.categories.length === 0 && defaultCatId) {
      await prisma.tool.update({
        where: { id: tool.id },
        data: {
          categories: {
            connect: { id: defaultCatId },
          },
        },
      });
      console.log(`Connected tool "${tool.title}" to Developer Tools category.`);
    }
  }

  console.log("Tool categories seeding complete!");
  await prisma.$disconnect();
}

seedToolCategories().catch((e) => {
  console.error(e);
  process.exit(1);
});
