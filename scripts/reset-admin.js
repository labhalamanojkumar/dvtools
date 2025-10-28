#!/usr/bin/env node
/*
  scripts/reset-admin.js
  Usage:
    # ensure .env has DATABASE_URL and optionally ADMIN_EMAIL/ADMIN_PASSWORD
    node scripts/reset-admin.js

  This script will upsert the admin user with the email and password from env
  (or defaults) and hash the password with bcrypt. It uses the Prisma client.
*/

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

async function main() {
  const prisma = new PrismaClient();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@devtools.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  try {
    const hashed = await bcrypt.hash(adminPassword, 10);

    const user = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: hashed,
        role: "SUPERADMIN",
        status: "ACTIVE",
      },
      create: {
        email: adminEmail,
        name: "Super Admin",
        password: hashed,
        role: "SUPERADMIN",
        status: "ACTIVE",
      },
    });

    console.log("Admin user upserted:", user.email);
  } catch (err) {
    console.error("Failed to upsert admin user:", err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
