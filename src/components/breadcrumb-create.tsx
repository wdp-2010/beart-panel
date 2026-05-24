"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Home03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

function capitalize(segment: string) {
  return segment
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ")
}

export function BreadcrumbCreate() {
  const pathname = usePathname() || "/"
  // strip query/hash and trailing slash
  const clean = pathname.split(/[?#]/)[0].replace(/\/$/, "")
  const parts = clean === "" || clean === "/" ? [] : clean.split("/").filter(Boolean)

  // build cumulative paths for each segment
  const segments = parts.map((seg, idx) => ({
    name: capitalize(seg),
    href: "/" + parts.slice(0, idx + 1).join("/"),
  }))

  // rendering rules: if there are more than 4 segments, show Home, ellipsis(dropdown of middle items), then last two
  const showEllipsis = segments.length > 4

  const middleItems = showEllipsis ? segments.slice(0, segments.length - 2) : []
  const tail = showEllipsis ? segments.slice(segments.length - 2) : segments

  return (
    <div className="px-6 md:px-8 py-4">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <div className="flex items-bottom gap-1">
                <HugeiconsIcon icon={Home03Icon} data-icon="inline-start" className="size-4" />
                <Link href="/">Home</Link>
            </div>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {showEllipsis ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon-sm" variant="ghost">
                    <BreadcrumbEllipsis />
                    <span className="sr-only">Open breadcrumb menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuGroup>
                    {middleItems.map((m) => (
                      <DropdownMenuItem key={m.href}>
                        <Link href={m.href}>{m.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
          </>
        ) : (
          // render all segments when not ellipsized
          segments.map((seg) => (
            <React.Fragment key={seg.href}>
              <BreadcrumbSeparator/>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={seg.href}>{seg.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))
        )}

        {/* render tail (last two or all segments when not ellipsized) */}
        {showEllipsis && tail.map((seg, i) => (
          <React.Fragment key={seg.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {i === tail.length - 1 ? (
                <BreadcrumbPage>{seg.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={seg.href}>{seg.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}

        {/* if there were no segments (root), mark Home as current */}
        {segments.length === 0 && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
    </div>
  )
}
