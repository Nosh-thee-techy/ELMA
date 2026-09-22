import { fundDisbursals } from "@/lib/data/disbursals-seed";
import { createEmergencyReport } from "@/lib/data/repository";
import { listSheltersMutable } from "@/lib/store/shelter-store";
import { appendAuditEvent } from "@/lib/store/audit-store";

export type UssdInput = {
  phoneNumber: string;
  text: string;
};

const WARDS: Record<string, { label: string; county: string }> = {
  "1": { label: "Kondele", county: "Kisumu" },
  "2": { label: "Nyalenda A", county: "Kisumu" },
  "3": { label: "Sankuri", county: "Garissa" },
  "4": { label: "Upper Savanna", county: "Nairobi" },
};

const REPORT_CATEGORIES = {
  "1": "flooding",
  "2": "trapped",
  "3": "medical",
  "4": "other",
} as const;

function wardMenu(): string {
  return "CON Pick ward:\n1 Kondele\n2 Nyalenda A\n3 Sankuri\n4 Upper Savanna";
}

export async function handleUssdSession(input: UssdInput): Promise<string> {
  const parts = input.text.trim() === "" ? [] : input.text.split("*");
  const root = parts[0];

  if (parts.length === 0) {
    return "CON ELMA Kenya\n1 Report emergency\n2 Shelter status\n3 Ward funds\n4 Help";
  }

  if (root === "4") {
    return "END Call 1199 for rescue. Web: elma-gold.vercel.app/safety";
  }

  if (root === "1") {
    if (parts.length === 1) {
      return "CON Emergency type:\n1 Flooding\n2 Trapped\n3 Medical\n4 Other";
    }
    if (parts.length === 2) {
      if (!REPORT_CATEGORIES[parts[1] as keyof typeof REPORT_CATEGORIES]) {
        return "END Invalid type. Dial *384*253# again.";
      }
      return wardMenu();
    }
    if (parts.length === 3) {
      const ward = WARDS[parts[2] as keyof typeof WARDS];
      if (!ward) return "END Invalid ward.";
      return `CON ${ward.label}: describe emergency\n(min 10 characters)\nThen press # to send`;
    }
    if (parts.length >= 4) {
      const catKey = parts[1] as keyof typeof REPORT_CATEGORIES;
      const wardKey = parts[2] as keyof typeof WARDS;
      const category = REPORT_CATEGORIES[catKey] ?? "other";
      const wardInfo = WARDS[wardKey];
      const description = parts.slice(3).join("*").trim();
      if (!wardInfo) return "END Invalid ward.";
      if (description.length < 10) {
        return "END Description too short. Min 10 characters.";
      }
      const report = await createEmergencyReport({
        category,
        description,
        ward: wardInfo.label,
        county: wardInfo.county,
        contact: input.phoneNumber,
      });
      appendAuditEvent({
        kind: "report_created",
        summary: `USSD report ${report.id.slice(0, 8)} (${category})`,
        actor: `USSD ${input.phoneNumber.slice(-4)}`,
        county: wardInfo.county,
        ward: wardInfo.label,
        relatedId: report.id,
        metadata: { channel: "ussd" },
      });
      return `END Report ${report.id.slice(0, 8)} queued. Help is coordinating. Ref: ${report.id.slice(0, 8)}`;
    }
  }

  if (root === "2") {
    if (parts.length === 1) return wardMenu();
    if (parts.length === 2) {
      const ward = WARDS[parts[1] as keyof typeof WARDS];
      if (!ward) return "END Invalid ward.";
      const shelters = listSheltersMutable().filter(
        (s) => s.ward === ward.label && s.county === ward.county,
      );
      if (shelters.length === 0) {
        return `END No shelters listed for ${ward.label}.`;
      }
      const lines = shelters.map((s) => {
        const pct = s.capacity > 0 ? Math.round((s.occupancy / s.capacity) * 100) : 0;
        const st = s.status ?? (s.open ? "OPEN" : "CLOSED");
        return `${s.name.slice(0, 22)}: ${pct}% ${st}`;
      });
      return `END ${ward.label} shelters:\n${lines.join("\n")}`;
    }
  }

  if (root === "3") {
    if (parts.length === 1) return wardMenu();
    if (parts.length === 2) {
      const ward = WARDS[parts[1] as keyof typeof WARDS];
      if (!ward) return "END Invalid ward.";
      const rows = fundDisbursals.filter((d) => d.ward === ward.label);
      if (rows.length === 0) {
        return `END No disbursals in demo for ${ward.label}.`;
      }
      const lines = rows.map((d) => {
        const pct =
          d.totalAllocatedKes > 0
            ? Math.round((d.totalDisbursedKes / d.totalAllocatedKes) * 100)
            : 0;
        return `${d.title.slice(0, 24)}: ${pct}% out`;
      });
      return `END ${ward.label} funds:\n${lines.join("\n")}\nWeb: /transparency`;
    }
  }

  return "END Invalid option. Dial *384*253# to start again.";
}
