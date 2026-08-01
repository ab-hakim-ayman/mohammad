import packageJson from "../../../../package.json";
import { prisma } from "@/core/server/prisma";

const bootTime = Date.now();

export type PublicHealthData = {
  status: "ok" | "degraded";
  service: string;
  version: string;
  environment: string;
  uptimeSeconds: number;
  checkedAt: string;
  checks: {
    api: "up";
    database: "up" | "down";
  };
};

export async function getPublicHealth(): Promise<PublicHealthData> {
  const checkedAt = new Date().toISOString();

  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      status: "ok",
      service: "a2icoders-public-api",
      version: packageJson.version,
      environment: process.env.NODE_ENV ?? "development",
      uptimeSeconds: Math.floor((Date.now() - bootTime) / 1000),
      checkedAt,
      checks: {
        api: "up",
        database: "up",
      },
    };
  } catch {
    return {
      status: "degraded",
      service: "a2icoders-public-api",
      version: packageJson.version,
      environment: process.env.NODE_ENV ?? "development",
      uptimeSeconds: Math.floor((Date.now() - bootTime) / 1000),
      checkedAt,
      checks: {
        api: "up",
        database: "down",
      },
    };
  }
}
