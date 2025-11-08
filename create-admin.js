#!/usr/bin/env node
/*
  Temporary script to create admin user
*/

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

async function main() {
  const prisma = new PrismaClient();

  const adminEmail = "admin@dvtools.in"; // From .env
  const adminPassword = "Admin@123"; // From .env

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

    console.log("Admin user created/updated:", user.email, "with role:", user.role);
  } catch (err) {
    console.error("Failed to create admin user:", err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();