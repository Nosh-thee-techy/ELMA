import { elmaAssistantReply, type AssistantMode } from "@/lib/ai/elma-assistant";
import { getQwenApiKey } from "@/lib/ai/qwen";
import { isQwenModelId, QWEN_MODEL_IDS } from "@/lib/ai/qwen-models";
import { NextResponse } from "next/server";
import { z } from "zod";

const turnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const bodySchema = z.object({
  messages: z.array(turnSchema).min(1).max(24),
  ward: z.string().min(2).max(80).optional(),
  mode: z.enum(["chat", "voice"]).optional(),
  model: z.string().optional(),
});

export async function GET() {
  return NextResponse.json({
    qwenConfigured: Boolean(getQwenApiKey()),
    qwenModels: QWEN_MODEL_IDS,
    modes: ["chat", "voice"] as AssistantMode[],
  });
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const qwenModel =
    parsed.data.model && isQwenModelId(parsed.data.model)
      ? parsed.data.model
      : undefined;

  const result = await elmaAssistantReply(parsed.data.messages, {
    mode: parsed.data.mode ?? "chat",
    ward: parsed.data.ward,
    qwenModel,
  });

  return NextResponse.json({
    message: result.content,
    provider: result.provider,
    model: result.model,
  });
}
