import { getShelters } from "@/lib/data/repository";
import { NextResponse } from "next/server";

export async function GET() {
  const shelters = await getShelters();
  return NextResponse.json({ shelters });
}
