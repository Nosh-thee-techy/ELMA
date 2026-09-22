import type {
  AuditEvent,
  AuditEventKind,
  CitizenFlag,
  CitizenFlagStatus,
  CitizenFlagTarget,
} from "@/lib/types";

const globalAudit = globalThis as typeof globalThis & {
  __elmaAuditEvents?: AuditEvent[];
  __elmaCitizenFlags?: CitizenFlag[];
  __elmaProofVerified?: Record<string, { verifiedAt: string; verifiedBy: string }>;
};

function store(): {
  events: AuditEvent[];
  flags: CitizenFlag[];
  proofVerified: Record<string, { verifiedAt: string; verifiedBy: string }>;
} {
  if (!globalAudit.__elmaAuditEvents) globalAudit.__elmaAuditEvents = [];
  if (!globalAudit.__elmaCitizenFlags) globalAudit.__elmaCitizenFlags = [];
  if (!globalAudit.__elmaProofVerified) globalAudit.__elmaProofVerified = {};
  return {
    events: globalAudit.__elmaAuditEvents,
    flags: globalAudit.__elmaCitizenFlags,
    proofVerified: globalAudit.__elmaProofVerified,
  };
}

function hashPayload(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return `elma-${(h >>> 0).toString(16).padStart(8, "0")}`;
}

export function appendAuditEvent(input: {
  kind: AuditEventKind;
  summary: string;
  actor: string;
  county?: string;
  ward?: string;
  relatedId?: string;
  metadata?: Record<string, string | number | boolean>;
}): AuditEvent {
  const createdAt = new Date().toISOString();
  const contentHash = hashPayload(
    `${input.kind}|${input.summary}|${input.relatedId ?? ""}|${createdAt}`,
  );
  const event: AuditEvent = {
    id: `aud-${crypto.randomUUID().slice(0, 8)}`,
    kind: input.kind,
    summary: input.summary,
    actor: input.actor,
    county: input.county,
    ward: input.ward,
    relatedId: input.relatedId,
    metadata: input.metadata,
    createdAt,
    contentHash,
  };
  store().events.unshift(event);
  return event;
}

export function listAuditEvents(limit = 50): AuditEvent[] {
  return [...store().events].slice(0, limit);
}

export function addCitizenFlag(input: {
  targetType: CitizenFlagTarget;
  targetId: string;
  reason: string;
  description: string;
  county?: string;
  ward?: string;
  reporterLabel?: string;
}): CitizenFlag {
  const flag: CitizenFlag = {
    id: `flag-${crypto.randomUUID().slice(0, 8)}`,
    targetType: input.targetType,
    targetId: input.targetId,
    reason: input.reason,
    description: input.description,
    county: input.county,
    ward: input.ward,
    status: "open",
    createdAt: new Date().toISOString(),
    reporterLabel: input.reporterLabel ?? "Citizen",
  };
  store().flags.unshift(flag);
  appendAuditEvent({
    kind: "citizen_flag",
    summary: `Flag: ${input.reason} on ${input.targetType} ${input.targetId}`,
    actor: flag.reporterLabel ?? "Citizen",
    county: input.county,
    ward: input.ward,
    relatedId: flag.id,
    metadata: { targetType: input.targetType, targetId: input.targetId },
  });
  return flag;
}

export function listCitizenFlags(limit = 30): CitizenFlag[] {
  return [...store().flags].slice(0, limit);
}

export function setFlagStatus(id: string, status: CitizenFlagStatus): CitizenFlag | null {
  const flag = store().flags.find((f) => f.id === id);
  if (!flag) return null;
  flag.status = status;
  return flag;
}

export function markProofVerified(proofId: string, verifiedBy: string): void {
  store().proofVerified[proofId] = {
    verifiedAt: new Date().toISOString(),
    verifiedBy,
  };
  appendAuditEvent({
    kind: "disbursal_verified",
    summary: `Proof ${proofId} marked verified`,
    actor: verifiedBy,
    relatedId: proofId,
  });
}

export function getProofVerification(proofId: string): {
  verifiedAt: string;
  verifiedBy: string;
} | null {
  return store().proofVerified[proofId] ?? null;
}

export function auditEventsToCsv(events: AuditEvent[]): string {
  const header = "id,kind,summary,actor,county,ward,relatedId,contentHash,createdAt";
  const rows = events.map((e) =>
    [
      e.id,
      e.kind,
      `"${e.summary.replace(/"/g, '""')}"`,
      e.actor,
      e.county ?? "",
      e.ward ?? "",
      e.relatedId ?? "",
      e.contentHash,
      e.createdAt,
    ].join(","),
  );
  return [header, ...rows].join("\n");
}
