import {
  canAccessReport,
  canUpdateReportStatus,
  ELMA_PROFILE_COOKIE,
  ELMA_SESSION_COOKIE,
  isActiveDemoSession,
  parseProfileCookie,
} from "@/lib/auth/session";
import { getEmergencyReports, updateEmergencyReportStatus } from "@/lib/data/repository";
import { appendAuditEvent } from "@/lib/store/audit-store";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  status: z.enum(["open", "dispatched", "resolved"]),
});

export async function POST(
  request: Request,
  context: { params: { id: string } },
) {
  const jar = cookies();
  if (!isActiveDemoSession(jar.get(ELMA_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const profile = parseProfileCookie(jar.get(ELMA_PROFILE_COOKIE)?.value);
  if (!profile || !canUpdateReportStatus(profile)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const reports = await getEmergencyReports();
  const existing = reports.find((r) => r.id === context.params.id);
  if (!existing) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }
  if (!canAccessReport(profile, existing)) {
    return NextResponse.json({ error: "Not in your ward scope" }, { status: 403 });
  }

  const json: unknown = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await updateEmergencyReportStatus(context.params.id, parsed.data.status);
  if (!updated) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  appendAuditEvent({
    kind: "report_status_updated",
    summary: `SOS ${updated.id.slice(0, 8)} → ${parsed.data.status}`,
    actor: profile.email,
    county: updated.county,
    ward: updated.ward,
    relatedId: updated.id,
    metadata: { from: existing.status, to: parsed.data.status, category: updated.category },
  });

  return NextResponse.json({ report: updated });
}
