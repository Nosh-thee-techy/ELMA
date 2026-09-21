"use client";

import { buttonVariants } from "@/components/ui/button-variants";
import type { AreaSummary } from "@/lib/data/dashboard-aggregates";
import { cn, formatKes } from "@/lib/utils";
import { AlertTriangle, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Props = {
  areas: AreaSummary[];
  counties: string[];
};

export function AreaDashboard({ areas, counties }: Props) {
  const [county, setCounty] = useState<string>("all");

  const filtered = useMemo(
    () => (county === "all" ? areas : areas.filter((a) => a.county === county)),
    [areas, county],
  );

  return (
    <div className="flex flex-col gap-5">
      <section className="elma-card p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">
              Step 1 · Pick your area
            </p>
            <p className="mt-2 max-w-xl text-sm font-medium text-muted-foreground">
              Each row is one ward. You see flood-prep money assigned, accountability flags, live
              alerts, open reports, and shelter space — before you open any other page.
            </p>
          </div>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            County
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="h-11 min-w-[12rem] rounded-full border border-border bg-white px-4 font-medium shadow-sm"
            >
              <option value="all">All demo counties</option>
              {counties.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Ward</th>
                <th className="px-4 py-3">Assigned (prep)</th>
                <th className="px-4 py-3">Projects</th>
                <th className="px-4 py-3">Flags</th>
                <th className="px-4 py-3">Safety</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No ward data for this filter yet.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={`${row.county}-${row.ward}`} className="border-b last:border-0">
                    <td className="px-4 py-4">
                      <p className="font-bold text-foreground">{row.ward}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3 shrink-0" aria-hidden />
                        {row.county}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-primary">{formatKes(row.budgetKes)}</p>
                      {row.disbursedKes > 0 ? (
                        <p className="text-xs text-muted-foreground">
                          {formatKes(row.disbursedKes)} disbursed
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 font-medium">{row.projectCount}</td>
                    <td className="px-4 py-4">
                      {row.flagCount > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive">
                          <AlertTriangle className="size-3" aria-hidden />
                          {row.flagCount}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs leading-relaxed text-muted-foreground">
                      <span className="block">
                        {row.verifiedAlerts} verified alert{row.verifiedAlerts === 1 ? "" : "s"}
                      </span>
                      {row.openReports > 0 ? (
                        <span className="block font-semibold text-amber-700">
                          {row.openReports} open report{row.openReports === 1 ? "" : "s"}
                        </span>
                      ) : null}
                      <span className="block">
                        {row.shelterSpacesLeft} shelter space{row.shelterSpacesLeft === 1 ? "" : "s"}{" "}
                        left
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/transparency?county=${encodeURIComponent(row.county)}&ward=${encodeURIComponent(row.ward)}`}
                        className={cn(
                          buttonVariants({ size: "sm" }),
                          "rounded-full font-bold",
                        )}
                      >
                        Details
                        <ArrowRight data-icon="inline-end" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
