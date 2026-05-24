// src/auth.ts

import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import prisma from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login", // Your custom login page route
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) return null

        const isValid = await compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          image: user.image,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            name: true,
            image: true,
            role: true,
          },
        })

        if (user) {
          session.user.id = token.sub
          session.user.name = user.name
          session.user.image = user.image
          session.user.role = user.role
          return session
        }

        session.user.id = token.sub
        session.user.role = token.role ?? session.user.role
      }
      return session
    },
  },
})