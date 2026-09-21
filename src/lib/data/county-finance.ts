import { countyBySlug } from "@/lib/data/counties";
import { getMitigationProjects, getShelters } from "@/lib/data/repository";
import type { MitigationProject } from "@/lib/types";

export type HazardPeriod = "el_nino" | "floods" | "drought";

export type PeriodFundSummary = {
  period: HazardPeriod;
  label: string;
  nationalReleasedKes: number;
  countyReceivedKes: number;
  countySpentKes: number;
  countyCommittedKes: number;
  sourceNote: string;
};

export type CitizenAccessItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  tag: "cash" | "shelter" | "emergency" | "info";
};

export type CountyPortalData = {
  countyName: string;
  slug: string;
  hasDemoData: boolean;
  periods: PeriodFundSummary[];
  projects: MitigationProject[];
  citizenAccess: CitizenAccessItem[];
};

const PERIOD_LABELS: Record<HazardPeriod, string> = {
  el_nino: "OND El Niño season",
  floods: "Flood response",
  drought: "Drought & dry-spell relief",
};

/** Demo national → county envelopes (KES). Spent/committed derived from seed projects where possible. */
const ENVELOPES: Record<
  string,
  Record<HazardPeriod, Omit<PeriodFundSummary, "period" | "label">>
> = {
  Kisumu: {
    el_nino: {
      nationalReleasedKes: 420_000_000,
      countyReceivedKes: 385_000_000,
      countySpentKes: 198_000_000,
      countyCommittedKes: 310_000_000,
      sourceNote: "National Treasury · CBIRR Q2 + county ADP (demo)",
    },
    floods: {
      nationalReleasedKes: 180_000_000,
      countyReceivedKes: 165_000_000,
      countySpentKes: 92_000_000,
      countyCommittedKes: 140_000_000,
      sourceNote: "NDMA hazard window · KRCS coordination (demo)",
    },
    drought: {
      nationalReleasedKes: 95_000_000,
      countyReceivedKes: 88_000_000,
      countySpentKes: 41_000_000,
      countyCommittedKes: 62_000_000,
      sourceNote: "Dry-spell livestock & water trucking (demo)",
    },
  },
  Nairobi: {
    el_nino: {
      nationalReleasedKes: 890_000_000,
      countyReceivedKes: 820_000_000,
      countySpentKes: 510_000_000,
      countyCommittedKes: 690_000_000,
      sourceNote: "PPIP stormwater + NCC emergency vote (demo)",
    },
    floods: {
      nationalReleasedKes: 320_000_000,
      countyReceivedKes: 300_000_000,
      countySpentKes: 185_000_000,
      countyCommittedKes: 240_000_000,
      sourceNote: "Urban flash-flood hotspots (demo)",
    },
    drought: {
      nationalReleasedKes: 45_000_000,
      countyReceivedKes: 42_000_000,
      countySpentKes: 18_000_000,
      countyCommittedKes: 28_000_000,
      sourceNote: "Water bowser reserve (demo)",
    },
  },
  Garissa: {
    el_nino: {
      nationalReleasedKes: 260_000_000,
      countyReceivedKes: 240_000_000,
      countySpentKes: 112_000_000,
      countyCommittedKes: 190_000_000,
      sourceNote: "Tana basin · NDMA Alarm funding (demo)",
    },
    floods: {
      nationalReleasedKes: 410_000_000,
      countyReceivedKes: 395_000_000,
      countySpentKes: 220_000_000,
      countyCommittedKes: 340_000_000,
      sourceNote: "Riverine evacuation & embankment (demo)",
    },
    drought: {
      nationalReleasedKes: 520_000_000,
      countyReceivedKes: 505_000_000,
      countySpentKes: 380_000_000,
      countyCommittedKes: 460_000_000,
      sourceNote: "Pastoral dry-spell programmes (demo)",
    },
  },
  Kilifi: {
    el_nino: {
      nationalReleasedKes: 190_000_000,
      countyReceivedKes: 175_000_000,
      countySpentKes: 68_000_000,
      countyCommittedKes: 120_000_000,
      sourceNote: "Coastal OND readiness (demo)",
    },
    floods: {
      nationalReleasedKes: 140_000_000,
      countyReceivedKes: 130_000_000,
      countySpentKes: 55_000_000,
      countyCommittedKes: 98_000_000,
      sourceNote: "Creek outfall & urban drainage (demo)",
    },
    drought: {
      nationalReleasedKes: 210_000_000,
      countyReceivedKes: 198_000_000,
      countySpentKes: 145_000_000,
      countyCommittedKes: 175_000_000,
      sourceNote: "Water pans & livestock off-take (demo)",
    },
  },
};

