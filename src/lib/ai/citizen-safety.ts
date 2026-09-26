/** Shared safety contract for ELMA Pocket AI (Qwen) — not legal advice; not navigation. */

export type SafetyPhase = "before" | "during" | "after";

export type TravelMode = "walking" | "driving" | "stationary" | "unsure";

export type GuidanceConfidence = "verified_static" | "general_ai" | "needs_official";

export const ELMA_AI_DISCLAIMER =
  "AI tips are general guidance only — not emergency dispatch, not turn-by-turn navigation, and not legal advice. When water is moving or you are in a vehicle, follow ward officials, police, and marked shelters.";

export const SAFETY_PROMPT_APPEND = `
Safety rules (never break these):
- NEVER invent road names, bridge names, GPS coordinates, or turn-by-turn driving directions. You do not have live flood maps.
- NEVER tell the user a specific route is "safe" — only general principles (e.g. do not drive through standing or flowing water; turn back; move to higher ground).
- NEVER invent phone numbers, payment instructions, or official titles.
- If the situation needs eyes on the ground (fast-moving water, vehicle stuck, medical emergency), say clearly: call emergency services or use SOS / USSD *384*253# — do not rely on this chat alone.
- Use short sentences. Prefer bullets. Say when you are uncertain.
- Always end with a section: ## How sure is this?
  One sentence only: either "General safety guidance for your ward" OR "Confirm with ward administrator or rescue — conditions change quickly."`;

export function phaseLabel(phase: SafetyPhase): string {
  switch (phase) {
    case "before":
      return "Before — prepare";
    case "during":
      return "During — stay safe";
    case "after":
      return "After — recover";
  }
}

export function travelLabel(mode: TravelMode): string {
  switch (mode) {
    case "driving":
      return "In a vehicle";
    case "walking":
      return "On foot";
    case "stationary":
      return "Sheltering in place";
    case "unsure":
      return "Not sure";
  }
}

/** Detect risky hallucination patterns in model output (soft guardrail). */
export function assessGuidanceRisk(text: string): { confidence: GuidanceConfidence; flags: string[] } {
  const flags: string[] = [];
  const lower = text.toLowerCase();

  if (/\b(take|turn (left|right)|drive on|via|exit \d| motorway| highway| A\d| B\d| Mombasa Rd| Thika Rd)\b/i.test(text)) {
    flags.push("route_like_language");
  }
  if (/\b(guaranteed safe|100% safe|definitely safe|this road is open)\b/i.test(lower)) {
    flags.push("false_certainty");
  }
  if (/\b(call \d{3}|07\d{8}|\+254)\b/.test(text.replace(/\s/g, ""))) {
    flags.push("phone_number");
  }

  if (flags.includes("route_like_language") || flags.includes("false_certainty")) {
    return { confidence: "needs_official", flags };
  }
  if (flags.includes("phone_number")) {
    return { confidence: "needs_official", flags };
  }
  return { confidence: "general_ai", flags };
}

export function appendSafetyFooter(content: string, confidence: GuidanceConfidence): string {
  if (content.includes("How sure is this")) return content;
  const line =
    confidence === "needs_official"
      ? "Confirm with ward administrator or rescue — conditions change quickly."
      : "General safety guidance — not live navigation.";
  return `${content.trim()}\n\n## How sure is this?\n${line}`;
}

export function drivingStaticPrinciples(): string[] {
  return [
    "Do not drive into water — you cannot see depth or current.",
    "If water is on the road ahead, turn back to higher ground; do not guess.",
    "Keep fuel for evacuation but avoid crossing flooded dips and seasonal rivers.",
    "Use the app shelter list and ward radio — not AI for road choice.",
  ];
}

export function walkingStaticPrinciples(): string[] {
  return [
    "Move to higher ground on foot if water is rising — do not wait for a vehicle.",
    "Avoid drains, culverts, and muddy slopes; hold children and elders steady.",
    "Share a landmark (school, church, stage) in SOS so responders find you.",
  ];
}
