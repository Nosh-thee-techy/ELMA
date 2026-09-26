import type { CountyPortalData } from "@/lib/data/county-finance";

export type CountyDataLayer = {
  id: string;
  label: string;
  status: "demo_seed" | "live_shape" | "official_target";
  detail: string;
};

export type ElmaDifferentiator = {
  title: string;
  body: string;
};

export function countyDataLayers(hasDemoData: boolean): CountyDataLayer[] {
  return [
    {
      id: "boundaries",
      label: "County boundaries",
      status: "live_shape",
      detail:
        "geoBoundaries KEN ADM1 (2020, simplified) — RCMRD / Africa GeoPortal, public domain. Shows the real Kenya county map.",
    },
    {
      id: "finance",
      label: "Allocations & tenders",
      status: hasDemoData ? "demo_seed" : "official_target",
      detail: hasDemoData
        ? "Demo envelopes in src/lib/data/county-finance.ts shaped like COB CBIRR + county ADP + PPIP awards (not live scraped)."
        : "Not published in this demo — production would ingest PPIP, COB PDFs, and county portals (see source catalog).",
    },
    {
      id: "field",
      label: "Shelters & SOS",
      status: "demo_seed",
      detail:
        "Live in demo: ward SOS queue, shelter occupancy via dashboard/USSD. Seeded in src/lib/data/repository + memory store unless Supabase is configured.",
    },
    {
      id: "verify",
      label: "Field vs paper",
      status: hasDemoData ? "demo_seed" : "official_target",
      detail:
        "Mitigation projects include paper vs field verification states — ELMA’s audit trail logs verifier actions (transparency pages).",
    },
  ];
}

export function elmaVsGenericPortals(): ElmaDifferentiator[] {
  return [
    {
      title: "One story: money → contractor → field proof",
      body: "Typical county sites publish PDFs. ELMA links releases, tenders, and verification status in one county brief — with an append-only audit export.",
    },
    {
      title: "Same backend as SOS & USSD",
      body: "Citizens report via ELMA Pocket or *384*253#; responders see one ward queue. Transparency and response share data, not separate hotlines.",
    },
    {
      title: "Ward-scoped, not national blur",
      body: "Explore is county-first; dashboards, shelters, and reports filter by ward where it matters for El Niño response.",
    },
    {
      title: "AI with guardrails",
      body: "Qwen explains policy and pocket guidance — it does not invent roads, phone numbers, or “safe” driving routes. Boundaries come from geo data, not the model.",
    },
  ];
}

export function financeSourceSnippets(portal: CountyPortalData | null): string[] {
  if (!portal?.periods?.length) return [];
  return portal.periods.map((p) => `${p.label}: ${p.sourceNote}`);
}
