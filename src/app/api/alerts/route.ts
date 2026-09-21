import { getCommunityAlerts } from "@/lib/data/repository";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const verifiedOnly = searchParams.get("verified") === "true";

  let alerts = await getCommunityAlerts();

  if (verifiedOnly) {
    alerts = alerts.filter((a) => a.verification === "verified");
  }

  return NextResponse.json({ alerts });
}
