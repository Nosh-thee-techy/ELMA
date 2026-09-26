"use client";

import { Button } from "@/components/ui/button";
import type { EmergencyReport } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Loader2, Radio, Siren } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_LABEL: Record<EmergencyReport["status"], string> = {
  open: "Open",
  dispatched: "Dispatched",
  resolved: "Resolved",
};

const STATUS_STYLE: Record<EmergencyReport["status"], string> = {
  open: "bg-red-500/15 text-red-700 ring-red-500/30 dark:text-red-300",
  dispatched: "bg-amber-500/15 text-amber-900 ring-amber-500/30 dark:text-amber-200",
  resolved: "bg-emerald-500/15 text-emerald-800 ring-emerald-500/30 dark:text-emerald-200",
};

export function SosQueuePanel({
  reports,
  canUpdate,
}: {
  reports: EmergencyReport[];
  canUpdate: boolean;
}) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openCount = reports.filter((r) => r.status === "open").length;
  const active = reports.filter((r) => r.status !== "resolved");

  async function setStatus(reportId: string, status: EmergencyReport["status"]) {
    setLoadingId(reportId);
    setError(null);
    try {
      const res = await fetch(`/api/reports/${reportId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Update failed");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="elma-card overflow-hidden ring-1 ring-red-500/10">
      <div className="h-1 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" aria-hidden />
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
              <Siren className="size-4" aria-hidden />
              SOS queue
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Same pipeline as USSD option 1 and SMS <span className="font-mono text-xs">REPORT|…</span>
            </p>
          </div>
          <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold tabular-nums text-red-700 dark:text-red-300">
            {openCount} open
          </span>
        </div>

        {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}

        {active.length === 0 ? (
          <p className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
            No active SOS in your scope. Citizens can report via{" "}
            <span className="font-semibold text-foreground">*384*253#</span> or the web form on{" "}
            <span className="font-semibold text-foreground">/emergency</span>.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {active.map((report) => (
              <li
                key={report.id}
                className="rounded-xl border border-border/80 bg-card/80 p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-extrabold capitalize text-foreground">{report.category}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.ward}, {report.county} · {formatRelativeTime(report.createdAt)}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                      Ref {report.id.slice(0, 8)}
                      {report.contact ? ` · …${report.contact.slice(-4)}` : null}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1",
                      STATUS_STYLE[report.status],
                    )}
                  >
                    {STATUS_LABEL[report.status]}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">{report.description}</p>
                {canUpdate ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {report.status === "open" ? (
                      <Button
                        type="button"
                        size="sm"
                        className="rounded-full font-bold"
                        disabled={loadingId === report.id}
                        onClick={() => void setStatus(report.id, "dispatched")}
                      >
                        {loadingId === report.id ? (
                          <Loader2 className="animate-spin" data-icon="inline-start" />
                        ) : (
                          <Radio data-icon="inline-start" />
                        )}
                        Mark dispatched
                      </Button>
                    ) : null}
                    {report.status !== "resolved" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-full font-bold"
                        disabled={loadingId === report.id}
                        onClick={() => void setStatus(report.id, "resolved")}
                      >
                        Mark resolved
                      </Button>
                    ) : null}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {reports.some((r) => r.status === "resolved") ? (
          <details className="text-sm text-muted-foreground">
            <summary className="cursor-pointer font-semibold text-foreground">
              Resolved ({reports.filter((r) => r.status === "resolved").length})
            </summary>
            <ul className="mt-2 flex flex-col gap-2">
              {reports
                .filter((r) => r.status === "resolved")
                .map((r) => (
                  <li key={r.id} className="rounded-lg bg-muted/50 px-3 py-2 text-xs">
                    <span className="font-bold capitalize">{r.category}</span> · {r.ward} · ref{" "}
                    {r.id.slice(0, 8)}
                  </li>
                ))}
            </ul>
          </details>
        ) : null}
      </div>
    </section>
  );
}
