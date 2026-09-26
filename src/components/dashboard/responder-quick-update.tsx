"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Shelter, ShelterOperationalStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Loader2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NEED_OPTIONS = [
  "Water purification",
  "Blankets",
  "Mattresses",
  "Food kits",
  "Medical supplies",
  "Power / lighting",
] as const;

const STATUS_OPTIONS: ShelterOperationalStatus[] = [
  "OPEN",
  "NEAR_CAPACITY",
  "FULL",
  "CLOSED",
];

const STATUS_STYLE: Record<ShelterOperationalStatus, string> = {
  OPEN: "bg-emerald-600 text-white shadow-emerald-900/20",
  NEAR_CAPACITY: "bg-amber-500 text-white shadow-amber-900/20",
  FULL: "bg-red-600 text-white shadow-red-900/20",
  CLOSED: "bg-slate-600 text-white",
};

export function ResponderQuickUpdate({ shelter }: { shelter: Shelter }) {
  const router = useRouter();
  const [occupancy, setOccupancy] = useState(shelter.occupancy);
  const [status, setStatus] = useState<ShelterOperationalStatus>(
    shelter.status ?? "OPEN",
  );
  const [needs, setNeeds] = useState<string[]>(shelter.resourceNeeds ?? []);
  const [mediaUrls, setMediaUrls] = useState<string[]>(shelter.mediaProofUrls ?? []);
  const [captureMeta, setCaptureMeta] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillPct = shelter.capacity > 0 ? Math.min(100, (occupancy / shelter.capacity) * 100) : 0;

  async function save(open: boolean) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/shelters/${shelter.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occupancy,
          open,
          status,
          resourceNeeds: needs,
          mediaProofUrls: mediaUrls,
          fieldCaptureNote: captureMeta ?? undefined,
        }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Update failed");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  function bump(delta: number) {
    setOccupancy((o) => Math.max(0, Math.min(shelter.capacity, o + delta)));
  }

  return (
    <article className="elma-card overflow-hidden ring-1 ring-border/80">
      <div className="h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600" aria-hidden />
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-lg font-extrabold tracking-tight text-elma-navy dark:text-slate-50">
              {shelter.name}
            </p>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
              {shelter.ward} · capacity {shelter.capacity}
            </p>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm",
              STATUS_STYLE[status],
            )}
          >
            {status.replace("_", " ")}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" aria-hidden />
              Occupancy
            </span>
            <span className="tabular-nums text-foreground">
              {occupancy} / {shelter.capacity}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                fillPct >= 95 ? "bg-red-500" : fillPct >= 75 ? "bg-amber-500" : "bg-emerald-500",
              )}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="min-h-14 flex-1 rounded-2xl border-2 text-lg font-extrabold"
            disabled={loading}
            onClick={() => bump(-10)}
          >
            −10
          </Button>
          <p className="min-w-[4.5rem] text-center text-3xl font-extrabold tabular-nums tracking-tight">
            {occupancy}
          </p>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="min-h-14 flex-1 rounded-2xl border-2 text-lg font-extrabold"
            disabled={loading}
            onClick={() => bump(10)}
          >
            +10
          </Button>
        </div>

        <Button
          type="button"
          variant="destructive"
          className="min-h-11 rounded-xl font-bold"
          disabled={loading}
          onClick={() => {
            setOccupancy(shelter.capacity);
            setStatus("FULL");
          }}
        >
          Mark at capacity
        </Button>

        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              disabled={loading}
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-wide transition-all",
                status === s
                  ? STATUS_STYLE[s]
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        <fieldset className="flex flex-col gap-2">
          <Label className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Urgent needs
          </Label>
          <div className="flex flex-wrap gap-2">
            {NEED_OPTIONS.map((need) => {
              const on = needs.includes(need);
              return (
                <button
                  key={need}
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setNeeds((n) => (on ? n.filter((x) => x !== need) : [...n, need]))
                  }
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                    on
                      ? "bg-amber-100 text-amber-950 ring-1 ring-amber-300/50 dark:bg-amber-950 dark:text-amber-100"
                      : "bg-muted/80 text-muted-foreground hover:bg-muted",
                  )}
                >
                  {need}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Ground photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="text-xs file:mr-2 file:rounded-xl file:border-0 file:bg-gradient-to-r file:from-emerald-600 file:to-teal-600 file:px-4 file:py-2.5 file:font-bold file:text-white"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = typeof reader.result === "string" ? reader.result : "";
                if (!dataUrl) return;
                setMediaUrls((urls) => [...urls, dataUrl].slice(-3));
                const stamp = new Date().toISOString();
                if ("geolocation" in navigator) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      setCaptureMeta(
                        `Captured ${stamp} · GPS ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)} ±${Math.round(pos.coords.accuracy)}m`,
                      );
                    },
                    () => setCaptureMeta(`Captured ${stamp} · GPS unavailable`),
                    { enableHighAccuracy: true, timeout: 8000 },
                  );
                } else {
                  setCaptureMeta(`Captured ${stamp}`);
                }
              };
              reader.readAsDataURL(file);
            }}
          />
          {captureMeta ? (
            <p className="text-xs font-normal text-muted-foreground">{captureMeta}</p>
          ) : null}
        </label>

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            className="min-h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold shadow-md hover:from-emerald-500 hover:to-teal-500"
            disabled={loading}
            onClick={() => void save(true)}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Save open"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-12 rounded-xl font-bold"
            disabled={loading}
            onClick={() => void save(false)}
          >
            Mark closed
          </Button>
        </div>
        {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}
      </div>
    </article>
  );
}
