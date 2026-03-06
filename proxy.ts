import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export default async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // 1. Redirect authenticated users away from auth/public pages to Dashboard
  const authPages = ["/", "/login", "/register-company", "/forgot-password", "/reset-password"];
  if (token && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2. Protect private routes - redirect unauthenticated users to Login
  const protectedRoutes = ["/dashboard", "/onboarding"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    // Optional: add a callback URL to return to after login
    // loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register-company",
    "/forgot-password",
    "/reset-password",
    "/dashboard/:path*",
    "/onboarding/:path*",
  ],
};
