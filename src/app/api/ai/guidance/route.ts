import { generateCitizenGuidance } from "@/lib/ai/citizen-guidance";
import { getQwenApiKey } from "@/lib/ai/qwen";
import { isQwenModelId } from "@/lib/ai/qwen-models";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  kind: z.enum(["now", "ready", "sos_followup"]),
  ward: z.string().min(2).max(80),
  county: z.string().min(2).max(80),
  hazard: z
    .enum(["flooding", "trapped", "medical", "landslide", "infrastructure", "other"])
    .optional(),
  description: z.string().max(500).optional(),
  checklistDone: z.array(z.string()).max(20).optional(),
  phase: z.enum(["before", "during", "after"]).optional(),
  travel: z.enum(["walking", "driving", "stationary", "unsure"]).optional(),
  model: z.string().optional(),
});

export async function GET() {
  return NextResponse.json({ qwenConfigured: Boolean(getQwenApiKey()) });
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const qwenModel =
    parsed.data.model && isQwenModelId(parsed.data.model) ? parsed.data.model : undefined;

  const result = await generateCitizenGuidance(
    {
      kind: parsed.data.kind,
      ward: parsed.data.ward,
      county: parsed.data.county,
      hazard: parsed.data.hazard,
      description: parsed.data.description,
      checklistDone: parsed.data.checklistDone,
      phase: parsed.data.phase,
      travel: parsed.data.travel,
    },
    { qwenModel },
  );

  return NextResponse.json(result);
}
