export const QWEN_MODEL_IDS = [
  "Qwen-Ambassador/Qwen3.7-Max",
  "Qwen-Ambassador/Qwen3.8-Max",
  "Qwen-Ambassador/Qwen3.8-plus",
  "Qwen-Ambassador/Qwen3.7-Plus",
] as const;

export type QwenModelId = (typeof QWEN_MODEL_IDS)[number];

export const DEFAULT_QWEN_MODEL: QwenModelId = "Qwen-Ambassador/Qwen3.8-plus";

export function isQwenModelId(value: string): value is QwenModelId {
  return (QWEN_MODEL_IDS as readonly string[]).includes(value);
}

export function resolveQwenModel(requested?: string): QwenModelId {
  const fromEnv = process.env.QWEN_MODEL;
  if (requested && isQwenModelId(requested)) return requested;
  if (fromEnv && isQwenModelId(fromEnv)) return fromEnv;
  return DEFAULT_QWEN_MODEL;
}
