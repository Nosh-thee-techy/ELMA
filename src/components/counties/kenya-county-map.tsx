"use client";

import { useLowBandwidth } from "@/components/providers/low-bandwidth-provider";
import type { CountyCardSummary } from "@/lib/data/county-finance";
import { cn, formatKes } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMemo, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";

type Props = {
  counties: CountyCardSummary[];
  selectedSlug?: string;
  onSelect: (slug: string) => void;
  className?: string;
};

export function KenyaCountyMap({ counties, selectedSlug, onSelect, className }: Props) {
  const { lowBandwidth } = useLowBandwidth();
  const [hovered, setHovered] = useState<string | null>(null);

  const center = useMemo(() => ({ lat: 0.0236, lng: 37.9062 }), []);

  if (lowBandwidth) {
    return null;
  }

  return (
    <div
      className={cn(
        "elma-map relative h-[min(70vh,560px)] min-h-[320px] overflow-hidden rounded-2xl border border-border bg-slate-100 shadow-sm",
        className,
      )}
    >
      <Map
        initialViewState={{
          latitude: center.lat,
          longitude: center.lng,
          zoom: 5.65,
        }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={false} />
        {counties.map((c) => {
          const selected = c.slug === selectedSlug;
          const isHover = c.slug === hovered;
          return (
            <Marker
              key={c.slug}
              latitude={c.lat}
              longitude={c.lng}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                onSelect(c.slug);
              }}
            >
              <div
                className="relative flex flex-col items-center"
                onMouseEnter={() => setHovered(c.slug)}
                onMouseLeave={() => setHovered(null)}
              >
                {(isHover || selected) && c.hasDemoData ? (
                  <div className="mb-1 whitespace-nowrap rounded-lg bg-elma-navy px-2.5 py-1.5 text-[10px] font-bold text-white shadow-lg">
                    {c.name} · {formatKes(c.allocatedKes)}
                  </div>
                ) : isHover || selected ? (
                  <div className="mb-1 whitespace-nowrap rounded-lg bg-slate-700 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-lg">
                    {c.name}
                  </div>
                ) : null}
                <button
                  type="button"
                  aria-label={`Select ${c.name}`}
                  className={cn(
                    "size-4 rounded-full border-2 shadow-md transition-transform",
                    selected && "scale-150 ring-4 ring-teal-400/40",
                    c.hasDemoData
                      ? "border-white bg-emerald-600 hover:scale-125"
                      : "border-white bg-slate-400 hover:scale-125",
                  )}
                />
              </div>
            </Marker>
          );
        })}
      </Map>
      <div className="pointer-events-none absolute bottom-3 left-3 flex gap-3 rounded-lg bg-white/95 px-3 py-2 text-[10px] font-semibold text-slate-600 shadow-sm">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-emerald-600" aria-hidden />
          Full data
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-slate-400" aria-hidden />
          Coming soon
        </span>
      </div>
    </div>
  );
}
