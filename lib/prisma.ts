import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import os from "os";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl() {
  const base =
    process.env.APPDATA ||
    path.join(os.homedir(), "AppData", "Roaming");

  const dir = path.join(base, "CityShopCentre");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const dbPath = path.join(dir, "dev.db");

  return `file:${dbPath}`;
}

function createPrismaClient() {
  return new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;