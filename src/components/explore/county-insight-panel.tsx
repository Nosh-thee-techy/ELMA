import {
  countyDataLayers,
  elmaVsGenericPortals,
  financeSourceSnippets,
} from "@/lib/data/county-provenance";
import type { CountyCardSummary } from "@/lib/data/county-finance";
import type { CountyPortalData } from "@/lib/data/county-finance";
import { cn, formatKes } from "@/lib/utils";
import { Building2, Database, MapPin, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";

const statusStyle = {
  demo_seed: "bg-amber-500/20 text-amber-100 ring-amber-400/30",
  live_shape: "bg-emerald-500/20 text-emerald-100 ring-emerald-400/30",
  official_target: "bg-white/10 text-white/70 ring-white/20",
} as const;

const statusLabel = {
  demo_seed: "Demo data",
  live_shape: "Live geometry",
  official_target: "Target ingest",
} as const;

export function CountyInsightPanel({
  selected,
  portal,
  onClear,
  onExpand,
}: {
  selected: CountyCardSummary;
  portal: CountyPortalData | null;
  onClear: () => void;
  onExpand: () => void;
}) {
  const layers = countyDataLayers(selected.hasDemoData);
  const financeNotes = financeSourceSnippets(portal);

  return (
    <>
      <div className="flex items-start justify-between gap-2 border-b border-white/10 p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-teal-400">
            {selected.hasDemoData ? "Published demo profile" : "Boundary only · funds not loaded"}
          </p>
          <h2 className="text-2xl font-extrabold text-white">{selected.name}</h2>
          <p className="mt-1 font-mono text-[10px] text-white/45">ADM1 · Kenya · slug {selected.slug}</p>
        </div>
        <button
          type="button"
          className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
          aria-label="Clear selection"
          onClick={onClear}
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 text-sm text-white/85">
        <section>
          <p className="flex items-center gap-2 text-xs font-bold uppercase text-white/60">
            <Database className="size-3.5" aria-hidden />
            What you are seeing (data layers)
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {layers.map((layer) => (
              <li
                key={layer.id}
                className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-white">{layer.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1",
                      statusStyle[layer.status],
                    )}
                  >
                    {statusLabel[layer.status]}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-white/60">{layer.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        {selected.hasDemoData ? (
          <>
            <p className="mt-6 text-3xl font-extrabold tabular-nums text-emerald-400">
              {formatKes(selected.allocatedKes)}
            </p>
            <p className="mt-1 text-white/60">Demo El Niño window · county received (seed)</p>
            {financeNotes.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-1 text-xs text-white/55">
                {financeNotes.map((note) => (
                  <li key={note}>· {note}</li>
                ))}
              </ul>
            ) : null}
            {portal?.projects[0] ? (
              <div className="mt-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="flex items-center gap-2 text-xs font-bold uppercase text-teal-300">
                  <Building2 className="size-3.5" aria-hidden />
                  Sample contractor (demo project)
                </p>
                <p className="mt-2 font-bold text-white">{portal.projects[0].contractor}</p>
                <p className="mt-1 text-white/60">{portal.projects[0].title}</p>
              </div>
            ) : null}
          </>
        ) : (
          <p className="mt-6 rounded-xl bg-white/5 p-4 text-sm text-white/70">
            This county appears on the map with{" "}
            <strong className="text-white">real boundaries</strong>. Fund and tender lines are not
            seeded yet — pick a green county for a full brief.
          </p>
        )}

        <section className="mt-6">
          <p className="flex items-center gap-2 text-xs font-bold uppercase text-white/60">
            <ShieldCheck className="size-3.5" aria-hidden />
            How ELMA differs from a typical county website
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {elmaVsGenericPortals().slice(0, 3).map((d) => (
              <li key={d.title} className="text-xs leading-relaxed text-white/65">
                <span className="font-bold text-white">{d.title}. </span>
                {d.body}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href={`/counties/${selected.slug}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-xl border-white/20 bg-transparent font-bold text-white hover:bg-white/10",
            )}
          >
            <MapPin data-icon="inline-start" />
            County page
          </Link>
          <Link
            href="/policy"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-xl border-white/20 bg-transparent font-bold text-white hover:bg-white/10",
            )}
          >
            Policy (Qwen)
          </Link>
          {selected.hasDemoData ? (
            <button
              type="button"
              className={cn(
                buttonVariants(),
                "rounded-xl bg-emerald-500 font-bold hover:bg-emerald-400",
              )}
              onClick={onExpand}
            >
              Full county brief below
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
