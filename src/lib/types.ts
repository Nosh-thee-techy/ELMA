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

export type ShelterOperationalStatus = "OPEN" | "NEAR_CAPACITY" | "FULL" | "CLOSED";

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
  status?: ShelterOperationalStatus;
  resourceNeeds?: string[];
  mediaProofUrls?: string[];
  contactPerson?: string;
  hotline?: string;
  dataSource?: DataSourceId;
  updatedAt?: string;
  updatedBy?: string;
}

export type FundCategory =
  | "drainage"
  | "shelter_aid"
  | "emergency_supplies"
  | "drought_relief"
  | "other";

export interface FundDisbursal {
  id: string;
  title: string;
  county: string;
  ward: string;
  category: FundCategory;
  totalAllocatedKes: number;
  totalDisbursedKes: number;
  projectId?: string;
}

export interface ProjectProof {
  id: string;
  disbursalId: string;
  projectId?: string;
  contractorName: string;
  tenderId: string;
  gazetteNoticeUrl?: string;
  bankReceiptUrl?: string;
  mediaProofUrls: string[];
  verifiedAt?: string;
  verifiedBy?: string;
  caption?: string;
  lat?: number;
  lng?: number;
  /** Demo integrity fingerprint (production: document hash). */
  sourceDocumentHash?: string;
  linkedShelterId?: string;
}

export type AuditEventKind =
  | "shelter_update"
  | "disbursal_verified"
  | "citizen_flag"
  | "report_created"
  | "field_media"
  | "sms_received";

export interface AuditEvent {
  id: string;
  kind: AuditEventKind;
  summary: string;
  actor: string;
  county?: string;
  ward?: string;
  relatedId?: string;
  metadata?: Record<string, string | number | boolean>;
  createdAt: string;
  contentHash: string;
}

export type CitizenFlagTarget = "disbursal" | "shelter" | "proof";
export type CitizenFlagStatus = "open" | "reviewing" | "resolved" | "dismissed";

export interface CitizenFlag {
  id: string;
  targetType: CitizenFlagTarget;
  targetId: string;
  reason: string;
  description: string;
  county?: string;
  ward?: string;
  status: CitizenFlagStatus;
  createdAt: string;
  reporterLabel?: string;
}

export interface FieldMediaCapture {
  dataUrl: string;
  capturedAt: string;
  lat?: number;
  lng?: number;
  accuracyM?: number;
}

export interface ShelterStatusLog {
  id: string;
  shelterId: string;
  currentOccupancy: number;
  maxCapacity: number;
  status: ShelterOperationalStatus;
  resourceNeeds: string[];
  updatedBy: string;
  updatedAt: string;
}
