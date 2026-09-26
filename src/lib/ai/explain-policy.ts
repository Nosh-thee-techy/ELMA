import {
  offlinePolicyExplanation,
  POLICY_EXPLAIN_SYSTEM,
  policyExplainUserMessage,
} from "@/lib/ai/prompts";
import { qwenChatCompletion } from "@/lib/ai/qwen";
import type { QwenModelId } from "@/lib/ai/qwen-models";
import { explainPolicyWithOpenRouter } from "@/lib/ai/openrouter";

export type ExplainPolicyResult = {
  explanation: string;
  provider: "qwen" | "openrouter" | "offline";
  model: string;
};

export async function explainPolicy(
  policyText: string,
  ward: string,
  options?: { qwenModel?: QwenModelId },
): Promise<ExplainPolicyResult> {
  const userMessage = policyExplainUserMessage(ward, policyText);
  const messages = [
    { role: "system" as const, content: POLICY_EXPLAIN_SYSTEM },
    { role: "user" as const, content: userMessage },
  ];

  const qwen = await qwenChatCompletion(messages, { model: options?.qwenModel });
  if (qwen) {
    return {
      explanation: qwen.content,
      provider: "qwen",
      model: qwen.model,
    };
  }

  const openRouter = await explainPolicyWithOpenRouter(policyText, ward);
  if (openRouter) {
    return {
      explanation: openRouter,
      provider: "openrouter",
      model: process.env.OPENROUTER_MODEL ?? "google/gemma-2-9b-it:free",
    };
  }

  return {
    explanation: offlinePolicyExplanation(policyText, ward),
    provider: "offline",
    model: "offline-fallback",
  };
}
