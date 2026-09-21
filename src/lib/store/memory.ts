import { communityAlerts, initialReports } from "@/lib/data/seed";
import type { CommunityAlert, EmergencyReport, VerificationStatus } from "@/lib/types";

type ElmaMemory = {
  reports: EmergencyReport[];
  alerts: CommunityAlert[];
};

const globalForElma = globalThis as typeof globalThis & {
  __elmaMemory?: ElmaMemory;
};

function memory(): ElmaMemory {
  if (!globalForElma.__elmaMemory) {
    globalForElma.__elmaMemory = {
      reports: [...initialReports],
      alerts: [...communityAlerts],
    };
  }
  return globalForElma.__elmaMemory;
}

export function listReports(): EmergencyReport[] {
  return [...memory().reports].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function addReport(
  input: Omit<EmergencyReport, "id" | "createdAt" | "status">,
): EmergencyReport {
  const report: EmergencyReport = {
    ...input,
    id: `rep-${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
    status: "open",
  };
  memory().reports.unshift(report);
  return report;
}

export function listAlerts(): CommunityAlert[] {
  return [...memory().alerts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function setAlertVerification(
  id: string,
  verification: VerificationStatus,
): CommunityAlert | null {
  const alert = memory().alerts.find((a) => a.id === id);
  if (!alert) return null;
  alert.verification = verification;
  return alert;
}
