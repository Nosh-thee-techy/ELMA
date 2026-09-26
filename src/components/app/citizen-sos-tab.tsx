"use client";

import { CitizenQwenPanel } from "@/components/app/citizen-qwen-panel";
import { ReportForm } from "@/components/emergency/report-form";
import { AiSafetyNotice } from "@/components/app/ai-safety-notice";
import { USSD_SHORT_CODE, type HazardId } from "@/lib/content/citizen-guides";
import type { TravelMode } from "@/lib/ai/citizen-safety";
import { DEMO_COUNTY } from "@/lib/data/seed";
import type { EmergencyReport } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

const LAST_REPORT_KEY = "elma_last_report";
const WARD_KEY = "elma_citizen_ward";

export function saveLastReport(payload: {
  id: string;
  category: string;
  createdAt: string;
  ward: string;
  county: string;
  description: string;
}) {
  try {
    localStorage.setItem(LAST_REPORT_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function readLastReport(): {
  id: string;
  category: string;
  createdAt: string;
  ward?: string;
  county?: string;
  description?: string;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_REPORT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as {
      id: string;
      category: string;
      createdAt: string;
      ward?: string;
      county?: string;
      description?: string;
    };
  } catch {
    return null;
  }
}

export function readCitizenWard(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(WARD_KEY) ?? readLastReport()?.ward ?? "";
}

export function saveCitizenWard(ward: string) {
  try {
    localStorage.setItem(WARD_KEY, ward);
  } catch {
    /* ignore */
  }
}

export function CitizenSosTab() {
  const [followUp, setFollowUp] = useState<EmergencyReport | null>(null);
  const [travel, setTravel] = useState<TravelMode>("unsure");

  useEffect(() => {
    const last = readLastReport();
    if (last?.ward) saveCitizenWard(last.ward);
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="rounded-2xl bg-gradient-to-br from-red-600 to-red-800 p-4 text-white shadow-lg">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-100">Tab 1 · Report</p>
        <p className="mt-1 font-display text-xl leading-tight">Send a ward-scoped SOS</p>
        <p className="mt-2 text-xs leading-relaxed text-red-100/90">
          Same queue as USSD and SMS. Responders see it on the dashboard; events go to the audit
          trail.
        </p>
      </div>

      <AiSafetyNotice />

      <div>
        <p className="text-xs font-bold text-muted-foreground">Are you in a vehicle right now?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["unsure", "Skip"],
              ["driving", "Yes, driving"],
              ["walking", "On foot"],
              ["stationary", "Sheltering"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTravel(id)}
              className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                travel === id ? "bg-red-600 text-white" : "bg-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ReportForm
        embedded
        defaultCounty={DEMO_COUNTY}
        onSuccess={(report) => {
          saveLastReport({
            id: report.id,
            category: report.category,
            createdAt: report.createdAt,
            ward: report.ward,
            county: report.county,
            description: report.description,
          });
          saveCitizenWard(report.ward);
          setFollowUp(report);
        }}
      />

      {followUp ? (
        <CitizenQwenPanel
          kind="sos_followup"
          phase="during"
          travel={travel}
          hazard={followUp.category as HazardId}
          ward={followUp.ward}
          county={followUp.county}
          description={followUp.description}
          buttonLabel="While help is coming — Qwen tips (optional)"
        />
      ) : null}

      <div className="rounded-xl border border-dashed border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
        <p className="font-bold text-foreground">No data bundle?</p>
        <p className="mt-1">
          Dial <span className="font-mono font-bold text-foreground">{USSD_SHORT_CODE}</span> → option{" "}
          <strong>1</strong> to report. Or SMS{" "}
          <span className="font-mono text-[10px]">REPORT|ward|category|details</span>.
        </p>
        <Link
          href="/channels/phone"
          className="mt-2 inline-block font-bold text-primary underline-offset-2 hover:underline"
        >
          Open USSD lab
        </Link>
      </div>
    </div>
  );
}
