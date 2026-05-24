import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Project",
  description: "Create a new project in the Beart Panel dashboard.",
}

export default function CreateProjectPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold">Create a New Project</h1>
        <p className="mt-4 text-lg">This is where you can create a new project. (Form implementation coming soon!)</p>
      </div>
    </main>
  )
}