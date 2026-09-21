import type { DataSourceId } from "@/lib/data/source-catalog";

export type VerificationStatus = "verified" | "pending" | "disputed" | "rumor";

export type MitigationStatus = "complete" | "in_progress" | "not_started" | "delayed";

export type FieldVerification = "confirmed" | "partial" | "not_done" | "unverified";

export interface MitigationProject {
  id: string;
  county: string;
  subCounty?: string;
  ward: string;
  title: string;
  description: string;
  /** Allocated budget (maps to `budget_allocated_kes` in mock payloads). */
  budgetKes: number;
  disbursedKes?: number;
  contractor: string;
  procurementRef?: string;
  procurementStatus?: string;
  completionPercentage?: number;
  paperStatus: MitigationStatus;
  fieldStatus: FieldVerification;
  startDate?: string;
  /** Expected completion (maps to `expected_end_date`). */
  deadline: string;
  sourceUrl?: string;
  dataSource: DataSourceId;
  lat?: number;
  lng?: number;
}

export interface EvacuationCenterRef {
  name: string;
  capacity: number;
  lat: number;
  lng: number;
  contactPerson?: string;
  hotline?: string;
  shelterId?: string;
}

export interface EmergencyReport {
  id: string;
  createdAt: string;
  category: "trapped" | "flooding" | "landslide" | "medical" | "infrastructure" | "other";
  description: string;
  ward: string;
  county: string;
  contact?: string;
  lat?: number;
  lng?: number;
  status: "open" | "dispatched" | "resolved";
}

export interface CommunityAlert {
  id: string;
  alertId?: string;
  createdAt: string;
  issuedAt?: string;
  title: string;
  body: string;
  county: string;
  ward: string;
  riskLevel?: string;
  severity: "info" | "watch" | "warning" | "critical";
  verification: VerificationStatus;
  source?: string;
  dataSource?: DataSourceId;
  evacuationCenters?: EvacuationCenterRef[];
}

export interface Shelter {
  id: string;
  name: string;
  county: string;
  ward: string;
  address: string;
  capacity: number;
  occupancy: number;
  lat: number;
  lng: number;
  open: boolean;
  contactPerson?: string;
  hotline?: string;
  dataSource?: DataSourceId;
}
