"use client";

import { FundFlowPanel } from "@/components/counties/fund-flow-panel";
import { TenderPipelineCard } from "@/components/counties/tender-pipeline-card";
import type { CountyPortalData, HazardPeriod } from "@/lib/data/county-finance";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

const PERIOD_ORDER: HazardPeriod[] = ["el_nino", "floods", "drought"];

export function CountyPortalView({ data }: { data: CountyPortalData }) {
  const [period, setPeriod] = useState<HazardPeriod>("el_nino");
  const active = data.periods.find((p) => p.period === period) ?? data.periods[0];

  if (!active) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        {PERIOD_ORDER.map((key) => {
          const label = data.periods.find((p) => p.period === key)?.label ?? key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setPeriod(key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-bold transition",
                period === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-white text-foreground ring-1 ring-border hover:bg-muted",
              )}
            >
              {label.split(" · ")[0] ?? label}
            </button>
          );
        })}
      </div>

      {!data.hasDemoData ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
          This county is on the map for navigation. Full fund and tender demo data is available for
          Kisumu, Nairobi, Garissa, and Kilifi.
        </p>
      ) : null}

      <FundFlowPanel period={active} />

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-extrabold">Tenders & ward projects</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            How allocations became contracts — and how far work has reached on the ground.
          </p>
        </div>
        {data.projects.length === 0 ? (
          <p className="elma-card p-6 text-sm text-muted-foreground">
            No ward-level projects published for this county in the demo dataset yet.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {data.projects.map((p) => (
              <li key={p.id}>
                <TenderPipelineCard project={p} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-extrabold">What you can access here</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            During {active.label.toLowerCase()} in {data.countyName} — help and programmes linked to
            your ward.
          </p>
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {data.citizenAccess.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="elma-card block h-full p-5 transition hover:shadow-md"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-primary">{item.tag}</p>
                <p className="mt-2 font-extrabold">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
