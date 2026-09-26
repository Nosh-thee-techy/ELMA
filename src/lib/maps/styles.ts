import type { StyleSpecification } from "maplibre-gl";

export const ELMA_MAP_STYLE_LIGHT =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export const ELMA_MAP_STYLE_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

/** Works when Carto CDN is slow or blocked — counties still render on a solid canvas. */
export function minimalKenyaMapStyle(dark: boolean): StyleSpecification {
  return {
    version: 8,
    name: "ELMA Kenya",
    sources: {},
    layers: [
      {
        id: "background",
        type: "background",
        paint: { "background-color": dark ? "#1e293b" : "#e2e8f0" },
      },
    ],
  };
}

/** Explore map: no third-party tiles — county polygons are the hero. */
export const KENYA_EXPLORE_MAP_STYLE = minimalKenyaMapStyle(true);

export function mapStyleForTheme(resolvedTheme: string | undefined): string {
  return resolvedTheme === "dark" ? ELMA_MAP_STYLE_DARK : ELMA_MAP_STYLE_LIGHT;
}
