import { mitigationProjects } from "@/lib/data/seed";
import { listSheltersMutable } from "@/lib/store/shelter-store";
import {
  addReport,
  listAlerts,
  listReports,
  setAlertVerification,
  updateReportStatus as updateReportStatusMemory,
} from "@/lib/store/memory";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DataSourceId } from "@/lib/data/source-catalog";
import type {
  CommunityAlert,
  EmergencyReport,
  EvacuationCenterRef,
  MitigationProject,
  Shelter,
  VerificationStatus,
} from "@/lib/types";

function getSupabaseClient() {
  return createSupabaseServerClient();
}

function mapProject(row: Record<string, unknown>): MitigationProject {
  const budgetAllocated = Number(
    row.budget_allocated_kes ?? row.budget_kes ?? row.budgetKes ?? 0,
  );
  return {
    id: String(row.id ?? row.project_id),
    county: String(row.county),
    subCounty:
      row.sub_county != null
        ? String(row.sub_county)
        : row.subCounty != null
          ? String(row.subCounty)
          : undefined,
    ward: String(row.ward),
    title: String(row.title),
    description: String(row.description),
    budgetKes: budgetAllocated,
    disbursedKes:
      row.disbursed_kes != null
        ? Number(row.disbursed_kes)
        : row.disbursedKes != null
          ? Number(row.disbursedKes)
          : undefined,
    contractor: String(row.contractor ?? row.contractor_name),
    procurementRef:
      row.procurement_ref != null
        ? String(row.procurement_ref)
        : row.procurementRef != null
          ? String(row.procurementRef)
          : undefined,
    procurementStatus:
      row.procurement_status != null
        ? String(row.procurement_status)
        : row.status != null
          ? String(row.status)
          : undefined,
    completionPercentage:
      row.completion_percentage != null
        ? Number(row.completion_percentage)
        : row.completionPercentage != null
          ? Number(row.completionPercentage)
          : undefined,
    paperStatus: row.paper_status as MitigationProject["paperStatus"],
    fieldStatus: row.field_status as MitigationProject["fieldStatus"],
    startDate:
      row.start_date != null
        ? String(row.start_date).slice(0, 10)
        : row.startDate != null
          ? String(row.startDate).slice(0, 10)
          : undefined,
    deadline: String(row.expected_end_date ?? row.deadline).slice(0, 10),
    sourceUrl:
      row.source_url != null
        ? String(row.source_url)
        : row.sourceUrl != null
          ? String(row.sourceUrl)
          : undefined,
    dataSource: (row.data_source ?? row.dataSource ?? "ppip") as DataSourceId,
    lat: row.lat != null ? Number(row.lat) : undefined,
    lng: row.lng != null ? Number(row.lng) : undefined,
  };
}

function mapAlert(row: Record<string, unknown>): CommunityAlert {
  const issued = row.issued_at ?? row.issuedAt ?? row.created_at ?? row.createdAt;
  const evacuationRaw = row.evacuation_centers ?? row.evacuationCenters;
  let evacuationCenters: EvacuationCenterRef[] | undefined;
  if (Array.isArray(evacuationRaw)) {
    evacuationCenters = evacuationRaw.map((c) => {
      const center = c as Record<string, unknown>;
      return {
        name: String(center.name),
        capacity: Number(center.capacity),
        lat: Number(center.lat),
        lng: Number(center.lng),
        contactPerson:
          center.contact_person != null
            ? String(center.contact_person)
            : center.contactPerson != null
              ? String(center.contactPerson)
              : undefined,
        hotline: center.hotline != null ? String(center.hotline) : undefined,
        shelterId:
          center.shelter_id != null
            ? String(center.shelter_id)
            : center.shelterId != null
              ? String(center.shelterId)
              : undefined,
      };
    });
  }

  return {
    id: String(row.id),
    alertId:
      row.alert_id != null
        ? String(row.alert_id)
        : row.alertId != null
          ? String(row.alertId)
          : undefined,
    createdAt: String(issued),
    issuedAt: issued != null ? String(issued) : undefined,
    title: String(row.headline ?? row.title),
    body: String(row.body),
    county: String(row.county),
    ward: String(row.ward),
    riskLevel:
      row.risk_level != null
        ? String(row.risk_level)
        : row.riskLevel != null
          ? String(row.riskLevel)
          : undefined,
    severity: row.severity as CommunityAlert["severity"],
    verification: row.verification as CommunityAlert["verification"],
    source: row.source != null ? String(row.source) : undefined,
    dataSource:
      row.data_source != null
        ? (String(row.data_source) as DataSourceId)
        : row.dataSource != null
          ? (String(row.dataSource) as DataSourceId)
          : undefined,
    evacuationCenters,
  };
}

