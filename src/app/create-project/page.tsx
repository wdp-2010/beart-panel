import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { BreadcrumbCreate } from "@/components/breadcrumb-create"
import { Header } from "@/components/header"

import { PROJECT_DRAFT_COOKIE } from "./actions"
import { CreateProjectWizard } from "./create-project-wizard"

export const dynamic = "force-dynamic"

function readProjectDraft(value?: string) {
  if (!value) return undefined

  try {
    const draft = JSON.parse(decodeURIComponent(value))

    if (!draft || typeof draft !== "object") return undefined

    return {
      name: typeof draft.name === "string" ? draft.name : "",
      description:
        typeof draft.description === "string" ? draft.description : "",
      status:
        draft.status === "COMPLETED" || draft.status === "ARCHIVED"
          ? draft.status
          : "ACTIVE",
    }
  } catch {
    return undefined
  }
}

export default async function CreateProjectPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const draft = readProjectDraft(
    (await cookies()).get(PROJECT_DRAFT_COOKIE)?.value
  )

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header
        session={session}
        variant="page"
        title="Create New Project"
        showUserMenu
      />
      <BreadcrumbCreate />
      <CreateProjectWizard initialDraft={draft} />
    </main>
  )
}
