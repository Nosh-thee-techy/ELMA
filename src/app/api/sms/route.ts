import { createEmergencyReport } from "@/lib/data/repository";
import { appendAuditEvent } from "@/lib/store/audit-store";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  from: z.string().min(9),
  message: z.string().min(1),
});

const allowedCategories = [
  "trapped",
  "flooding",
  "landslide",
  "medical",
  "infrastructure",
  "other",
] as const;

/** SMS simulator → structured REPORT pipe or HELP keyword. */
export async function POST(request: Request) {
  const json: unknown = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const msg = parsed.data.message.trim();
  const from = parsed.data.from;

  if (msg.toUpperCase() === "HELP") {
    return NextResponse.json({
      reply: "ELMA: Text REPORT|category|ward|details (10+ chars). Hotline 1199.",
      terminal: true,
    });
  }

  if (msg.toUpperCase().startsWith("REPORT|")) {
    const parts = msg.split("|").map((p) => p.trim());
    if (parts.length < 4) {
      return NextResponse.json({
        reply: "Invalid format. Use REPORT|flooding|Ward|Your message",
        terminal: true,
      });
    }
    const categoryRaw = parts[1]?.toLowerCase() ?? "other";
    const ward = parts[2] ?? "Unknown";
    const description = parts.slice(3).join("|");
    const normalized = allowedCategories.includes(categoryRaw as (typeof allowedCategories)[number])
      ? (categoryRaw as (typeof allowedCategories)[number])
      : "other";
    if (description.length < 10) {
      return NextResponse.json({ reply: "Description too short (min 10 chars).", terminal: true });
    }
    const report = await createEmergencyReport({
      category: normalized,
      description,
      ward,
      county: "Kisumu",
      contact: from,
    });
    appendAuditEvent({
      kind: "sms_received",
      summary: `SMS report ${report.id.slice(0, 8)}`,
      actor: `SMS ${from.slice(-4)}`,
      ward,
      county: "Kisumu",
      relatedId: report.id,
      metadata: { channel: "sms" },
    });
    return NextResponse.json({
      reply: `Report ${report.id.slice(0, 8)} queued. Help is coordinating.`,
      terminal: true,
      reportId: report.id,
    });
  }

  return NextResponse.json({
    reply: "Unknown command. Text HELP or use REPORT|category|ward|details",
    terminal: true,
  });
}
