import { qwenChatCompletion, type QwenChatMessage } from "@/lib/ai/qwen";
import type { QwenModelId } from "@/lib/ai/qwen-models";

export type AssistantMode = "chat" | "voice";

export type ChatTurn = { role: "user" | "assistant"; content: string };

const ELMA_CONTEXT = `You are ELMA, a Kenyan civic assistant for El Niño floods, drought, and county disaster transparency.
You help residents, ward committees, and journalists with:
- Shelter and evacuation (occupancy, registration, what to bring)
- Emergency reporting when hotlines jam (web, USSD *384*253#, SMS shortcode 40101 in demo)
- County fund releases, tenders, and ward projects (direct them to /explore on the website)
- Plain-language policy (direct them to /policy for PDF rewriting)
- Field responder workflows (/app and staff sign-in for live updates)

Rules:
- Be accurate, calm, and practical. Short paragraphs or bullets.
- Never invent phone numbers, account numbers, or payment details.
- If you do not know ward-specific facts, say so and suggest USSD, the map, or ward administrator.
- Do not give legal advice; summarize policy in plain language only.`;

function systemForMode(mode: AssistantMode, ward?: string): string {
  const wardLine = ward?.trim()
    ? `\nUser ward context (if relevant): ${ward.trim()}, Kenya.`
    : "";
  if (mode === "voice") {
    return `${ELMA_CONTEXT}${wardLine}

Voice / IVR mode: Replies will be read aloud. Use 2–4 short sentences OR at most 3 brief bullet points. No markdown headers or long lists.`;
  }
  return `${ELMA_CONTEXT}${wardLine}

Chat mode: You may use markdown bullets when helpful. Keep answers under about 200 words unless the user asks for detail.`;
}

export async function elmaAssistantReply(
  turns: ChatTurn[],
  options?: {
    mode?: AssistantMode;
    ward?: string;
    qwenModel?: QwenModelId;
  },
): Promise<{ content: string; provider: "qwen" | "offline"; model: string }> {
  const mode = options?.mode ?? "chat";
  const messages: QwenChatMessage[] = [
    { role: "system", content: systemForMode(mode, options?.ward) },
    ...turns.map((t) => ({ role: t.role, content: t.content })),
  ];

  const qwen = await qwenChatCompletion(messages, {
    model: options?.qwenModel,
    temperature: 0.4,
    maxTokens: mode === "voice" ? 350 : 700,
  });

  if (qwen) {
    return { content: qwen.content, provider: "qwen", model: qwen.model };
  }

  return {
    content: offlineAssistantReply(turns, mode),
    provider: "offline",
    model: "offline-fallback",
  };
}

function offlineAssistantReply(turns: ChatTurn[], mode: AssistantMode): string {
  const last = turns[turns.length - 1]?.content.toLowerCase() ?? "";
  let body =
    "ELMA is in offline demo mode. Set QWEN_API_KEY on the server for live answers.";

  if (last.includes("ussd") || last.includes("dial") || last.includes("phone")) {
    body =
      "On a feature phone, dial *384*253# in this demo. Press 1 to report danger, 2 for shelter space by ward, 3 for ward fund summary.";
  } else if (last.includes("shelter") || last.includes("evacuat")) {
    body =
      "Check open shelters and beds in the field app or ask your ward administrator. Do not wait if water is rising inside your home — move to high ground first.";
  } else if (last.includes("money") || last.includes("fund") || last.includes("tender")) {
    body =
      "Open the Explore map on the ELMA website to see county releases and who published the data. Green counties have full demo profiles.";
  } else if (last.includes("policy") || last.includes("pdf")) {
    body =
      "Paste county policy text on the Policy page — ELMA rewrites it into steps for your ward when Qwen is connected.";
  }

  if (mode === "voice") {
    return body.split(". ").slice(0, 2).join(". ") + ".";
  }
  return body;
}
