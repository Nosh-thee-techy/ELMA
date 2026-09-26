"use client";

import { AiSafetyNotice, ConfidenceBadge } from "@/components/app/ai-safety-notice";
import type { GuidanceKind } from "@/lib/ai/citizen-guidance";
import type { GuidanceConfidence, SafetyPhase, TravelMode } from "@/lib/ai/citizen-safety";
import { phaseLabel } from "@/lib/ai/citizen-safety";
import type { HazardId } from "@/lib/content/citizen-guides";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

function renderSimpleMarkdown(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      return (
        <p
          key={i}
          className="mt-3 first:mt-0 text-xs font-bold uppercase tracking-wide text-teal-800 dark:text-teal-200"
        >
          {trimmed.slice(3)}
        </p>
      );
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return (
        <p key={i} className="ml-2 text-xs leading-relaxed text-foreground/90">
          • {trimmed.slice(2)}
        </p>
      );
    }
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      return (
        <p key={i} className="text-xs font-bold text-foreground">
          {trimmed.slice(2, -2)}
        </p>
      );
    }
    if (!trimmed) return null;
    return (
      <p key={i} className="text-xs leading-relaxed text-muted-foreground">
        {trimmed}
      </p>
    );
  });
}

export function CitizenQwenPanel({
  kind,
  hazard,
  ward,
  county,
  description,
  checklistDone,
  phase,
  travel,
  buttonLabel = "Ask ELMA (Qwen)",
  className,
}: {
  kind: GuidanceKind;
  hazard?: HazardId;
  ward: string;
  county: string;
  description?: string;
  checklistDone?: string[];
  phase?: SafetyPhase;
  travel?: TravelMode;
  buttonLabel?: string;
  className?: string;
}) {
  const [content, setContent] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<GuidanceConfidence | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayPhase: SafetyPhase =
    phase ?? (kind === "ready" ? "before" : kind === "sos_followup" ? "during" : "during");

  async function load() {
    if (!ward.trim() || ward.length < 2) {
      setError("Add your ward first (SOS form or field above).");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          ward: ward.trim(),
          county: county.trim(),
          hazard,
          description: description?.trim() || undefined,
          checklistDone,
          phase: displayPhase,
          travel,
        }),
      });
      if (!res.ok) throw new Error("Could not load guidance");
      const data = (await res.json()) as {
        content: string;
        provider: string;
        confidence: GuidanceConfidence;
      };
      setContent(data.content);
      setProvider(data.provider);
      setConfidence(data.confidence);
    } catch {
      setError("Guidance unavailable. Follow curated bullets above.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className={cn(
        "rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-teal-500/5 p-3",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-xs font-bold text-violet-900 dark:text-violet-200">
          <Sparkles className="size-3.5" aria-hidden />
          {phaseLabel(displayPhase)} · ELMA tips
        </p>
        <div className="flex items-center gap-2">
          {confidence ? <ConfidenceBadge confidence={confidence} /> : null}
          {provider ? (
            <span className="text-[10px] font-bold uppercase text-muted-foreground">{provider}</span>
          ) : null}
        </div>
      </div>

      <AiSafetyNotice className="mt-2" />

      {!content ? (
        <button
          type="button"
          disabled={loading}
          onClick={() => void load()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-3 py-2.5 text-xs font-bold text-white hover:bg-violet-500 disabled:opacity-60"
        >
          {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {buttonLabel}
        </button>
      ) : (
        <div className="mt-3 rounded-lg bg-background/80 p-3">{renderSimpleMarkdown(content)}</div>
      )}

      {error ? <p className="mt-2 text-xs font-semibold text-destructive">{error}</p> : null}

      {content ? (
        <button
          type="button"
          className="mt-2 text-[10px] font-bold text-primary underline-offset-2 hover:underline"
          onClick={() => void load()}
          disabled={loading}
        >
          Refresh tips
        </button>
      ) : null}
    </section>
  );
}
