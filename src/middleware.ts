import { ELMA_SESSION_COOKIE, isActiveDemoSession } from "@/lib/auth/demo-session";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/counties")) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ELMA_SESSION_COOKIE)?.value;
  if (!isActiveDemoSession(session)) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/counties/:path*"],
};
