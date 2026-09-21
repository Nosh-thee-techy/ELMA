"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Shelter, ShelterOperationalStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
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

export function ResponderQuickUpdate({ shelter }: { shelter: Shelter }) {
  const router = useRouter();
  const [occupancy, setOccupancy] = useState(shelter.occupancy);
  const [status, setStatus] = useState<ShelterOperationalStatus>(
    shelter.status ?? "OPEN",
  );
  const [needs, setNeeds] = useState<string[]>(shelter.resourceNeeds ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="elma-card flex flex-col gap-4 p-4 sm:p-5">
      <div>
        <p className="font-extrabold text-elma-navy dark:text-slate-50">{shelter.name}</p>
        <p className="text-xs text-muted-foreground">
          {shelter.ward} · max {shelter.capacity}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="min-h-14 flex-1 rounded-2xl text-lg font-extrabold"
          disabled={loading}
          onClick={() => bump(-10)}
        >
          −10
        </Button>
        <p className="min-w-[4rem] text-center text-2xl font-extrabold tabular-nums">{occupancy}</p>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="min-h-14 flex-1 rounded-2xl text-lg font-extrabold"
          disabled={loading}
          onClick={() => bump(10)}
        >
          +10
        </Button>
      </div>

      <Button
        type="button"
        variant="destructive"
        className="min-h-12 rounded-2xl font-bold"
        disabled={loading}
        onClick={() => {
          setOccupancy(shelter.capacity);
          setStatus("FULL");
        }}
      >
        Set full
      </Button>

      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            disabled={loading}
            onClick={() => setStatus(s)}
            className={cn(
              "rounded-full px-3 py-2 text-xs font-bold uppercase tracking-wide",
              status === s
                ? "bg-emerald-600 text-white"
                : "bg-muted text-muted-foreground",
            )}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <fieldset className="flex flex-col gap-2">
        <Label className="text-xs font-bold uppercase text-muted-foreground">Urgent needs</Label>
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
                  "rounded-full px-3 py-1.5 text-xs font-semibold",
                  on ? "bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100" : "bg-muted",
                )}
              >
                {need}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1 text-sm font-semibold">
        Ground photo
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:font-bold file:text-white"
          onChange={() => {
            /* PoC: upload wiring to storage in production */
          }}
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          className="min-h-12 rounded-2xl font-bold"
          disabled={loading}
          onClick={() => void save(true)}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Save open"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-h-12 rounded-2xl font-bold"
          disabled={loading}
          onClick={() => void save(false)}
        >
          Mark closed
        </Button>
      </div>
      {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}
    </div>
  );
}
