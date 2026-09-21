import { updateAlertVerification } from "@/lib/data/repository";
import type { VerificationStatus } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  verification: z.enum(["verified", "pending", "disputed", "rumor"]),
});

function authorizeModerator(request: Request): boolean {
  const expected = process.env.ELMA_MODERATOR_KEY;
  if (!expected) return process.env.NODE_ENV === "development";
  return request.headers.get("x-elma-mod-key") === expected;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  if (!authorizeModerator(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const updated = await updateAlertVerification(
    params.id,
    parsed.data.verification as VerificationStatus,
  );
  if (!updated) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 });
  }

  return NextResponse.json({ alert: updated });
}
