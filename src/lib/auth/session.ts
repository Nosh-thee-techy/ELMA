import { cookies } from "next/headers";

export type ElmaRole = "ADMIN" | "RESPONDER" | "VERIFIER";

export type SessionProfile = {
  role: ElmaRole;
  email: string;
  county: string;
  ward?: string;
  organization: string;
};

export const ELMA_SESSION_COOKIE = "elma_session";
export const ELMA_PROFILE_COOKIE = "elma_profile";

export function isActiveDemoSession(value: string | undefined): boolean {
  return value === "active";
}

export function parseProfileCookie(raw: string | undefined): SessionProfile | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as SessionProfile;
    if (parsed.role !== "ADMIN" && parsed.role !== "RESPONDER" && parsed.role !== "VERIFIER") {
      return null;
    }
    if (!parsed.email || !parsed.county || !parsed.organization) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getServerSession(): {
  active: boolean;
  profile: SessionProfile | null;
} {
  const jar = cookies();
  const active = isActiveDemoSession(jar.get(ELMA_SESSION_COOKIE)?.value);
  const profile = parseProfileCookie(jar.get(ELMA_PROFILE_COOKIE)?.value);
  return { active, profile };
}

export function canAccessReport(
  profile: SessionProfile,
  report: { county: string; ward: string },
): boolean {
  if (profile.role === "VERIFIER") return true;
  if (profile.role === "ADMIN") {
    return profile.county === report.county || profile.county === "National";
  }
  return (
    profile.role === "RESPONDER" &&
    profile.county === report.county &&
    profile.ward === report.ward
  );
}

export function canUpdateReportStatus(profile: SessionProfile): boolean {
  return profile.role === "RESPONDER" || profile.role === "ADMIN";
}

export function canEditShelter(
  profile: SessionProfile,
  shelter: { county: string; ward: string },
): boolean {
  if (profile.role === "ADMIN") {
    return profile.county === shelter.county || profile.county === "National";
  }
  return (
    profile.role === "RESPONDER" &&
    profile.county === shelter.county &&
    profile.ward === shelter.ward
  );
}