function mapShelter(row: Record<string, unknown>): Shelter {
  return {
    id: String(row.id),
    name: String(row.name),
    county: String(row.county),
    ward: String(row.ward),
    address: String(row.address),
    capacity: Number(row.capacity),
    occupancy: Number(row.occupancy),
    lat: Number(row.lat),
    lng: Number(row.lng),
    open: Boolean(row.open),
    contactPerson:
      row.contact_person != null
        ? String(row.contact_person)
        : row.contactPerson != null
          ? String(row.contactPerson)
          : undefined,
    hotline: row.hotline != null ? String(row.hotline) : undefined,
    dataSource:
      row.data_source != null
        ? (String(row.data_source) as DataSourceId)
        : row.dataSource != null
          ? (String(row.dataSource) as DataSourceId)
          : undefined,
  };
}

export async function getMitigationProjects(): Promise<MitigationProject[]> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return mitigationProjects;

    const { data, error } = await supabase.from("mitigation_projects").select("*");
    if (error || !data?.length) return mitigationProjects;
    return data.map((row) => mapProject(row as Record<string, unknown>));
  } catch {
    return mitigationProjects;
  }
}

export async function getShelters(): Promise<Shelter[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return listSheltersMutable();

  const { data, error } = await supabase.from("shelters").select("*");
  if (error || !data?.length) return listSheltersMutable();
  return data.map((row) => mapShelter(row as Record<string, unknown>));
}

export async function getCommunityAlerts(): Promise<CommunityAlert[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return listAlerts();

  const { data, error } = await supabase
    .from("community_alerts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data?.length) return listAlerts();
  return data.map((row) => mapAlert(row as Record<string, unknown>));
}

export async function getEmergencyReports(): Promise<EmergencyReport[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return listReports();

  const { data, error } = await supabase
    .from("emergency_reports")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data?.length) return listReports();

  return data.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id),
      createdAt: String(r.created_at),
      category: r.category as EmergencyReport["category"],
      description: String(r.description),
      ward: String(r.ward),
      county: String(r.county),
      contact: r.contact != null ? String(r.contact) : undefined,
      lat: r.lat != null ? Number(r.lat) : undefined,
      lng: r.lng != null ? Number(r.lng) : undefined,
      status: r.status as EmergencyReport["status"],
    };
  });
}

export async function createEmergencyReport(
  input: Omit<EmergencyReport, "id" | "createdAt" | "status">,
): Promise<EmergencyReport> {
  const supabase = getSupabaseClient();
  if (!supabase) return addReport(input);

  const { data, error } = await supabase
    .from("emergency_reports")
    .insert({
      category: input.category,
      description: input.description,
      ward: input.ward,
      county: input.county,
      contact: input.contact,
      lat: input.lat,
      lng: input.lng,
      status: "open",
    })
    .select("*")
    .single();

  if (error || !data) return addReport(input);

  const r = data as Record<string, unknown>;
  return {
    id: String(r.id),
    createdAt: String(r.created_at),
    category: r.category as EmergencyReport["category"],
    description: String(r.description),
    ward: String(r.ward),
    county: String(r.county),
    contact: r.contact != null ? String(r.contact) : undefined,
    status: "open",
  };
}

export async function updateEmergencyReportStatus(
  id: string,
  status: EmergencyReport["status"],
): Promise<EmergencyReport | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return updateReportStatusMemory(id, status);

  const { data, error } = await supabase
    .from("emergency_reports")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) return updateReportStatusMemory(id, status);

  const r = data as Record<string, unknown>;
  return {
    id: String(r.id),
    createdAt: String(r.created_at),
    category: r.category as EmergencyReport["category"],
    description: String(r.description),
    ward: String(r.ward),
    county: String(r.county),
    contact: r.contact != null ? String(r.contact) : undefined,
    lat: r.lat != null ? Number(r.lat) : undefined,
    lng: r.lng != null ? Number(r.lng) : undefined,
    status: r.status as EmergencyReport["status"],
  };
}

export async function updateAlertVerification(
  id: string,
  verification: VerificationStatus,
): Promise<CommunityAlert | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return setAlertVerification(id, verification);

  const { data, error } = await supabase
    .from("community_alerts")
    .update({ verification })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) return setAlertVerification(id, verification);
  return mapAlert(data as Record<string, unknown>);
}
