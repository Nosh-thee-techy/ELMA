import {
  ELMA_PROFILE_COOKIE,
  ELMA_SESSION_COOKIE,
  type SessionProfile,
} from "@/lib/auth/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  role: z.enum(["RESPONDER", "ADMIN"]),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
  const json: unknown = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login" }, { status: 400 });
  }

  const profile: SessionProfile =
    parsed.data.role === "ADMIN"
      ? {
          role: "ADMIN",
          email: parsed.data.email ?? "admin@kisumu.go.ke",
          county: "Kisumu",
          organization: "County Government",
        }
      : {
          role: "RESPONDER",
          email: parsed.data.email ?? "responder@krcs.ke",
          county: "Kisumu",
          ward: "Kondele",
          organization: "Kenya Red Cross Society",
        };

  const res = NextResponse.json({ ok: true, profile });
  res.cookies.set(ELMA_SESSION_COOKIE, "active", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  res.cookies.set(ELMA_PROFILE_COOKIE, encodeURIComponent(JSON.stringify(profile)), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
