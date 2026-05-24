import type { Metadata } from "next"
import { auth } from "@/auth"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Beart Panel dashboard home.",
}

export default async function DashboardPage() {
  const session = await auth()

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
              Dashboard
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">Welcome{session?.user?.name ? `, ${session.user.name}` : ""}.</h1>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            This is the authenticated landing page. Build your overview, metrics, and workflow tools here.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Projects", "Create the first project overview card."],
            ["Documents", "Wire your document management surface."],
            ["Tasks", "Add task tracking and progress widgets."],
          ].map(([title, description]) => (
            <article key={title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}