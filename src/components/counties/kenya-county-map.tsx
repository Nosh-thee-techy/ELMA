"use client";

import { useLowBandwidth } from "@/components/providers/low-bandwidth-provider";
import type { KenyaCounty } from "@/lib/data/counties";
import { cn } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";

type Props = {
  counties: KenyaCounty[];
  selectedSlug?: string;
  className?: string;
};

export function KenyaCountyMap({ counties, selectedSlug, className }: Props) {
  const router = useRouter();
  const { lowBandwidth } = useLowBandwidth();

  const center = useMemo(() => ({ lat: 0.0236, lng: 37.9062 }), []);

  if (lowBandwidth) {
    return (
      <div className={cn("rounded-2xl border border-dashed border-border bg-muted/40 p-4", className)}>
        <p className="text-sm font-semibold text-foreground">Choose a county (lite mode)</p>
        <ul className="mt-3 flex flex-col gap-2">
          {counties.map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                className="w-full rounded-xl bg-white px-4 py-3 text-left text-sm font-bold shadow-sm"
                onClick={() => router.push(`/counties/${c.slug}`)}
              >
                {c.name}
                {!c.hasDemoData ? (
                  <span className="ml-2 text-xs font-medium text-muted-foreground">· preview</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "elma-map h-[min(70vh,520px)] overflow-hidden rounded-2xl border border-border shadow-sm",
        className,
      )}
    >
      <Map
        initialViewState={{
          latitude: center.lat,
          longitude: center.lng,
          zoom: 5.6,
        }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={false} />
        {counties.map((c) => {
          const selected = c.slug === selectedSlug;
          return (
            <Marker
              key={c.slug}
              latitude={c.lat}
              longitude={c.lng}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                router.push(`/counties/${c.slug}`);
              }}
            >
              <button
                type="button"
                title={`Open ${c.name}`}
                className={cn(
                  "flex min-w-[4.5rem] flex-col items-center gap-0.5 rounded-full border-2 px-2 py-1.5 text-center shadow-md transition hover:scale-105",
                  selected
                    ? "border-white bg-primary text-xs font-extrabold text-white"
                    : c.hasDemoData
                      ? "border-primary/30 bg-white text-[10px] font-bold text-primary"
                      : "border-border bg-white/90 text-[10px] font-semibold text-muted-foreground",
                )}
              >
                <span className="max-w-[5rem] truncate">{c.name}</span>
              </button>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
}
