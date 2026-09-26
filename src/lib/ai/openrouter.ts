import {
  offlinePolicyExplanation,
  POLICY_EXPLAIN_SYSTEM,
  policyExplainUserMessage,
} from "@/lib/ai/prompts";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/** @deprecated use explainPolicy from explain-policy.ts */
export async function explainPolicyWithGemma(
  policyText: string,
  ward: string,
): Promise<string> {
  const result = await explainPolicyWithOpenRouter(policyText, ward);
  return result ?? offlinePolicyExplanation(policyText, ward);
}

export async function explainPolicyWithOpenRouter(
  policyText: string,
  ward: string,
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const model =
    process.env.OPENROUTER_MODEL ?? "google/gemma-2-9b-it:free";

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "ELMA Civic Platform",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: POLICY_EXPLAIN_SYSTEM },
        { role: "user", content: policyExplainUserMessage(ward, policyText) },
      ],
      temperature: 0.3,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    console.error("OpenRouter error", await response.text());
    return null;
  }

  const json = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return json.choices?.[0]?.message?.content?.trim() ?? null;
}
