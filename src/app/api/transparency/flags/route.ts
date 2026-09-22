import { addCitizenFlag, listCitizenFlags } from "@/lib/store/audit-store";
import { NextResponse } from "next/server";
import { z } from "zod";

const postSchema = z.object({
  targetType: z.enum(["disbursal", "shelter", "proof"]),
  targetId: z.string().min(1),
  reason: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  county: z.string().optional(),
  ward: z.string().optional(),
});

export async function GET() {
  return NextResponse.json({ flags: listCitizenFlags() });
}

export async function POST(request: Request) {
  const json: unknown = await request.json();
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid flag" }, { status: 400 });
  }
  const flag = addCitizenFlag(parsed.data);
  return NextResponse.json({ flag });
}
