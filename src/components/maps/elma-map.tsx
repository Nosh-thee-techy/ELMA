"use client";

import { useLowBandwidth } from "@/components/providers/low-bandwidth-provider";
import { cn } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMemo } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";

export type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  tone?: "primary" | "clay" | "alert";
};

const toneClass = {
  primary: "bg-primary border-primary-foreground/30",
  clay: "bg-elma-clay border-white/40",
  alert: "bg-destructive border-white/40",
};

export function ElmaMap({
  points,
  className,
  initialZoom = 12,
}: {
  points: MapPoint[];
  className?: string;
  initialZoom?: number;
}) {
  const { lowBandwidth } = useLowBandwidth();

  const center = useMemo(() => {
    if (points.length === 0) return { lat: -0.091, lng: 34.755 };
    const lat = points.reduce((s, p) => s + p.lat, 0) / points.length;
    const lng = points.reduce((s, p) => s + p.lng, 0) / points.length;
    return { lat, lng };
  }, [points]);

  if (lowBandwidth) {
    return (
      <div
        className={cn(
          "rounded-xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground",
          className,
        )}
      >
        Map hidden in lite mode. Locations:
        <ul className="mt-2 flex flex-col gap-1">
          {points.map((p) => (
            <li key={p.id}>
              {p.label} — {p.lat.toFixed(3)}, {p.lng.toFixed(3)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div
        className={cn(
          "flex h-64 items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground",
          className,
        )}
      >
        No mappable points yet.
      </div>
    );
  }

  return (
    <div className={cn("elma-map h-72 overflow-hidden rounded-xl border border-border shadow-sm sm:h-80", className)}>
      <Map
        initialViewState={{
          latitude: center.lat,
          longitude: center.lng,
          zoom: initialZoom,
        }}
        mapStyle="https://demotiles.maplibre.org/style.json"
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={false} />
        {points.map((point) => (
          <Marker key={point.id} latitude={point.lat} longitude={point.lng} anchor="bottom">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "size-3 rounded-full border-2 shadow-md",
                  toneClass[point.tone ?? "primary"],
                )}
                title={point.label}
              />
              <span className="max-w-[8rem] truncate rounded bg-card/95 px-1.5 py-0.5 text-[10px] font-medium shadow-sm">
                {point.label}
              </span>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
