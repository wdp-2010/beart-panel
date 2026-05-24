import { NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/dashboard"]
const publicRoutes = ["/login", "/"]

function buildLoginUrl(req: NextRequest) {
  const loginUrl = new URL("/login", req.nextUrl)
  loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search)
  return loginUrl
}

function hasSessionCookie(req: NextRequest) {
  return Boolean(
    req.cookies.get("__Secure-authjs.session-token")?.value ||
      req.cookies.get("authjs.session-token")?.value
  )
}

export default function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  )
  const isPublicRoute = publicRoutes.includes(path)
  const isAuthenticated = hasSessionCookie(req)

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(buildLoginUrl(req))
  }

  if (isPublicRoute && isAuthenticated && path !== "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}