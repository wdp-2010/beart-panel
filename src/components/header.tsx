"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { Session } from "next-auth"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Add01Icon, Logout03Icon, UserIcon, Settings01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type HeaderVariant = "welcome" | "page"

interface HeaderProps {
  /** The user session - required for "welcome" variant */
  session?: Session | null
  /** Visual variant of the header */
  variant?: HeaderVariant
  /** Page title - required for "page" variant */
  title?: string
  /** Show the create project button */
  showCreateButton?: boolean
  /** Custom text for the create button */
  createButtonText?: string
  /** Show user avatar in dropdown instead of logo */
  showUserMenu?: boolean
  /** Additional CSS classes */
  className?: string
}

function getUserInitials(name?: string | null): string {
  if (!name) return "U"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getDisplayName(name?: string | null): string {
  if (!name) return "User"
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export function Header({
  session,
  variant = "page",
  title,
  showCreateButton = false,
  createButtonText = "Create New Project",
  showUserMenu = false,
  className,
}: HeaderProps) {
  const userName = session?.user?.name
  const userImage = session?.user?.image
  const displayName = getDisplayName(userName)
  const userInitials = getUserInitials(userName)

  const heading = variant === "welcome" ? `Welcome, ${displayName}` : title

  return (
    <header
      className={cn(
        "border-b border-border px-6 py-4",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left section: Logo/Avatar + Title */}
        <div className="flex items-center gap-4">
          {showUserMenu && session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative size-12 rounded-full p-0"
                >
                  <Avatar className="size-12">
                    <AvatarImage
                      src={userImage ?? undefined}
                      alt={displayName}
                    />
                    <AvatarFallback className="text-lg">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {/* Show dashboard link only if not on welcome page */}
                    {variant != "welcome" ? (
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard">
                                <HugeiconsIcon icon={UserIcon} data-icon="inline-start" />
                                Dashboard
                            </Link>
                        </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem asChild>
                        <Link href="/settings">
                        <HugeiconsIcon icon={Settings01Icon} data-icon="inline-start" />
                        Settings
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-destructive focus:text-destructive"
                >
                  <HugeiconsIcon icon={Logout03Icon} data-icon="inline-start" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/"
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted"
            >
              <span className="text-xl font-bold">Be</span>
            </Link>
          )}

          {heading && (
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {heading}
            </h1>
          )}
        </div>

        {/* Right section: Actions */}
        <div className="flex items-center gap-2">
          {showCreateButton && (
            <Button asChild>
              <Link href="/create-project">
                <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
                {createButtonText}
              </Link>
            </Button>
          )}

          {!showUserMenu && session && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="size-8">
                    <AvatarImage
                      src={userImage ?? undefined}
                      alt={displayName}
                    />
                    <AvatarFallback className="text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-destructive focus:text-destructive"
                >
                  <HugeiconsIcon icon={Logout03Icon} data-icon="inline-start" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}