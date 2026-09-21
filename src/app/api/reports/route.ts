import { createEmergencyReport, getEmergencyReports } from "@/lib/data/repository";
import { NextResponse } from "next/server";
import { z } from "zod";

const reportSchema = z.object({
  category: z.enum([
    "trapped",
    "flooding",
    "landslide",
    "medical",
    "infrastructure",
    "other",
  ]),
  description: z.string().min(10).max(2000),
  ward: z.string().min(2).max(80),
  county: z.string().min(2).max(80),
  contact: z.string().max(40).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export async function GET() {
  const reports = await getEmergencyReports();
  return NextResponse.json({ reports });
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid report", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const report = await createEmergencyReport(parsed.data);
  return NextResponse.json({ report }, { status: 201 });
}
