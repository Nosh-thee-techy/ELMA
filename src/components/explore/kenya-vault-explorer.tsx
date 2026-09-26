"use client";

import { CountyPortalView } from "@/components/counties/county-portal-view";
import { KenyaCountyMap } from "@/components/counties/kenya-county-map";
import { DataSourcesPanel } from "@/components/transparency/data-sources-panel";
import { buttonVariants } from "@/components/ui/button-variants";
import type { CountyCardSummary, CountyPortalData } from "@/lib/data/county-finance";
import { cn, formatKes } from "@/lib/utils";
import { ArrowRight, Building2, MapPin, Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Props = {
  summaries: CountyCardSummary[];
  portalBySlug: Record<string, CountyPortalData | null>;
};

export function KenyaVaultExplorer({ summaries, portalBySlug }: Props) {
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>("kisumu");
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");

  const demoCounties = useMemo(
    () => summaries.filter((s) => s.hasDemoData),
    [summaries],
  );

  const filteredChips = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return demoCounties;
    return summaries.filter((s) => s.name.toLowerCase().includes(q));
  }, [query, summaries, demoCounties]);

  const selected = useMemo(
    () => summaries.find((s) => s.slug === selectedSlug),
    [summaries, selectedSlug],
  );
  const portal = selectedSlug ? portalBySlug[selectedSlug] : null;

  return (
    <div className="flex flex-col gap-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-elma-navy shadow-2xl ring-1 ring-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0d9488_0%,_transparent_55%)] opacity-40" aria-hidden />
        <div className="elma-hero-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />

        <div className="relative border-b border-white/10 px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">
            Hackathon demo · Track 2 transparency
          </p>
          <h1 className="font-display mt-2 max-w-3xl text-balance text-3xl text-white sm:text-4xl">
            Kenya fund map — pick a county, follow the money, see who published it.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
            Green pins have full demo profiles (Kisumu, Nairobi, Garissa, and more). Tap the map or
            jump from the list below.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative max-w-md flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find your county…"
                className="h-11 w-full rounded-full border border-white/15 bg-white/10 pl-10 pr-4 text-sm font-medium text-white placeholder:text-white/40 outline-none ring-teal-400/30 focus:ring-2"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {filteredChips.slice(0, 6).map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => {
                    setSelectedSlug(c.slug);
                    setExpanded(false);
                  }}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                    selectedSlug === c.slug
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-white/10 text-white/90 hover:bg-white/20",
                    !c.hasDemoData && "opacity-60",
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative grid min-h-[min(72vh,780px)] lg:grid-cols-[1fr_min(400px,36vw)]">
          <div className="relative flex min-h-[360px] flex-col p-4 sm:p-6 lg:min-h-[480px]">
            <KenyaCountyMap
              counties={summaries}
              selectedSlug={selectedSlug}
              onSelect={(slug) => {
                setSelectedSlug(slug);
                setExpanded(false);
              }}
              className="min-h-[300px] flex-1 lg:min-h-[520px]"
            />
          </div>

          <aside className="flex flex-col border-t border-white/10 bg-slate-950/80 backdrop-blur-md lg:border-t-0 lg:border-l">
            {!selected ? (
              <div className="flex flex-1 flex-col justify-center p-8 text-center text-white/70">
                <MapPin className="mx-auto mb-3 size-10 text-teal-400" aria-hidden />
                <p className="font-semibold">Tap a pin on the map</p>
                <p className="mt-2 text-sm">Green = published demo data for this season</p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2 border-b border-white/10 p-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-teal-400">
                      {selected.hasDemoData ? "Published profile" : "Coming soon"}
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
                        labels — same shape as live Track 2 feeds.
                      </p>
                    </>
                  ) : (
                    <p className="text-white/70">
                      This county is not published yet. Try{" "}
                      {demoCounties.slice(0, 3).map((c) => c.name).join(", ")} on the map.
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
