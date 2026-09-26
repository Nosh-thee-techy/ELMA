"use client";

import { CountyMapMarker } from "@/components/maps/county-map-marker";
import { useLowBandwidth } from "@/components/providers/low-bandwidth-provider";
import type { CountyCardSummary } from "@/lib/data/county-finance";
import { mapStyleForTheme } from "@/lib/maps/styles";
import { cn, formatKes } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "@/components/providers/theme-provider";
import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, NavigationControl, ScaleControl } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";

type Props = {
  counties: CountyCardSummary[];
  selectedSlug?: string;
  onSelect: (slug: string) => void;
  className?: string;
};

export function KenyaCountyMap({ counties, selectedSlug, onSelect, className }: Props) {
  const { lowBandwidth } = useLowBandwidth();
  const { theme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const center = useMemo(() => ({ lat: 0.0236, lng: 37.9062 }), []);
  const mapStyle = mapStyleForTheme(theme);

  useEffect(() => {
    if (!mapReady || !selectedSlug) return;
    const county = counties.find((c) => c.slug === selectedSlug);
    if (!county) return;
    mapRef.current?.flyTo({
      center: [county.lng, county.lat],
      zoom: 7.4,
      duration: 1100,
      essential: true,
    });
  }, [selectedSlug, counties, mapReady]);

  if (lowBandwidth) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-white/80">
        <p className="font-bold">Lite mode — pick a county from the list</p>
        <ul className="grid grid-cols-2 gap-1 text-xs">
          {counties
            .filter((c) => c.hasDemoData)
            .map((c) => (
              <li key={c.slug}>
                <button
                  type="button"
                  className="w-full rounded-lg bg-white/10 px-2 py-1.5 text-left font-semibold hover:bg-white/20"
                  onClick={() => onSelect(c.slug)}
                >
                  {c.name}
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
        "elma-map relative min-h-[320px] flex-1 overflow-hidden rounded-2xl border border-white/15 bg-slate-900/40 shadow-inner ring-1 ring-white/10",
        className,
      )}
    >
      <Map
        ref={mapRef}
        onLoad={() => setMapReady(true)}
        initialViewState={{
          latitude: center.lat,
          longitude: center.lng,
          zoom: 5.85,
        }}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" showCompass={false} visualizePitch={false} />
        <ScaleControl position="bottom-left" maxWidth={100} unit="metric" />
        {counties.map((c) => {
          const selected = c.slug === selectedSlug;
          const isHover = c.slug === hovered;
          const showLabel = isHover || selected;
          const label = showLabel
            ? c.hasDemoData
              ? `${c.name} · ${formatKes(c.allocatedKes)}`
              : c.name
            : undefined;

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
                className="cursor-pointer"
                onMouseEnter={() => setHovered(c.slug)}
                onMouseLeave={() => setHovered(null)}
              >
                <CountyMapMarker
                  selected={selected}
                  hasDemoData={c.hasDemoData}
                  label={label}
                  showLabel={showLabel}
                />
              </div>
            </Marker>
          );
        })}
      </Map>
      <div className="pointer-events-none absolute left-3 top-3 rounded-xl bg-white/95 px-3 py-2 text-[10px] font-bold text-slate-700 shadow-md ring-1 ring-black/5 dark:bg-slate-900/90 dark:text-slate-200">
        Republic of Kenya · 47 counties
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 flex gap-3 rounded-xl bg-white/95 px-3 py-2 text-[10px] font-semibold text-slate-600 shadow-md ring-1 ring-black/5 dark:bg-slate-900/90 dark:text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" aria-hidden />
          Published data
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-slate-400 ring-2 ring-white" aria-hidden />
          Coming soon
        </span>
      </div>
    </div>
  );
}
