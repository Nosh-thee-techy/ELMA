import { resolveQwenModel, type QwenModelId } from "@/lib/ai/qwen-models";

const DEFAULT_BASE_URL = "https://api-inference.modelscope.ai/v1";

export type QwenChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatCompletionResponse = {
  choices?: { message?: { content?: string } }[];
};

export function getQwenApiKey(): string | undefined {
  return process.env.QWEN_API_KEY ?? process.env.MODELSCOPE_API_KEY;
}

export function getQwenBaseUrl(): string {
  return process.env.QWEN_BASE_URL ?? DEFAULT_BASE_URL;
}

export async function qwenChatCompletion(
  messages: QwenChatMessage[],
  options?: { model?: QwenModelId; temperature?: number; maxTokens?: number },
): Promise<{ content: string; model: QwenModelId } | null> {
  const apiKey = getQwenApiKey();
  if (!apiKey) return null;

  const model = resolveQwenModel(options?.model);
  const url = `${getQwenBaseUrl().replace(/\/$/, "")}/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.3,
      max_tokens: options?.maxTokens ?? 800,
    }),
  });

  if (!response.ok) {
    console.error("Qwen API error", response.status, await response.text());
    return null;
  }

  const json = (await response.json()) as ChatCompletionResponse;
  const content = json.choices?.[0]?.message?.content?.trim();
  if (!content) return null;
  return { content, model };
}
