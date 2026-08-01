import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};
const isProduction = process.env.NODE_ENV === "production";
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL!,
    max: isProduction ? 5 : 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool;
}

const adapter = new PrismaPg(pool);

function createPrismaClient() {
  return new PrismaClient({
    adapter,
  });
}

function hasExpectedDelegates(client: PrismaClient) {
  return "siteInfo" in client;
}

export const prisma = (() => {
  const cached = globalForPrisma.prisma;

  if (cached && hasExpectedDelegates(cached)) {
    return cached;
  }

  const client = createPrismaClient();
  return client;
})();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
