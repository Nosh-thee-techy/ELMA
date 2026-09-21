import { ELMA_PROFILE_COOKIE, ELMA_SESSION_COOKIE } from "@/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ELMA_SESSION_COOKIE);
  res.cookies.delete(ELMA_PROFILE_COOKIE);
  return res;
}
