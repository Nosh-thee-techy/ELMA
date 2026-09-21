import { fundDisbursals, projectProofs } from "@/lib/data/disbursals-seed";
import { NextResponse } from "next/server";

export async function GET() {
  const items = fundDisbursals.map((d) => ({
    ...d,
    proof: projectProofs.find((p) => p.disbursalId === d.id) ?? null,
  }));
  return NextResponse.json({ disbursals: items });
}
