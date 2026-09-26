"use client";

import { AiSafetyNotice } from "@/components/app/ai-safety-notice";
import { CitizenQwenPanel } from "@/components/app/citizen-qwen-panel";
import { readCitizenWard, readLastReport, saveCitizenWard } from "@/components/app/citizen-sos-tab";
import { drivingStaticPrinciples, walkingStaticPrinciples, type TravelMode } from "@/lib/ai/citizen-safety";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hazardGuides, type HazardId } from "@/lib/content/citizen-guides";
import { DEMO_COUNTY } from "@/lib/data/seed";
import type { Shelter } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Loader2, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function CitizenNowTab({ onGoSos }: { onGoSos: () => void }) {
  const [hazard, setHazard] = useState<HazardId>("flooding");
  const [shelters, setShelters] = useState<Shelter[] | null>(null);
  const [lastReport, setLastReport] = useState<ReturnType<typeof readLastReport>>(null);
  const [ward, setWard] = useState("");
  const [travel, setTravel] = useState<TravelMode>("unsure");

  const guide = useMemo(
    () => hazardGuides.find((g) => g.id === hazard) ?? hazardGuides[0],
    [hazard],
  );

  useEffect(() => {
    setLastReport(readLastReport());
    setWard(readCitizenWard());
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/shelters");
        if (!res.ok) return;
        const data = (await res.json()) as { shelters: Shelter[] };
        if (!cancelled) {
          setShelters(
            data.shelters.filter((s) => s.county === DEMO_COUNTY && s.open).slice(0, 5),
          );
        }
      } catch {
        /* offline */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">
          Tab 2 · Right now
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          During — curated steps first, then optional Qwen for your ward. Not GPS.
        </p>
      </div>

      <AiSafetyNotice />

      {lastReport ? (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs">
          <p className="font-bold text-foreground">Your latest report</p>
          <p className="mt-1 text-muted-foreground">
            Ref <span className="font-mono">{lastReport.id.slice(0, 8)}</span> ·{" "}
            <span className="capitalize">{lastReport.category}</span>. Stay reachable if you gave a
            callback number.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
          Not reported yet?{" "}
          <button
            type="button"
            onClick={onGoSos}
            className="font-bold text-primary underline-offset-2 hover:underline"
          >
            Use SOS tab
          </button>{" "}
          so responders can see you in the queue.
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {hazardGuides.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setHazard(g.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[10px] font-bold",
              hazard === g.id
                ? "bg-teal-600 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {g.label.split(" / ")[0]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="now-ward" className="text-xs font-bold">
          Your ward (for ELMA tips)
        </Label>
        <Input
          id="now-ward"
          value={ward}
          onChange={(e) => {
            setWard(e.target.value);
            saveCitizenWard(e.target.value);
          }}
          placeholder="e.g. Kondele"
          className="min-h-10 rounded-xl text-sm"
        />
      </div>

      {guide ? (
        <div className="flex flex-col gap-3">
          <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
            <p className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-200">
              During — do now (curated)
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-4 text-xs leading-relaxed">
              {guide.doNow.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-xl border border-red-500/25 bg-red-500/5 p-3">
            <p className="text-xs font-bold uppercase text-red-800 dark:text-red-200">Do not</p>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-4 text-xs leading-relaxed">
              {guide.doNot.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-xl border border-border/80 bg-muted/30 p-3">
            <p className="text-xs font-bold uppercase text-foreground">After — when safe later</p>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-4 text-xs leading-relaxed text-muted-foreground">
              {guide.after.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      <div>
        <p className="text-xs font-bold">How are you moving?</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["driving", "In a vehicle"],
              ["walking", "On foot"],
              ["stationary", "Sheltering"],
              ["unsure", "Not sure"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTravel(id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[10px] font-bold",
                travel === id ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900" : "bg-muted",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {travel === "driving" ? (
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-[10px] leading-relaxed text-muted-foreground">
            {drivingStaticPrinciples().map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        ) : null}
        {travel === "walking" ? (
          <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-[10px] leading-relaxed text-muted-foreground">
            {walkingStaticPrinciples().map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <section className="rounded-xl border border-border bg-card p-3">
        <p className="flex items-center gap-2 text-xs font-bold uppercase text-foreground">
          <MapPin className="size-3.5" aria-hidden />
          Where to go · open shelters (not driving directions)
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          Use names below + ward admin / USSD menu 2 — ELMA does not pick roads for you.
        </p>
        {shelters === null ? (
          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
            Loading…
          </p>
        ) : shelters.length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">No open sites listed. Try USSD menu 2.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {shelters.map((s) => (
              <li key={s.id} className="text-xs">
                <span className="font-bold">{s.name}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · {s.ward} · {s.occupancy}/{s.capacity}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <CitizenQwenPanel
        kind="now"
        phase="during"
        travel={travel}
        hazard={hazard}
        ward={ward || "Kondele"}
        county={DEMO_COUNTY}
        description={lastReport?.description}
        buttonLabel="Add Qwen tips for my situation"
      />

      <Button type="button" variant="outline" className="rounded-xl font-bold" onClick={onGoSos}>
        Report a new emergency
      </Button>
    </div>
  );
}
