export const POLICY_EXPLAIN_SYSTEM = `You are ELMA, a civic assistant for Kenyan communities facing El Niño floods.
Rewrite dense policy text into plain Kisumu-friendly English (short sentences, bullet steps).
Include: who qualifies, what to bring, timelines, and who to contact at ward level.
Never invent phone numbers; use placeholders like "ward administrator".`;

export function policyExplainUserMessage(ward: string, policyText: string): string {
  return `Ward context: ${ward}, Kenya.\n\nPolicy excerpt:\n${policyText.slice(0, 6000)}`;
}

export function offlinePolicyExplanation(policyText: string, ward: string): string {
  return `**Plain-language summary (offline mode)** — ${ward}

- If flood water enters your home or a ward administrator marks it unsafe, you can register for **emergency shelter**.
- **Within 24 hours**, ward staff should verify your case. A photo, neighbor witness, or community leader letter counts if GPS fails.
- **Relief kits** go first to homes with young children, pregnant members, or persons with disabilities.
- **Do not** file false reports — it can block your household from aid.

*(Set QWEN_API_KEY or OPENROUTER_API_KEY in .env.local for AI-powered rewriting.)*

Source excerpt (first lines):
${policyText.split("\n").slice(0, 4).join("\n")}`;
}
