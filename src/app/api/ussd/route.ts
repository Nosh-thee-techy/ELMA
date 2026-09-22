import { createEmergencyReport } from "@/lib/data/repository";
import { appendAuditEvent } from "@/lib/store/audit-store";
import { handleUssdSession } from "@/lib/ussd/handler";
import { NextResponse } from "next/server";
import { z } from "zod";

const jsonSchema = z.object({
  sessionId: z.string().optional(),
  phoneNumber: z.string().optional(),
  serviceCode: z.string().optional(),
  text: z.string().optional(),
  message: z.string().optional(),
});

const allowedCategories = [
  "trapped",
  "flooding",
  "landslide",
  "medical",
  "infrastructure",
  "other",
] as const;

/**
 * USSD gateway (Africa's Talking–style JSON) and legacy REPORT pipe for SMS.
 */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let phoneNumber = "254700000000";
  let text = "";

  if (contentType.includes("application/json")) {
    const json: unknown = await request.json();
    const parsed = jsonSchema.safeParse(json);
    if (parsed.success) {
      phoneNumber = parsed.data.phoneNumber ?? phoneNumber;
      text = parsed.data.text ?? parsed.data.message ?? "";
    }
  } else {
    text = await request.text();
  }

  const trimmed = text.trim();
  if (trimmed.toUpperCase().startsWith("REPORT|")) {
    const parts = trimmed.split("|").map((p) => p.trim());
    if (parts[0]?.toUpperCase() !== "REPORT" || parts.length < 4) {
      return new NextResponse("END Invalid format. REPORT|category|ward|description", {
        headers: { "Content-Type": "text/plain" },
      });
    }
    const categoryRaw = parts[1]?.toLowerCase() ?? "other";
    const ward = parts[2] ?? "Unknown";
    const description = parts.slice(3).join("|");
    const normalized = allowedCategories.includes(categoryRaw as (typeof allowedCategories)[number])
      ? (categoryRaw as (typeof allowedCategories)[number])
      : "other";
    if (description.length < 10) {
      return new NextResponse("END Description too short (min 10 chars).", {
        headers: { "Content-Type": "text/plain" },
      });
    }
    const report = await createEmergencyReport({
      category: normalized,
      description,
      ward,
      county: "Kisumu",
      contact: phoneNumber,
    });
    appendAuditEvent({
      kind: "sms_received",
      summary: `SMS report ${report.id.slice(0, 8)}`,
      actor: `SMS ${phoneNumber.slice(-4)}`,
      ward,
      county: "Kisumu",
      relatedId: report.id,
      metadata: { channel: "sms" },
    });
    return new NextResponse(`END ELMA queued report ${report.id.slice(0, 8)}. Help is coordinating.`, {
      headers: { "Content-Type": "text/plain" },
    });
  }

  const response = await handleUssdSession({ phoneNumber, text: trimmed });
  return new NextResponse(response, { headers: { "Content-Type": "text/plain" } });
}
