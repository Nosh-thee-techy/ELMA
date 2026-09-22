import { auditEventsToCsv, listAuditEvents } from "@/lib/store/audit-store";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 200);
  const events = listAuditEvents(limit);

  if (format === "csv") {
    const csv = auditEventsToCsv(events);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="elma-audit-trail.csv"',
      },
    });
  }

  return NextResponse.json({ events });
}