function defaultEnvelope(): Omit<PeriodFundSummary, "period" | "label"> {
  return {
    nationalReleasedKes: 0,
    countyReceivedKes: 0,
    countySpentKes: 0,
    countyCommittedKes: 0,
    sourceNote: "County data not yet published in this demo.",
  };
}

function citizenAccessFor(countyName: string): CitizenAccessItem[] {
  return [
    {
      id: "household",
      title: "Household relief registration",
      description: `Check if your ward in ${countyName} is open for verified flood or drought cash transfers (demo rules).`,
      href: "/policy",
      tag: "cash",
    },
    {
      id: "shelter",
      title: "Shelter & evacuation space",
      description: "See which halls are open and how many beds are left in this county.",
      href: `/shelters?county=${encodeURIComponent(countyName)}`,
      tag: "shelter",
    },
    {
      id: "report",
      title: "Report danger in your ward",
      description: "Structured emergency report when hotlines jam — share location and need.",
      href: "/emergency",
      tag: "emergency",
    },
    {
      id: "alerts",
      title: "Verified alerts for your area",
      description: "KMD, WRA, and KRCS updates — not WhatsApp rumors.",
      href: "/alerts",
      tag: "info",
    },
  ];
}

export async function getCountyPortalData(slug: string): Promise<CountyPortalData | null> {
  const county = countyBySlug(slug);
  if (!county) return null;

  const allProjects = await getMitigationProjects();
  const projects = allProjects.filter((p) => p.county === county.name);
  const shelters = await getShelters();
  const countyShelters = shelters.filter((s) => s.county === county.name);

  const envelope = ENVELOPES[county.name] ?? {
    el_nino: defaultEnvelope(),
    floods: defaultEnvelope(),
    drought: defaultEnvelope(),
  };

  const periods: PeriodFundSummary[] = (["el_nino", "floods", "drought"] as HazardPeriod[]).map(
    (period) => ({
      period,
      label: PERIOD_LABELS[period],
      ...envelope[period],
    }),
  );

  const access = citizenAccessFor(county.name);
  if (countyShelters.length > 0) {
    access[1] = {
      ...access[1],
      description: `${countyShelters.filter((s) => s.open).length} open sites in ${county.name} — tap to view capacity.`,
    };
  }

  return {
    countyName: county.name,
    slug: county.slug,
    hasDemoData: county.hasDemoData,
    periods,
    projects,
    citizenAccess: access,
  };
}

export function procurementStages(project: MitigationProject): {
  id: string;
  label: string;
  done: boolean;
  current: boolean;
}[] {
  const status = project.procurementStatus?.toLowerCase() ?? "";
  const awarded = status.includes("award") || status.includes("progress");
  const inProgress = status.includes("progress") || (project.completionPercentage ?? 0) > 0;
  const fieldDone = project.fieldStatus === "confirmed";
  const paperComplete = project.paperStatus === "complete";

  return [
    { id: "pub", label: "Published / ADP line", done: true, current: !awarded },
    { id: "award", label: "Tender awarded", done: awarded, current: awarded && !inProgress },
    { id: "pay", label: "Funds disbursed", done: (project.disbursedKes ?? 0) > 0, current: inProgress },
    { id: "paper", label: "Paper completion", done: paperComplete, current: paperComplete && !fieldDone },
    { id: "field", label: "Field verified", done: fieldDone, current: paperComplete && !fieldDone },
  ];
}

export function countyNameFromSlug(slug: string): string | undefined {
  return countyBySlug(slug)?.name;
}

export type CountyCardSummary = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  allocatedKes: number;
  hasDemoData: boolean;
};

export function buildCountyCardSummaries(
  counties: { slug: string; name: string; hasDemoData: boolean; lat: number; lng: number }[],
): CountyCardSummary[] {
  return counties.map((c) => ({
    slug: c.slug,
    name: c.name,
    lat: c.lat,
    lng: c.lng,
    hasDemoData: c.hasDemoData,
    allocatedKes: ENVELOPES[c.name]?.el_nino?.countyReceivedKes ?? 0,
  }));
}
