"use client";

import { CountyPortalView } from "@/components/counties/county-portal-view";
import { KenyaCountyMap } from "@/components/counties/kenya-county-map";
import { CountyInsightPanel } from "@/components/explore/county-insight-panel";
import { DataSourcesPanel } from "@/components/transparency/data-sources-panel";
import { displayNameFromSlug } from "@/lib/data/counties";
import type { CountyCardSummary, CountyPortalData } from "@/lib/data/county-finance";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function resolveSummary(slug: string | undefined, summaries: CountyCardSummary[]): CountyCardSummary | undefined {
  if (!slug) return undefined;
  const hit = summaries.find((s) => s.slug === slug);
  if (hit) return hit;
  return {
    slug,
    name: displayNameFromSlug(slug),
    lat: 0,
    lng: 0,
    allocatedKes: 0,
    hasDemoData: false,
  };
}

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
    () => resolveSummary(selectedSlug, summaries),
    [summaries, selectedSlug],
  );
  const portal = selectedSlug ? portalBySlug[selectedSlug] : null;
  const briefSectionRef = useRef<HTMLElement>(null);
  const scrollToBriefRef = useRef(false);

  const handleExpandBrief = useCallback(() => {
    scrollToBriefRef.current = true;
    setExpanded(true);
  }, []);

  useEffect(() => {
    if (!expanded || !portal || !scrollToBriefRef.current) return;
    scrollToBriefRef.current = false;
    briefSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [expanded, portal]);

  return (
    <div className="flex flex-col gap-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-elma-navy shadow-2xl ring-1 ring-white/10">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0d9488_0%,_transparent_55%)] opacity-40"
          aria-hidden
        />
        <div className="elma-hero-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />

        <div className="relative border-b border-white/10 px-4 py-5 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">
            Hackathon demo · Track 2 transparency
          </p>
          <h1 className="font-display mt-2 max-w-3xl text-balance text-3xl text-white sm:text-4xl">
            Kenya fund map — pick a county, follow the money, see who published it.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">
            The map is real Kenya county geometry (geoBoundaries). Green shading = demo fund profiles
            (Kisumu, Nairobi, Garissa, Kilifi). Click any county to see what data is live vs seeded.
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
          <div className="relative z-0 flex min-h-[360px] min-w-0 flex-col overflow-hidden p-4 sm:p-6 lg:min-h-[480px]">
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

          <aside className="relative z-10 flex flex-col border-t border-white/10 bg-slate-950/80 backdrop-blur-md lg:border-t-0 lg:border-l">
            {!selected ? (
              <div className="flex flex-1 flex-col justify-center p-8 text-center text-white/70">
                <p className="font-semibold">Click a county on the map</p>
                <p className="mt-2 text-sm">
                  We show boundary source, whether funds are demo or live-target, and how ELMA differs
                  from a PDF portal.
                </p>
              </div>
            ) : (
              <CountyInsightPanel
                selected={selected}
                portal={portal}
                onClear={() => setSelectedSlug(undefined)}
                onExpand={handleExpandBrief}
              />
            )}
          </aside>
        </div>
      </section>

      {expanded && portal ? (
        <section ref={briefSectionRef} className="elma-card scroll-mt-24 p-6 sm:p-8">
          <CountyPortalView data={portal} />
        </section>
      ) : null}

      <DataSourcesPanel />
    </div>
  );
}
