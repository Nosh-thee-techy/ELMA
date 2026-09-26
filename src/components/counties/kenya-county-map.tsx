"use client";

import { useLowBandwidth } from "@/components/providers/low-bandwidth-provider";
import { KENYA_MAP_BOUNDS, kenyaMapBoundsSwNe, slugFromShapeName } from "@/lib/data/counties";
import type { CountyCardSummary } from "@/lib/data/county-finance";
import { mapStyleForTheme, minimalKenyaMapStyle } from "@/lib/maps/styles";
import { cn } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";
import { useTheme } from "@/components/providers/theme-provider";
import type { StyleSpecification } from "maplibre-gl";
import type { Feature, FeatureCollection, MultiPolygon, Polygon, Position } from "geojson";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, NavigationControl, ScaleControl, Source } from "react-map-gl/maplibre";
import type { MapLayerMouseEvent, MapRef } from "react-map-gl/maplibre";

type Props = {
  counties: CountyCardSummary[];
  selectedSlug?: string;
  onSelect: (slug: string) => void;
  className?: string;
};

type EnrichedProps = {
  slug: string;
  shapeName: string;
  hasDemo: number;
  selected: number;
};

function isCountyPolygonFeature(
  f: Feature,
): f is Feature<Polygon | MultiPolygon, GeoJSON.GeoJsonProperties> {
  const t = f.geometry?.type;
  return t === "Polygon" || t === "MultiPolygon";
}

function extendBboxFromRing(ring: Position[], minLng: number, minLat: number, maxLng: number, maxLat: number) {
  for (const pos of ring) {
    const lng = pos[0];
    const lat = pos[1];
    minLng = Math.min(minLng, lng);
    minLat = Math.min(minLat, lat);
    maxLng = Math.max(maxLng, lng);
    maxLat = Math.max(maxLat, lat);
  }
  return { minLng, minLat, maxLng, maxLat };
}

function bboxFromGeojson(fc: FeatureCollection): [[number, number], [number, number]] {
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const f of fc.features) {
    const g = f.geometry;
    if (!g) continue;
    if (g.type === "Polygon") {
      for (const ring of g.coordinates) {
        ({ minLng, minLat, maxLng, maxLat } = extendBboxFromRing(ring, minLng, minLat, maxLng, maxLat));
      }
    } else if (g.type === "MultiPolygon") {
      for (const poly of g.coordinates) {
        for (const ring of poly) {
          ({ minLng, minLat, maxLng, maxLat } = extendBboxFromRing(ring, minLng, minLat, maxLng, maxLat));
        }
      }
    }
  }
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

