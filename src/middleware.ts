import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // 1. ADMIN PROTECTION
    // If trying to access /admin AND not an ADMIN role -> Redirect to Home
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // 2. USER PROTECTION (Optional but recommended)
    // You can add extra logic here if needed, but the 'authorized' callback 
    // below already handles the basic "must be logged in" check for all matched routes.
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token // Returns true if logged in, false if not
    },
  }
)

export const config = {
  // ✅ UPDATE: Protect User routes too (Checkout, Orders, Profile)
  matcher: [
    "/admin/:path*",      // Requires Login + ADMIN Role
    "/checkout/:path*",   // Requires Login
    "/orders/:path*",     // Requires Login
    "/profile/:path*",    // Requires Login
    "/dashboard/:path*"   // Requires Login
  ]
}