import type { Metadata } from "next"
import { auth } from "@/auth"

import { Header } from "@/components/header"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Beart Panel dashboard home.",
}

export default async function DashboardPage() {
  const session = await auth()


  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header variant="welcome" session={session} showCreateButton showUserMenu />
    </main>
  )
}