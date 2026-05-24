"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

import { auth } from "@/auth"
import { ProjectStatus } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"

export const PROJECT_DRAFT_COOKIE = "beart:create-project-draft"

const projectSchema = z.object({
  name: z.string().trim().min(2, "Give the project a clear name."),
  description: z
    .string()
    .trim()
    .max(800, "Keep the description under 800 characters.")
    .optional(),
  status: z.enum(ProjectStatus),
})

export type CreateProjectState = {
  message?: string
  errors?: {
    name?: string[]
    description?: string[]
    status?: string[]
  }
}

export async function createProject(
  _previousState: CreateProjectState,
  formData: FormData
): Promise<CreateProjectState> {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      message: "You need to be logged in before creating a project.",
    }
  }

  const validated = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    status: formData.get("status"),
  })

  if (!validated.success) {
    return {
      message: "Check the highlighted project details.",
      errors: validated.error.flatten().fieldErrors,
    }
  }

  const project = await prisma.project.create({
    data: {
      name: validated.data.name,
      description: validated.data.description || null,
      status: validated.data.status,
      ownerId: session.user.id,
    },
    select: {
      id: true,
    },
  })

  ;(await cookies()).delete(PROJECT_DRAFT_COOKIE)
  redirect(`/dashboard?project=${project.id}`)
}
