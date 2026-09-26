"use client";

import { CitizenQwenPanel } from "@/components/app/citizen-qwen-panel";
import { PhoneExtraTabs } from "@/components/app/phone-extra-tabs";
import { readCitizenWard, readLastReport, saveCitizenWard } from "@/components/app/citizen-sos-tab";
import { drivingStaticPrinciples, walkingStaticPrinciples, type TravelMode } from "@/lib/ai/citizen-safety";
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
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">
            Right now
          </p>
          <p className="text-sm font-extrabold">Do this first</p>
        </div>
        <button
          type="button"
          onClick={onGoSos}
          className="shrink-0 text-[10px] font-bold text-primary underline-offset-2 hover:underline"
        >
          New SOS
        </button>
      </div>

      {lastReport ? (
        <p className="text-[10px] text-muted-foreground">
          Latest ref <span className="font-mono">{lastReport.id.slice(0, 8)}</span> ·{" "}
          <span className="capitalize">{lastReport.category}</span>
        </p>
      ) : (
        <p className="text-[10px] text-muted-foreground">
          Not in the queue yet.{" "}
          <button type="button" onClick={onGoSos} className="font-bold text-primary">
            Use SOS
          </button>
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {hazardGuides.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setHazard(g.id)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-bold",
              hazard === g.id ? "bg-teal-600 text-white" : "bg-muted text-muted-foreground",
            )}
          >
            {g.label.split(" / ")[0]}
          </button>
        ))}
      </div>

      {guide ? (
        <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
          <p className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-200">
            Do now
          </p>
          <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-4 text-xs leading-relaxed">
            {guide.doNow.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="now-ward" className="text-[10px] font-bold">
          Ward
        </Label>
        <Input
          id="now-ward"
          value={ward}
          onChange={(e) => {
            setWard(e.target.value);
            saveCitizenWard(e.target.value);
          }}
          placeholder="e.g. Kondele"
          className="h-9 rounded-xl text-sm"
        />
      </div>

      <PhoneExtraTabs
        tabs={[
          {
            id: "dont",
            label: "Don't",
            content: guide ? (
              <ul className="flex list-disc flex-col gap-1 pl-4 text-xs leading-relaxed">
                {guide.doNot.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null,
          },
          {
            id: "after",
            label: "After",
            content: guide ? (
              <ul className="flex list-disc flex-col gap-1 pl-4 text-xs leading-relaxed text-muted-foreground">
                {guide.after.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : null,
          },
          {
            id: "move",
            label: "Moving",
            content: (
              <div>
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      ["driving", "Vehicle"],
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
                        "rounded-full px-2.5 py-1 text-[10px] font-bold",
                        travel === id
                          ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
                          : "bg-background",
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
            ),
          },
          {
            id: "shelters",
            label: "Shelters",
            content: (
              <div>
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
                  <MapPin className="size-3" aria-hidden />
                  Open sites · not a route
                </p>
                {shelters === null ? (
                  <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="size-3.5 animate-spin" aria-hidden />
                    Loading…
                  </p>
                ) : shelters.length === 0 ? (
                  <p className="mt-2 text-xs text-muted-foreground">None listed. Try USSD menu 2.</p>
                ) : (
                  <ul className="mt-2 flex flex-col gap-1.5">
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
              </div>
            ),
          },
          {
            id: "tips",
            label: "Tips",
            content: (
              <CitizenQwenPanel
                kind="now"
                phase="during"
                travel={travel}
                hazard={hazard}
                ward={ward || "Kondele"}
                county={DEMO_COUNTY}
                description={lastReport?.description}
                buttonLabel="Qwen tips for my situation"
                className="border-0 bg-transparent p-0"
              />
            ),
          },
        ]}
      />
    </div>
  );
}
