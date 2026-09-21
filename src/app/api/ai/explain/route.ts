import { explainPolicyWithGemma } from "@/lib/ai/openrouter";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  policyText: z.string().min(40).max(8000),
  ward: z.string().min(2).max(80),
});

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const explanation = await explainPolicyWithGemma(
    parsed.data.policyText,
    parsed.data.ward,
  );

  return NextResponse.json({
    explanation,
    model: process.env.OPENROUTER_API_KEY ? "openrouter/gemma" : "offline-fallback",
  });
}
