"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
})

type FormValues = z.infer<typeof formSchema>

export function LoginForm({
  className,
  callbackUrl = "/dashboard",
  ...props
}: React.ComponentProps<"div"> & { callbackUrl?: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your Beart Panel</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="someone@somewhere.com"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="mailto:contact@be-art.com">Contact Be-Art</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}