import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pool?: Pool;
  adapter?: PrismaPg;
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

const adapter = globalForPrisma.adapter ?? new PrismaPg(pool);

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    adapter,
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pool = pool;
  globalForPrisma.adapter = adapter;
  globalForPrisma.prisma = prisma;
}

export default prisma;

