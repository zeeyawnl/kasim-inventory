import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "./stack/server";

export async function middleware(req: NextRequest) {
  const user = await stackServerApp.getUser();

  if (!user) {
    return NextResponse.redirect(new URL(stackServerApp.urls.signIn, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};