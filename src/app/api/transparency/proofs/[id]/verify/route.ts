import {
  ELMA_PROFILE_COOKIE,
  ELMA_SESSION_COOKIE,
  isActiveDemoSession,
  parseProfileCookie,
} from "@/lib/auth/session";
import { markProofVerified } from "@/lib/store/audit-store";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(_request: Request, context: { params: { id: string } }) {
  const jar = cookies();
  if (!isActiveDemoSession(jar.get(ELMA_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const profile = parseProfileCookie(jar.get(ELMA_PROFILE_COOKIE)?.value);
  if (!profile || (profile.role !== "VERIFIER" && profile.role !== "ADMIN")) {
    return NextResponse.json({ error: "Verifier access required" }, { status: 403 });
  }

  markProofVerified(context.params.id, profile.email);
  return NextResponse.json({ ok: true, proofId: context.params.id });
}
