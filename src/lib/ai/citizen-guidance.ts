import { hazardGuides, type HazardId } from "@/lib/content/citizen-guides";
import {
  appendSafetyFooter,
  assessGuidanceRisk,
  drivingStaticPrinciples,
  SAFETY_PROMPT_APPEND,
  type GuidanceConfidence,
  type SafetyPhase,
  type TravelMode,
  walkingStaticPrinciples,
} from "@/lib/ai/citizen-safety";
import { qwenChatCompletion } from "@/lib/ai/qwen";
import type { QwenModelId } from "@/lib/ai/qwen-models";

export type GuidanceKind = "now" | "ready" | "sos_followup";

export type CitizenGuidanceInput = {
  kind: GuidanceKind;
  ward: string;
  county: string;
  hazard?: HazardId;
  description?: string;
  checklistDone?: string[];
  phase?: SafetyPhase;
  travel?: TravelMode;
};

export type CitizenGuidanceResult = {
  content: string;
  provider: "qwen" | "offline";
  model: string;
  confidence: GuidanceConfidence;
  phase: SafetyPhase;
};

const BASE_RULES = `You are ELMA Pocket, a Kenyan disaster assistant (El Niño floods, landslides, drought).
Be calm, practical, and short. Use plain English (Kiswahili only if the user wrote in Swahili).
${SAFETY_PROMPT_APPEND}`;

function resolvePhase(input: CitizenGuidanceInput): SafetyPhase {
  if (input.phase) return input.phase;
  if (input.kind === "ready") return "before";
  if (input.kind === "sos_followup") return "during";
  return "during";
}

function travelBlock(mode: TravelMode | undefined): string {
  if (mode === "driving") {
    return `\nTravel context: USER IS IN A VEHICLE. Include section ## If you are driving (3 bullets) — principles only, NO road names.\n${drivingStaticPrinciples().map((p) => `- ${p}`).join("\n")}`;
  }
  if (mode === "walking") {
    return `\nTravel context: USER IS ON FOOT. Include section ## If you are moving on foot (2 bullets).\n${walkingStaticPrinciples().map((p) => `- ${p}`).join("\n")}`;
  }
  if (mode === "stationary") {
    return "\nTravel context: USER IS SHELTERING IN PLACE. Focus on staying put safely, signaling rescuers, and battery conservation.";
  }
  return "";
}

function staticNowFallback(hazard: HazardId, ward: string, travel?: TravelMode): string {
  const guide = hazardGuides.find((g) => g.id === hazard) ?? hazardGuides[0];
  if (!guide) {
    return appendSafetyFooter(
      `**${ward} — stay safe**\n\n- Move to higher ground if water is rising.\n- Report via SOS tab or USSD *384*253#.`,
      "verified_static",
    );
  }
  const doLines = guide.doNow.map((l) => `- ${l}`).join("\n");
  const notLines = guide.doNot.map((l) => `- ${l}`).join("\n");
  const afterLines = guide.after.map((l) => `- ${l}`).join("\n");
  let travelSection = "";
  if (travel === "driving") {
    travelSection = `\n\n## If you are driving\n${drivingStaticPrinciples().map((p) => `- ${p}`).join("\n")}`;
  } else if (travel === "walking") {
    travelSection = `\n\n## If you are on foot\n${walkingStaticPrinciples().map((p) => `- ${p}`).join("\n")}`;
  }
  return appendSafetyFooter(
    `**${guide.label} · ${ward}** (curated)\n\n## During — do now\n${doLines}\n\n## Do not\n${notLines}\n\n## After (when safe)\n${afterLines}${travelSection}`,
    "verified_static",
  );
}

function staticReadyFallback(ward: string, checklistDone: string[], phase: SafetyPhase): string {
  const done = checklistDone.length > 0 ? checklistDone.join(", ") : "none yet";
  if (phase === "after") {
    return appendSafetyFooter(
      `**After · ${ward}** (curated)\n\n- Keep your SOS report reference for ward relief.\n- Boil water until the county clears supply.\n- Photograph damage only when safe; do not enter cracked buildings.\n- Use Policy on the website for entitlements; AI does not decide aid.\n\n## How sure is this?\nGeneral recovery steps — ward administrator confirms aid.`,
      "verified_static",
    );
  }
  return appendSafetyFooter(
    `**Before · ${ward}** (curated)\n\n- Finish go-bag checklist (${done}).\n- Agree family meet-up on high ground.\n- IDs and medicines in waterproof bag.\n- Know *384*253#; plan two routes in your head — follow officials when floods start, not AI maps.\n\n## How sure is this?\nCurated preparedness — confirm local flood hotspots with neighbors.`,
    "verified_static",
  );
}

