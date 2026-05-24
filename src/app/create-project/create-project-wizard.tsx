"use client"

import { useActionState, useEffect, useMemo, useState } from "react"
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
  createProject,
  PROJECT_DRAFT_COOKIE,
  type CreateProjectState,
} from "./actions"

type ProjectStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED"

type ProjectDraft = {
  name: string
  description: string
  status: ProjectStatus
}

const initialState: CreateProjectState = {
  message: "",
}

const steps = [
  {
    title: "Basics",
    description: "Name and describe the project.",
  },
  {
    title: "Status",
    description: "Choose where the project starts.",
  },
  {
    title: "Review",
    description: "Confirm and save it.",
  },
]

const statuses: Array<{
  value: ProjectStatus
  label: string
  description: string
}> = [
  {
    value: "ACTIVE",
    label: "Active",
    description: "Ready for work and visible on the dashboard.",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    description: "Already finished, but still available for reference.",
  },
  {
    value: "ARCHIVED",
    label: "Archived",
    description: "Stored away without treating it as current work.",
  },
]

function getInitialDraft(draft?: Partial<ProjectDraft>): ProjectDraft {
  return {
    name: draft?.name ?? "",
    description: draft?.description ?? "",
    status: draft?.status ?? "ACTIVE",
  }
}

function setDraftCookie(draft: ProjectDraft) {
  const maxAge = 60 * 60 * 24 * 14
  document.cookie = `${PROJECT_DRAFT_COOKIE}=${encodeURIComponent(
    JSON.stringify(draft)
  )}; path=/; max-age=${maxAge}; samesite=lax`
}

export function CreateProjectWizard({
  initialDraft,
}: {
  initialDraft?: Partial<ProjectDraft>
}) {
  const [actionState, formAction, isPending] = useActionState(
    createProject,
    initialState
  )
  const [currentStep, setCurrentStep] = useState(0)
  const [draft, setDraft] = useState<ProjectDraft>(() =>
    getInitialDraft(initialDraft)
  )

  const selectedStatus = useMemo(
    () => statuses.find((status) => status.value === draft.status) ?? statuses[0],
    [draft.status]
  )

  const hasProjectName = draft.name.trim().length >= 2
  const canContinue = currentStep !== 0 || hasProjectName

  useEffect(() => {
    setDraftCookie(draft)
  }, [draft])

  function updateDraft<Key extends keyof ProjectDraft>(
    key: Key,
    value: ProjectDraft[Key]
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function goNext() {
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1))
  }

  function goBack() {
    setCurrentStep((step) => Math.max(step - 1, 0))
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-5 px-3 py-5 md:grid-cols-[18rem_minmax(0,1fr)] md:px-6">
      <aside className="rounded-lg border bg-card p-3 text-card-foreground">
        <div className="flex flex-col gap-3">
          {steps.map((step, index) => {
            const isActive = index === currentStep
            const isComplete = index < currentStep

            return (
              <button
                key={step.title}
                type="button"
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "flex min-h-16 w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium",
                    isActive
                      ? "border-primary-foreground/60"
                      : "border-border bg-background"
                  )}
                >
                  {isComplete ? (
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium">{step.title}</span>
                  <span
                    className={cn(
                      "text-xs/relaxed",
                      isActive
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.description}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </aside>

      <form action={formAction}>
        <input name="name" type="hidden" value={draft.name} />
        <input name="description" type="hidden" value={draft.description} />
        <input name="status" type="hidden" value={draft.status} />

        <Card className="min-h-[28rem]">
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 0 ? (
              <FieldGroup>
                <Field data-invalid={Boolean(actionState.errors?.name)}>
                  <FieldLabel htmlFor="project-name">Project name</FieldLabel>
                  <Input
                    id="project-name"
                    value={draft.name}
                    onChange={(event) => updateDraft("name", event.target.value)}
                    placeholder="Website redesign"
                    aria-invalid={Boolean(actionState.errors?.name)}
                  />
                  <FieldDescription>
                    This name is shown on the dashboard and project screens.
                  </FieldDescription>
                  <FieldError
                    errors={actionState.errors?.name?.map((message) => ({
                      message,
                    }))}
                  />
                </Field>
                <Field data-invalid={Boolean(actionState.errors?.description)}>
                  <FieldLabel htmlFor="project-description">
                    Project description
                  </FieldLabel>
                  <textarea
                    id="project-description"
                    value={draft.description}
                    onChange={(event) =>
                      updateDraft("description", event.target.value)
                    }
                    placeholder="Scope, goals, or anything your team should know."
                    aria-invalid={Boolean(actionState.errors?.description)}
                    className="min-h-28 w-full resize-none rounded-md border border-input bg-input/20 px-2 py-1.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-xs/relaxed dark:bg-input/30"
                  />
                  <FieldDescription>
                    Optional, but useful when projects start to stack up.
                  </FieldDescription>
                  <FieldError
                    errors={actionState.errors?.description?.map((message) => ({
                      message,
                    }))}
                  />
                </Field>
              </FieldGroup>
            ) : null}

            {currentStep === 1 ? (
              <FieldGroup>
                <Field data-invalid={Boolean(actionState.errors?.status)}>
                  <FieldLabel>Project status</FieldLabel>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {statuses.map((status) => (
                      <button
                        key={status.value}
                        type="button"
                        onClick={() => updateDraft("status", status.value)}
                        className={cn(
                          "flex min-h-32 flex-col gap-2 rounded-md border bg-background p-3 text-left transition-colors",
                          draft.status === status.value
                            ? "border-primary ring-2 ring-ring/30"
                            : "border-border hover:bg-muted"
                        )}
                      >
                        <span className="text-sm font-medium">
                          {status.label}
                        </span>
                        <span className="text-xs/relaxed text-muted-foreground">
                          {status.description}
                        </span>
                      </button>
                    ))}
                  </div>
                  <FieldError
                    errors={actionState.errors?.status?.map((message) => ({
                      message,
                    }))}
                  />
                </Field>
              </FieldGroup>
            ) : null}

            {currentStep === 2 ? (
              <div className="flex flex-col gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border bg-background p-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Project name
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {draft.name || "Not filled in"}
                    </div>
                  </div>
                  <div className="rounded-md border bg-background p-3">
                    <div className="text-xs font-medium text-muted-foreground">
                      Status
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {selectedStatus.label}
                    </div>
                  </div>
                </div>
                <div className="rounded-md border bg-background p-3">
                  <div className="text-xs font-medium text-muted-foreground">
                    Description
                  </div>
                  <p className="mt-1 text-sm/relaxed">
                    {draft.description || "No description added."}
                  </p>
                </div>
                {actionState.message ? (
                  <>
                    <Separator />
                    <p className="text-xs/relaxed text-destructive">
                      {actionState.message}
                    </p>
                  </>
                ) : null}
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="mt-auto justify-between gap-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={currentStep === 0 || isPending}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" />
              Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={goNext}
                disabled={!canContinue || isPending}
              >
                Continue
                <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
              </Button>
            ) : (
              <Button type="submit" disabled={!hasProjectName || isPending}>
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  data-icon="inline-start"
                />
                {isPending ? "Saving..." : "Save project"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
