// src/middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // This function only runs if the user is already logged in.
    // Here we check their ROLE.
    
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
      // If they try to access /admin but aren't an ADMIN, kick them out.
      return NextResponse.redirect(new URL("/", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token // Ensure user is logged in
    },
  }
)

// Define which pages to protect
export const config = {
  matcher: ["/admin/:path*"]
}