import {
  canEditShelter,
  parseProfileCookie,
  ELMA_PROFILE_COOKIE,
  ELMA_SESSION_COOKIE,
  isActiveDemoSession,
} from "@/lib/auth/session";
import { appendAuditEvent } from "@/lib/store/audit-store";
import { getShelterById, updateShelterStatus } from "@/lib/store/shelter-store";
import type { ShelterOperationalStatus } from "@/lib/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  occupancy: z.number().int().min(0),
  open: z.boolean(),
  status: z.enum(["OPEN", "NEAR_CAPACITY", "FULL", "CLOSED"]).optional(),
  resourceNeeds: z.array(z.string()).optional(),
  mediaProofUrls: z.array(z.string()).optional(),
  fieldCaptureNote: z.string().optional(),
});

function sessionFromCookies() {
  const jar = cookies();
  if (!isActiveDemoSession(jar.get(ELMA_SESSION_COOKIE)?.value)) return null;
  return parseProfileCookie(jar.get(ELMA_PROFILE_COOKIE)?.value);
}

export async function POST(
  request: Request,
  context: { params: { id: string } },
) {
  const profile = sessionFromCookies();
  if (!profile || (profile.role !== "RESPONDER" && profile.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shelter = getShelterById(context.params.id);
  if (!shelter) {
    return NextResponse.json({ error: "Shelter not found" }, { status: 404 });
  }

  if (!canEditShelter(profile, shelter)) {
    return NextResponse.json({ error: "Not assigned to this ward" }, { status: 403 });
  }

  const json: unknown = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = updateShelterStatus({
    shelterId: shelter.id,
    occupancy: parsed.data.occupancy,
    open: parsed.data.open,
    status: parsed.data.status as ShelterOperationalStatus | undefined,
    resourceNeeds: parsed.data.resourceNeeds,
    mediaProofUrls: parsed.data.mediaProofUrls,
    updatedBy: profile.email,
  });

  if (parsed.data.fieldCaptureNote) {
    appendAuditEvent({
      kind: "field_media",
      summary: `Field photo at ${shelter.name}`,
      actor: profile.email,
      county: shelter.county,
      ward: shelter.ward,
      relatedId: shelter.id,
      metadata: { note: parsed.data.fieldCaptureNote },
    });
  }

  return NextResponse.json({ shelter: updated });
}
