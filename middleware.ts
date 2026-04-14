import { stackServerApp } from "./stack/server";
import { NextResponse } from "next/server";

export function middleware(req: any) {
  const result = stackServerApp.handleMiddleware(req);

  if (result) return result;

  return NextResponse.next();
}

export const config = {
  matcher: ["/(dashboard)/:path*"],
};