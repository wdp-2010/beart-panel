#!/usr/bin/env tsx
/**
 * Seed the database with initial data
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 */

import "dotenv/config"
import { hash } from "bcrypt"
import prisma from "../src/lib/prisma"

const SALT_ROUNDS = 12

async function seed() {
  console.log("🌱 Seeding database...\n")

  // Create admin user
  const adminPassword = await hash("admin123", SALT_ROUNDS)
  const admin = await prisma.user.upsert({
    where: { email: "admin@beart-panel.com" },
    update: {},
    create: {
      email: "admin@beart-panel.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  })
  console.log("✅ Created admin user:", admin.email)

  // Create regular user
  const userPassword = await hash("user123", SALT_ROUNDS)
  const user = await prisma.user.upsert({
    where: { email: "user@beart-panel.com" },
    update: {},
    create: {
      email: "user@beart-panel.com",
      name: "Regular User",
      password: userPassword,
      role: "USER",
    },
  })
  console.log("✅ Created regular user:", user.email)

  // Create a sample project
  const project = await prisma.project.create({
    data: {
      name: "Sample Project",
      description: "A demo project to get you started",
      status: "ACTIVE",
      ownerId: admin.id,
    },
  })
  console.log("✅ Created project:", project.name)

  // Create sample tasks
  const tasks = await prisma.task.createMany({
    data: [
      {
        title: "Set up authentication",
        description: "Configure login and user management",
        status: "DONE",
        projectId: project.id,
        assigneeId: admin.id,
      },
      {
        title: "Create dashboard",
        description: "Build the main dashboard interface",
        status: "IN_PROGRESS",
        projectId: project.id,
        assigneeId: user.id,
      },
      {
        title: "Add document upload",
        description: "Implement PDF upload functionality",
        status: "TODO",
        projectId: project.id,
      },
    ],
  })
  console.log("✅ Created", tasks.count, "tasks")

  console.log("\n🎉 Seeding complete!")
  console.log("\nLogin credentials:")
  console.log("  Admin:  admin@beart-panel.com / admin123")
  console.log("  User:   user@beart-panel.com / user123")
}

seed()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