function staticSosFollowup(hazard: HazardId, ward: string, description?: string, travel?: TravelMode): string {
  const base = staticNowFallback(hazard, ward, travel);
  const snippet = description?.trim()
    ? `\n\nYour report is in the ward queue. Summary: "${description.slice(0, 100)}${description.length > 100 ? "…" : ""}"`
    : "\n\nYour report is in the ward queue.";
  return base.replace("(curated)", "(curated · after SOS)") + snippet;
}

function buildMessages(input: CitizenGuidanceInput): {
  messages: { role: "system" | "user"; content: string }[];
  maxTokens: number;
} {
  const hazard = input.hazard ?? "flooding";
  const phase = resolvePhase(input);
  const checklist =
    input.checklistDone && input.checklistDone.length > 0
      ? input.checklistDone.join(", ")
      : "none ticked yet";
  const travelExtra = travelBlock(input.travel);

  if (input.kind === "now") {
    return {
      maxTokens: 520,
      messages: [
        {
          role: "system",
          content: `${BASE_RULES}

Phase: DURING (active or imminent danger).${travelExtra}

Output markdown sections:
## During — do now (3 bullets)
## Do not (2 bullets)
## After — when safe later (2 bullets) — preview only, user may still be in danger
${input.travel === "driving" ? "## If you are driving (3 bullets — no road names)" : ""}
${input.travel === "walking" ? "## If you are on foot (2 bullets)" : ""}
## How sure is this? (one sentence)
Max 150 words total.`,
        },
        {
          role: "user",
          content: `County: ${input.county}. Ward: ${input.ward}. Hazard: ${hazard}. Travel: ${input.travel ?? "unsure"}.${
            input.description ? `\nContext: ${input.description.slice(0, 400)}` : ""
          }`,
        },
      ],
    };
  }

  if (input.kind === "sos_followup") {
    return {
      maxTokens: 520,
      messages: [
        {
          role: "system",
          content: `${BASE_RULES}

Phase: DURING — user already submitted SOS.${travelExtra}

Output markdown:
## During — next 10 minutes (3 bullets)
## Do not (2 bullets)
## What responders need from you (2 bullets)
${input.travel === "driving" ? "## If you are driving (3 bullets — no road names)" : ""}
## How sure is this? (one sentence)
Max 140 words.`,
        },
        {
          role: "user",
          content: `County: ${input.county}. Ward: ${input.ward}. Hazard: ${hazard}. Travel: ${input.travel ?? "unsure"}.
Report: ${input.description?.slice(0, 400) ?? "not provided"}.`,
        },
      ],
    };
  }

  const readyPhase = phase === "after" ? "AFTER" : "BEFORE";
  return {
    maxTokens: 560,
    messages: [
      {
        role: "system",
        content: `${BASE_RULES}

Phase: ${readyPhase} (preparedness or recovery — not immediate rescue).

Output markdown:
${readyPhase === "BEFORE" ? "## Before — this week (3 bullets)\n## Go-bag / household (2 bullets)\n## Driving & routes — general only (2 bullets: do not use AI as GPS; listen to county alerts)" : "## After — recovery (3 bullets)\n## Documents & aid (2 bullets)\n## Driving — general only (2 bullets)"}
## How sure is this? (one sentence)
Max 160 words.`,
      },
      {
        role: "user",
        content: `County: ${input.county}. Ward: ${input.ward}. Checklist done: ${checklist}. Phase: ${readyPhase}.`,
      },
    ],
  };
}

export async function generateCitizenGuidance(
  input: CitizenGuidanceInput,
  options?: { qwenModel?: QwenModelId },
): Promise<CitizenGuidanceResult> {
  const hazard = input.hazard ?? "flooding";
  const phase = resolvePhase(input);
  const { messages, maxTokens } = buildMessages(input);

  const qwen = await qwenChatCompletion(messages, {
    model: options?.qwenModel,
    temperature: 0.2,
    maxTokens,
  });

  if (qwen) {
    const risk = assessGuidanceRisk(qwen.content);
    const content = appendSafetyFooter(qwen.content, risk.confidence);
    return {
      content,
      provider: "qwen",
      model: qwen.model,
      confidence: risk.confidence,
      phase,
    };
  }

  if (input.kind === "ready") {
    return {
      content: staticReadyFallback(input.ward, input.checklistDone ?? [], phase),
      provider: "offline",
      model: "offline-fallback",
      confidence: "verified_static",
      phase,
    };
  }
  if (input.kind === "sos_followup") {
    return {
      content: staticSosFollowup(hazard, input.ward, input.description, input.travel),
      provider: "offline",
      model: "offline-fallback",
      confidence: "verified_static",
      phase,
    };
  }
  return {
    content: staticNowFallback(hazard, input.ward, input.travel),
    provider: "offline",
    model: "offline-fallback",
    confidence: "verified_static",
    phase,
  };
}
