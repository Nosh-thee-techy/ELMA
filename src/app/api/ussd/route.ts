import { createEmergencyReport } from "@/lib/data/repository";
import { NextResponse } from "next/server";

/**
 * Minimal USSD/SMS adapter stub.
 * Expected text: REPORT|flooding|Ward name|Short description
 */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let raw = "";

  if (contentType.includes("application/json")) {
    const json = (await request.json()) as { text?: string; message?: string };
    raw = json.text ?? json.message ?? "";
  } else {
    raw = await request.text();
  }

  const parts = raw.split("|").map((p) => p.trim());
  if (parts[0]?.toUpperCase() !== "REPORT" || parts.length < 4) {
    return new NextResponse(
      "END Invalid format. Use: REPORT|category|ward|description",
      { headers: { "Content-Type": "text/plain" } },
    );
  }

  const category = parts[1]?.toLowerCase() ?? "other";
  const ward = parts[2] ?? "Unknown";
  const description = parts.slice(3).join("|");

  const allowed = [
    "trapped",
    "flooding",
    "landslide",
    "medical",
    "infrastructure",
    "other",
  ] as const;

  const normalized = allowed.includes(category as (typeof allowed)[number])
    ? (category as (typeof allowed)[number])
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
  });

  return new NextResponse(`END ELMA queued report ${report.id.slice(0, 8)}. Help is coordinating.`, {
    headers: { "Content-Type": "text/plain" },
  });
}
