"use client";

import { CountyPortalView } from "@/components/counties/county-portal-view";
import { KenyaCountyMap } from "@/components/counties/kenya-county-map";
import { DataSourcesPanel } from "@/components/transparency/data-sources-panel";
import { buttonVariants } from "@/components/ui/button-variants";
import type { CountyCardSummary, CountyPortalData } from "@/lib/data/county-finance";
import { cn, formatKes } from "@/lib/utils";
import { ArrowRight, Building2, MapPin, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Props = {
  summaries: CountyCardSummary[];
  portalBySlug: Record<string, CountyPortalData | null>;
};

export function KenyaVaultExplorer({ summaries, portalBySlug }: Props) {
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>("kisumu");
  const [expanded, setExpanded] = useState(false);

  const selected = useMemo(
    () => summaries.find((s) => s.slug === selectedSlug),
    [summaries, selectedSlug],
  );
  const portal = selectedSlug ? portalBySlug[selectedSlug] : null;

  return (
    <div className="flex flex-col gap-10">
      <section className="relative overflow-hidden rounded-3xl bg-elma-navy shadow-2xl ring-1 ring-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0d9488_0%,_transparent_55%)] opacity-40" aria-hidden />
        <div className="relative grid min-h-[min(88vh,820px)] lg:grid-cols-[1fr_min(420px,38vw)]">
          <div className="relative flex min-h-[360px] flex-col p-4 sm:p-6 lg:min-h-0">
            <div className="mb-3 max-w-lg">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">
                Kenya transparency map
              </p>
              <h1 className="text-balance text-2xl font-extrabold text-white sm:text-3xl">
                Pick a county. Follow the money. See who published it.
              </h1>
            </div>
            <KenyaCountyMap
              counties={summaries}
              selectedSlug={selectedSlug}
              onSelect={(slug) => {
                setSelectedSlug(slug);
                setExpanded(false);
              }}
              className="min-h-[280px] flex-1 border-white/10 shadow-inner lg:min-h-[480px]"
            />
          </div>

          <aside className="flex flex-col border-t border-white/10 bg-slate-950/75 backdrop-blur-md lg:border-t-0 lg:border-l">
            {!selected ? (
              <div className="flex flex-1 flex-col justify-center p-8 text-center text-white/70">
                <MapPin className="mx-auto mb-3 size-10 text-teal-400" aria-hidden />
                <p className="font-semibold">Tap a pin on the map</p>
                <p className="mt-2 text-sm">Green = full demo data for this season</p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2 border-b border-white/10 p-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-teal-400">
                      {selected.hasDemoData ? "Full data" : "Coming soon"}
                    </p>
                    <h2 className="text-2xl font-extrabold text-white">{selected.name}</h2>
                  </div>
                  <button
                    type="button"
                    className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
                    aria-label="Clear selection"
                    onClick={() => setSelectedSlug(undefined)}
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 text-sm text-white/85">
                  {selected.hasDemoData ? (
                    <>
                      <p className="text-3xl font-extrabold tabular-nums text-emerald-400">
                        {formatKes(selected.allocatedKes)}
                      </p>
                      <p className="mt-1 text-white/60">Allocated in demo El Niño window</p>
                      {portal?.projects[0] ? (
                        <div className="mt-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                          <p className="flex items-center gap-2 text-xs font-bold uppercase text-teal-300">
                            <Building2 className="size-3.5" aria-hidden />
                            Who is on the ground
                          </p>
                          <p className="mt-2 font-bold text-white">{portal.projects[0].contractor}</p>
                          <p className="mt-1 text-white/60">{portal.projects[0].title}</p>
                        </div>
                      ) : null}
                      <p className="mt-6 text-xs leading-relaxed text-white/50">
                        Sources: county ADP portals, e-procurement notices, and field verification
                        labels in the demo dataset — same shape as live Track 2 feeds.
                      </p>
                    </>
                  ) : (
                    <p className="text-white/70">
                      This county profile is not published yet. Try Kisumu, Nairobi, or Garissa on
                      the map.
                    </p>
                  )}
                  <div className="mt-6 flex flex-col gap-2">
                    <Link
                      href="/policy"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "rounded-xl border-white/20 bg-transparent font-bold text-white hover:bg-white/10",
                      )}
                    >
                      Policy in plain language
                    </Link>
                    {selected.hasDemoData ? (
                      <button
                        type="button"
                        className={cn(
                          buttonVariants(),
                          "rounded-xl bg-emerald-500 font-bold hover:bg-emerald-400",
                        )}
                        onClick={() => setExpanded(true)}
                      >
                        Full county brief
                        <ArrowRight data-icon="inline-end" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </aside>
        </div>
      </section>

      {expanded && portal ? (
        <section className="elma-card p-6 sm:p-8">
          <CountyPortalView data={portal} />
        </section>
      ) : null}

      <DataSourcesPanel />
    </div>
  );
}
