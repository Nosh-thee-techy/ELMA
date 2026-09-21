import type {
  CommunityAlert,
  EmergencyReport,
  MitigationProject,
  Shelter,
} from "@/lib/types";

export type AreaKey = `${string}|${string}`;

export function areaKey(county: string, ward: string): AreaKey {
  return `${county}|${ward}`;
}

export type AreaSummary = {
  county: string;
  ward: string;
  projectCount: number;
  budgetKes: number;
  disbursedKes: number;
  flagCount: number;
  verifiedAlerts: number;
  pendingAlerts: number;
  openReports: number;
  sheltersOpen: number;
  shelterSpacesLeft: number;
};

function isFlagged(project: MitigationProject): boolean {
  return project.paperStatus === "complete" && project.fieldStatus !== "confirmed";
}

export function buildAreaSummaries(input: {
  projects: MitigationProject[];
  alerts: CommunityAlert[];
  reports: EmergencyReport[];
  shelters: Shelter[];
}): AreaSummary[] {
  const map = new Map<AreaKey, AreaSummary>();

  const ensure = (county: string, ward: string): AreaSummary => {
    const key = areaKey(county, ward);
    let row = map.get(key);
    if (!row) {
      row = {
        county,
        ward,
        projectCount: 0,
        budgetKes: 0,
        disbursedKes: 0,
        flagCount: 0,
        verifiedAlerts: 0,
        pendingAlerts: 0,
        openReports: 0,
        sheltersOpen: 0,
        shelterSpacesLeft: 0,
      };
      map.set(key, row);
    }
    return row;
  };

  for (const p of input.projects) {
    const row = ensure(p.county, p.ward);
    row.projectCount += 1;
    row.budgetKes += p.budgetKes;
    row.disbursedKes += p.disbursedKes ?? 0;
    if (isFlagged(p)) row.flagCount += 1;
  }

  for (const a of input.alerts) {
    const row = ensure(a.county, a.ward);
    if (a.verification === "verified") row.verifiedAlerts += 1;
    else if (a.verification === "pending" || a.verification === "disputed") {
      row.pendingAlerts += 1;
    }
  }

  for (const r of input.reports) {
    if (r.status === "resolved") continue;
    const row = ensure(r.county, r.ward);
    row.openReports += 1;
  }

  for (const s of input.shelters) {
    const row = ensure(s.county, s.ward);
    if (s.open) {
      row.sheltersOpen += 1;
      row.shelterSpacesLeft += Math.max(0, s.capacity - s.occupancy);
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    const c = a.county.localeCompare(b.county);
    return c !== 0 ? c : a.ward.localeCompare(b.ward);
  });
}

export function uniqueCounties(summaries: AreaSummary[]): string[] {
  return Array.from(new Set(summaries.map((s) => s.county))).sort();
}

export function totalsFromSummaries(summaries: AreaSummary[]) {
  return summaries.reduce(
    (acc, s) => ({
      wards: acc.wards + 1,
      projects: acc.projects + s.projectCount,
      budgetKes: acc.budgetKes + s.budgetKes,
      flags: acc.flags + s.flagCount,
      openReports: acc.openReports + s.openReports,
      verifiedAlerts: acc.verifiedAlerts + s.verifiedAlerts,
      shelterSpacesLeft: acc.shelterSpacesLeft + s.shelterSpacesLeft,
    }),
    {
      wards: 0,
      projects: 0,
      budgetKes: 0,
      flags: 0,
      openReports: 0,
      verifiedAlerts: 0,
      shelterSpacesLeft: 0,
    },
  );
}
