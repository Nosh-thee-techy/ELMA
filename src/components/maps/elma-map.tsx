"use client";

import { useLowBandwidth } from "@/components/providers/low-bandwidth-provider";
import { mapStyleForTheme } from "@/lib/maps/styles";
import { cn } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPin } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { useMemo } from "react";
import Map, { Marker, NavigationControl, ScaleControl } from "react-map-gl/maplibre";

export type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  tone?: "primary" | "clay" | "alert";
};

const toneClass = {
  primary: "bg-emerald-500 ring-emerald-300/50",
  clay: "bg-amber-500 ring-amber-300/50",
  alert: "bg-red-500 ring-red-300/50",
};

export function ElmaMap({
  points,
  className,
  initialZoom = 12,
  title = "Live locations",
}: {
  points: MapPoint[];
  className?: string;
  initialZoom?: number;
  title?: string;
}) {
  const { lowBandwidth } = useLowBandwidth();
  const { theme } = useTheme();
  const mapStyle = mapStyleForTheme(theme);

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
          "rounded-2xl border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground",
          className,
        )}
      >
        <p className="font-bold text-foreground">Map hidden in lite mode</p>
        <ul className="mt-3 flex flex-col gap-2">
          {points.map((p) => (
            <li key={p.id} className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>
                {p.label}
                <span className="block text-xs tabular-nums opacity-70">
                  {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                </span>
              </span>
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
          "flex h-64 items-center justify-center rounded-2xl border border-border bg-muted/30 text-sm text-muted-foreground",
          className,
        )}
      >
        No mappable points yet.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "elma-map relative overflow-hidden rounded-2xl border border-border shadow-md ring-1 ring-black/5",
        className,
      )}
    >
      <div className="absolute left-3 top-3 z-10 rounded-lg bg-card/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground shadow-sm backdrop-blur-sm">
        {title}
      </div>
      <div className="h-80 sm:h-96">
        <Map
          initialViewState={{
            latitude: center.lat,
            longitude: center.lng,
            zoom: initialZoom,
          }}
          mapStyle={mapStyle}
          style={{ width: "100%", height: "100%" }}
        >
          <NavigationControl position="top-right" showCompass={false} />
          <ScaleControl position="bottom-left" maxWidth={80} unit="metric" />
          {points.map((point) => (
            <Marker key={point.id} latitude={point.lat} longitude={point.lng} anchor="bottom">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full ring-2 ring-white shadow-lg",
                    toneClass[point.tone ?? "primary"],
                  )}
                  title={point.label}
                />
                <span className="max-w-[9rem] truncate rounded-md bg-card/95 px-2 py-0.5 text-[10px] font-bold text-foreground shadow-md ring-1 ring-border/60">
                  {point.label}
                </span>
              </div>
            </Marker>
          ))}
        </Map>
      </div>
    </div>
  );
}
