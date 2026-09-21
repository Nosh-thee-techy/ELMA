const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function explainPolicyWithGemma(
  policyText: string,
  ward: string,
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return fallbackExplain(policyText, ward);
  }

  const model =
    process.env.OPENROUTER_MODEL ?? "google/gemma-2-9b-it:free";

  const system = `You are ELMA, a civic assistant for Kenyan communities facing El Niño floods.
Rewrite dense policy text into plain Kisumu-friendly English (short sentences, bullet steps).
Include: who qualifies, what to bring, timelines, and who to contact at ward level.
Never invent phone numbers; use placeholders like "ward administrator".`;

  const user = `Ward context: ${ward}, Kenya.\n\nPolicy excerpt:\n${policyText.slice(0, 6000)}`;

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
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.3,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    console.error("OpenRouter error", await response.text());
    return fallbackExplain(policyText, ward);
  }

  const json = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = json.choices?.[0]?.message?.content?.trim();
  return content || fallbackExplain(policyText, ward);
}

function fallbackExplain(policyText: string, ward: string): string {
  return `**Plain-language summary (offline mode)** — ${ward}

- If flood water enters your home or a ward administrator marks it unsafe, you can register for **emergency shelter**.
- **Within 24 hours**, ward staff should verify your case. A photo, neighbor witness, or community leader letter counts if GPS fails.
- **Relief kits** go first to homes with young children, pregnant members, or persons with disabilities.
- **Do not** file false reports — it can block your household from aid.

*(Connect OPENROUTER_API_KEY for AI-powered rewriting of your exact policy text.)*

Source excerpt (first lines):
${policyText.split("\n").slice(0, 4).join("\n")}`;
}
