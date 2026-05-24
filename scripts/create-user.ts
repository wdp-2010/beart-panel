#!/usr/bin/env tsx
/**
 * Create a user with a hashed password
 *
 * Usage:
 *   npx tsx scripts/create-user.ts
 *   npx tsx scripts/create-user.ts admin@example.com mypassword123
 *   npx tsx scripts/create-user.ts user@example.com secretpass --role ADMIN
 */

import "dotenv/config"
import { hash } from "bcrypt"
import prisma from "../src/lib/prisma"

const SALT_ROUNDS = 12

async function createUser() {
  const args = process.argv.slice(2)

  // Parse arguments
  const email = args[0] || "admin@beart-panel.com"
  const password = args[1] || "changeme123"
  const role = args.includes("--role") ? args[args.indexOf("--role") + 1] : "USER"

  console.log(`Creating user: ${email}`)
  console.log(`Role: ${role}`)

  // Hash the password
  const hashedPassword = await hash(password, SALT_ROUNDS)
  console.log("Password hashed successfully")

  try {
    // Create or update the user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: role as "USER" | "ADMIN",
      },
      create: {
        email,
        name: email.split("@")[0],
        password: hashedPassword,
        role: role as "USER" | "ADMIN",
      },
    })

    console.log("\n✅ User created successfully!")
    console.log(`   ID: ${user.id}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Role: ${user.role}`)
    console.log(`\nYou can now log in with:`)
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
  } catch (error) {
    console.error("\n❌ Failed to create user:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createUser()
