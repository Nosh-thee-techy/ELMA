"use client";

import { CitizenQwenPanel } from "@/components/app/citizen-qwen-panel";
import { PhoneExtraTabs } from "@/components/app/phone-extra-tabs";
import { readCitizenWard, readLastReport } from "@/components/app/citizen-sos-tab";
import type { SafetyPhase } from "@/lib/ai/citizen-safety";
import { DEMO_COUNTY } from "@/lib/data/seed";
import {
  preparednessChecklist,
  hazardGuides,
  USSD_SHORT_CODE,
  type HazardId,
} from "@/lib/content/citizen-guides";
import { cn } from "@/lib/utils";
import { Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const CHECKLIST_KEY = "elma_prep_checklist";

function loadChecks(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function CitizenReadyTab() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [lastReport, setLastReport] = useState<ReturnType<typeof readLastReport>>(null);
  const [ward, setWard] = useState("");
  const [readyPhase, setReadyPhase] = useState<SafetyPhase>("before");

  useEffect(() => {
    setChecks(loadChecks());
    setLastReport(readLastReport());
    setWard(readCitizenWard());
  }, []);

  function toggle(id: string) {
    setChecks((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const done = preparednessChecklist.filter((c) => checks[c.id]).length;

  return (
    <div className="flex flex-col gap-3 p-3">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-700 dark:text-violet-300">
          Ready
        </p>
        <p className="text-sm font-extrabold">Go-bag and plan</p>
      </div>

      <div className="flex gap-2">
        {(["before", "after"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setReadyPhase(p)}
            className={cn(
              "flex-1 rounded-xl py-2.5 text-xs font-bold capitalize",
              readyPhase === p
                ? "bg-violet-600 text-white"
                : "bg-muted text-muted-foreground",
            )}
          >
            {p === "before" ? "Before" : "After"}
          </button>
        ))}
      </div>

      <section className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-extrabold">Household go-bag</p>
          <span className="text-xs font-bold tabular-nums text-muted-foreground">
            {done}/{preparednessChecklist.length}
          </span>
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {preparednessChecklist.map((item) => {
            const on = Boolean(checks[item.id]);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left text-xs transition-colors",
                    on
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : "border-border bg-muted/30 hover:bg-muted/50",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border",
                      on
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-muted-foreground/30 bg-background",
                    )}
                  >
                    {on ? <Check className="size-3" aria-hidden /> : null}
                  </span>
                  <span className={cn("font-semibold", on && "text-emerald-900 dark:text-emerald-100")}>
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-[10px] text-muted-foreground">
          Saved on this device only. USSD code to remember:{" "}
          <span className="font-mono font-bold">{USSD_SHORT_CODE}</span>
        </p>
      </section>

      <PhoneExtraTabs
        tabs={[
          {
            id: "tips",
            label: "Tips",
            content: (
              <CitizenQwenPanel
                kind="ready"
                phase={readyPhase}
                ward={ward || "Kondele"}
                county={DEMO_COUNTY}
                checklistDone={preparednessChecklist.filter((c) => checks[c.id]).map((c) => c.label)}
                buttonLabel={readyPhase === "before" ? "Prep plan for my ward" : "Recovery steps"}
                className="border-0 bg-transparent p-0"
              />
            ),
          },
          {
            id: "after",
            label: "After SOS",
            content: lastReport ? (
              <div className="text-xs">
                <p className="font-bold">
                  Ref <span className="font-mono">{lastReport.id.slice(0, 8)}</span>
                </p>
                <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-muted-foreground">
                  {(
                    hazardGuides.find((g) => g.id === (lastReport.category as HazardId))?.after ??
                    hazardGuides[0]?.after ??
                    []
                  ).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No SOS on this phone yet.</p>
            ),
          },
          {
            id: "web",
            label: "Website",
            content: (
              <div className="flex flex-col gap-1.5 text-xs">
                <Link
                  href="/policy"
                  className="inline-flex items-center gap-1 font-bold text-primary underline-offset-2 hover:underline"
                >
                  Policy in plain language
                  <ExternalLink className="size-3" aria-hidden />
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-1 font-bold text-primary underline-offset-2 hover:underline"
                >
                  County map
                  <ExternalLink className="size-3" aria-hidden />
                </Link>
                <Link href="/" className="font-semibold text-muted-foreground underline-offset-2 hover:underline">
                  Website home
                </Link>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
