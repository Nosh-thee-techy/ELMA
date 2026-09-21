import {
  ELMA_PROFILE_COOKIE,
  ELMA_SESSION_COOKIE,
  isActiveDemoSession,
  parseProfileCookie,
} from "@/lib/auth/session";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ELMA_SESSION_COOKIE)?.value;
  const profile = parseProfileCookie(request.cookies.get(ELMA_PROFILE_COOKIE)?.value);

  if (!isActiveDemoSession(session) || !profile) {
    const login = new URL("/responder/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  if (profile.role !== "RESPONDER" && profile.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
