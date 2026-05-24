import { Metadata } from "next"
import { LoginForm } from "@/components/login-form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to access the Beart Panel dashboard.",
}

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string }
}) {
  const callbackUrl = searchParams?.callbackUrl ?? "/dashboard"

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(24,24,27,0.08),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(24,24,27,0.12),_transparent_30%),linear-gradient(180deg,_#fafafa_0%,_#f4f4f5_100%)] px-4 py-8">
      <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-8 px-2 py-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/70 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Beart Panel
          </div>

          <div className="max-w-2xl space-y-5">
            <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
              A focused workspace for the dashboard you are about to build.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-muted-foreground">
              Sign in once, then move directly into the dashboard without losing your intended route.
            </p>
          </div>

          <div className="grid max-w-xl gap-4 sm:grid-cols-3">
            {[
              ["Protected", "Route-aware redirects keep auth flow intact."],
              ["Fast", "Login lands on the intended destination immediately."],
              ["Ready", "A dashboard route exists for your next build step."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-border/70 bg-white/75 p-4 shadow-sm backdrop-blur">
                <div className="text-sm font-semibold">{title}</div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="relative lg:justify-self-end">
          <LoginForm callbackUrl={callbackUrl} />
        </div>
      </div>
    </div>
  )
}
