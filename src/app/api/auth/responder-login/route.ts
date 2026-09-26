import {
  ELMA_PROFILE_COOKIE,
  ELMA_SESSION_COOKIE,
  type SessionProfile,
} from "@/lib/auth/session";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  role: z.enum(["RESPONDER", "ADMIN", "VERIFIER"]),
  email: z.string().email().optional(),
  phone: z.string().min(9).max(20).optional(),
});

function emailFromPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `staff+${digits}@demo.elma.ke`;
}

export async function POST(request: Request) {
  const json: unknown = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login" }, { status: 400 });
  }

  const email =
    parsed.data.email ??
    (parsed.data.phone ? emailFromPhone(parsed.data.phone) : undefined);

  let profile: SessionProfile;
  if (parsed.data.role === "ADMIN") {
    profile = {
      role: "ADMIN",
      email: email ?? "admin@kisumu.go.ke",
      county: "Kisumu",
      organization: "County Government",
    };
  } else if (parsed.data.role === "VERIFIER") {
    profile = {
      role: "VERIFIER",
      email: email ?? "audit@elma.ke",
      county: "National",
      organization: "Independent Audit Desk (demo)",
    };
  } else {
    profile = {
      role: "RESPONDER",
      email: email ?? "responder@krcs.ke",
      county: "Kisumu",
      ward: "Kondele",
      organization: "Kenya Red Cross Society",
    };
  }

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
