export const ELMA_MAP_STYLE_LIGHT =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export const ELMA_MAP_STYLE_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export function mapStyleForTheme(resolvedTheme: string | undefined): string {
  return resolvedTheme === "dark" ? ELMA_MAP_STYLE_DARK : ELMA_MAP_STYLE_LIGHT;
}
