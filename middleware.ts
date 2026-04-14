import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "./stack/server";

export async function middleware(req: NextRequest) {
  // Fix: Remove the { request: req } argument
  const user = await stackServerApp.getUser();
  const isAuthPage = req.nextUrl.pathname.startsWith("/sign-in");
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard");
  // Redirect to sign-in if accessing dashboard while logged out
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Redirect to dashboard if accessing login page while already logged in
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in"],
};
