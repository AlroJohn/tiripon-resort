import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { prisma } from "@/lib/prisma";

const adminEmail = "admin@tiriponresort.com";
const adminName = "Administrator";
const defaultPassword = "admin123";

function loadEnvFile() {
  const envPath = join(process.cwd(), ".env");

  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    process.env[key] ??= value;
  }
}

function getConnectionString() {
  loadEnvFile();

  const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DIRECT_URL or DATABASE_URL is required to seed the database.");
  }

  return connectionString;
}


async function main() {
  const password = await bcrypt.hash(defaultPassword, 10);

  const administrator = await prisma.administrator.upsert({
    where: {
      email: adminEmail,
    },
    update: {
      name: adminName,
      password,
    },
    create: {
      email: adminEmail,
      name: adminName,
      password,
    },
  });

  console.log(`Seeded administrator: ${administrator.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