export function KenyaCountyMap({ counties, selectedSlug, onSelect, className }: Props) {
  const { lowBandwidth } = useLowBandwidth();
  const { theme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const [mapReady, setMapReady] = useState(false);
  const [rawGeo, setRawGeo] = useState<FeatureCollection | null>(null);
  const [geoError, setGeoError] = useState(false);
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);
  const [useMinimalBasemap, setUseMinimalBasemap] = useState(false);

  const demoSlugs = useMemo(() => new Set(counties.filter((c) => c.hasDemoData).map((c) => c.slug)), [counties]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/geo/kenya-counties.geojson");
        if (!res.ok) {
          if (!cancelled) setGeoError(true);
          return;
        }
        const json = (await res.json()) as FeatureCollection;
        if (!cancelled) {
          setRawGeo(json);
          setGeoError(false);
        }
      } catch {
        if (!cancelled) setGeoError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const enrichedGeo = useMemo((): FeatureCollection<Polygon | MultiPolygon, EnrichedProps> | null => {
    if (!rawGeo) return null;
    return {
      type: "FeatureCollection",
      features: rawGeo.features.filter(isCountyPolygonFeature).map((f) => {
        const shapeName = String(f.properties?.shapeName ?? "");
        const slug = slugFromShapeName(shapeName);
        return {
          ...f,
          properties: {
            slug,
            shapeName,
            hasDemo: demoSlugs.has(slug) ? 1 : 0,
            selected: selectedSlug === slug ? 1 : 0,
          } satisfies EnrichedProps,
        };
      }),
    };
  }, [rawGeo, demoSlugs, selectedSlug]);

  const mapStyle: string | StyleSpecification = useMinimalBasemap
    ? minimalKenyaMapStyle(theme === "dark")
    : mapStyleForTheme(theme);

  const fitKenya = useCallback(() => {
    if (!mapRef.current) return;
    if (enrichedGeo) {
      const b = bboxFromGeojson(enrichedGeo);
      mapRef.current.fitBounds(b, { padding: 48, duration: 800, maxZoom: 6.2 });
    } else {
      mapRef.current.fitBounds(kenyaMapBoundsSwNe(), { padding: 48, duration: 800, maxZoom: 6.2 });
    }
  }, [enrichedGeo]);

  useEffect(() => {
    if (mapReady) fitKenya();
  }, [mapReady, fitKenya]);

  useEffect(() => {
    if (!mapReady || !selectedSlug || !enrichedGeo) return;
    const feature = enrichedGeo.features.find((f) => f.properties?.slug === selectedSlug);
    if (!feature) return;
    const b = bboxFromGeojson({ type: "FeatureCollection", features: [feature] });
    mapRef.current?.fitBounds(b, { padding: 80, duration: 900, maxZoom: 8.5 });
  }, [selectedSlug, enrichedGeo, mapReady]);

  const onMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const hit = e.features?.find((f) => f.layer.id === "counties-fill");
      const slug = hit?.properties?.slug;
      if (typeof slug === "string" && slug.length > 0) onSelect(slug);
    },
    [onSelect],
  );

  if (lowBandwidth) {
    return (
      <div className="flex h-[min(520px,50vh)] min-h-[320px] flex-col gap-2 rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-white/80 lg:h-[520px]">
        <p className="font-bold">Lite mode — map hidden to save data</p>
        <p className="text-xs text-white/55">Turn off <strong className="text-white">Lite</strong> in the header to see the Kenya county map.</p>
        <ul className="mt-2 grid flex-1 grid-cols-2 gap-1 overflow-y-auto text-xs">
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
        "kenya-county-map relative isolate w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-900/40 shadow-inner ring-1 ring-white/10",
        className,
      )}
    >
      <Map
        ref={mapRef}
        onLoad={() => setMapReady(true)}
        onError={() => setUseMinimalBasemap(true)}
        initialViewState={{
          latitude: 0.05,
          longitude: 37.9,
          zoom: 5.6,
        }}
        maxBounds={KENYA_MAP_BOUNDS}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        interactiveLayerIds={enrichedGeo ? ["counties-fill"] : undefined}
        cursor={hoverSlug ? "pointer" : undefined}
        onClick={onMapClick}
        onMouseMove={(e) => {
          const hit = e.features?.find((f) => f.layer.id === "counties-fill");
          setHoverSlug(typeof hit?.properties?.slug === "string" ? hit.properties.slug : null);
        }}
        onMouseLeave={() => setHoverSlug(null)}
      >
        <NavigationControl position="top-right" showCompass={false} visualizePitch={false} />
        <ScaleControl position="bottom-left" maxWidth={100} unit="metric" />

        {enrichedGeo ? (
          <Source id="kenya-counties" type="geojson" data={enrichedGeo}>
            <Layer
              id="counties-fill"
              type="fill"
              paint={{
                "fill-color": [
                  "case",
                  ["==", ["get", "selected"], 1],
                  "rgba(16, 185, 129, 0.55)",
                  ["==", ["get", "hasDemo"], 1],
                  "rgba(52, 211, 153, 0.32)",
                  "rgba(148, 163, 184, 0.18)",
                ],
                "fill-outline-color": "rgba(255,255,255,0.15)",
              }}
            />
            <Layer
              id="counties-line"
              type="line"
              paint={{
                "line-color": [
                  "case",
                  ["==", ["get", "selected"], 1],
                  "#34d399",
                  "rgba(255,255,255,0.45)",
                ],
                "line-width": ["case", ["==", ["get", "selected"], 1], 2.5, 0.8],
              }}
            />
          </Source>
        ) : null}
      </Map>

      <div className="pointer-events-none absolute left-3 top-3 max-w-[14rem] rounded-xl bg-white/95 px-3 py-2 text-[10px] font-bold leading-snug text-slate-700 shadow-md ring-1 ring-black/5 dark:bg-slate-900/90 dark:text-slate-200">
        Kenya · 47 counties
        <span className="mt-0.5 block font-normal text-slate-500 dark:text-slate-400">
          {geoError
            ? "Could not load boundaries — retry refresh"
            : rawGeo
              ? "Boundaries: geoBoundaries (ADM1)"
              : "Loading county shapes…"}
        </span>
        {useMinimalBasemap ? (
          <span className="mt-0.5 block font-normal text-amber-600 dark:text-amber-300">
            Offline basemap — counties still clickable
          </span>
        ) : null}
      </div>
      {hoverSlug ? (
        <div className="pointer-events-none absolute bottom-14 left-1/2 z-10 -translate-x-1/2 rounded-full bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
          {enrichedGeo?.features.find((f) => f.properties?.slug === hoverSlug)?.properties?.shapeName ??
            hoverSlug}
        </div>
      ) : null}
      <div className="pointer-events-none absolute bottom-3 left-3 flex gap-3 rounded-xl bg-white/95 px-3 py-2 text-[10px] font-semibold text-slate-600 shadow-md ring-1 ring-black/5 dark:bg-slate-900/90 dark:text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-emerald-400/80 ring-1 ring-white" aria-hidden />
          Demo funds loaded
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-slate-400/50 ring-1 ring-white" aria-hidden />
          Boundary only
        </span>
      </div>
    </div>
  );
}
