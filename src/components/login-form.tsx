"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
})

type FormValues = z.infer<typeof formSchema>

export function LoginForm({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "wannes@wdpserver.com", password: "" },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl,
      })

      if (result?.error) {
        setError("Invalid email or password.")
        setIsSubmitting(false)
        return
      }

      if (result?.ok) {
        router.replace(result.url ?? callbackUrl)
        router.refresh()
      }
    } catch {
      setError("Something went wrong.")
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-border/60 bg-card/90 shadow-2xl shadow-black/5 backdrop-blur">
      <CardHeader className="space-y-4">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Secure access
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-semibold tracking-tight">
            Sign in to Beart Panel
          </CardTitle>
          <CardDescription className="text-base leading-6">
            Manage documents, projects, and tasks from a single dashboard.
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            You will be redirected to your dashboard once authentication succeeds.
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}