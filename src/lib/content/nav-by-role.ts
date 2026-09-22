import type { ElmaRole, SessionProfile } from "@/lib/auth/session";
import {
  type NavGroup,
  type NavLink,
  publicNavLinks,
} from "@/lib/content/site";
import {
  AlertTriangle,
  CloudRain,
  FileText,
  Hammer,
  Home,
  LayoutDashboard,
  MapPin,
  Wallet,
} from "lucide-react";

/** Citizens & journalists — no staff login required */
export const citizenNavLinks: NavLink[] = publicNavLinks.filter(
  (l) => l.href !== "/channels/phone",
);

const responderNavLinks: NavLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Shelter triage and field updates",
    icon: LayoutDashboard,
  },
  {
    href: "/shelters",
    label: "Shelters",
    description: "Open halls and capacity",
    icon: CloudRain,
  },
  {
    href: "/safety",
    label: "Help",
    description: "Reports, alerts, USSD/SMS lab",
    icon: AlertTriangle,
  },
];

const verifierNavLinks: NavLink[] = [
  {
    href: "/transparency",
    label: "Verify funds",
    description: "Disbursals, proofs, audit trail",
    icon: FileText,
  },
  {
    href: "/dashboard",
    label: "Console",
    description: "Verification desk",
    icon: LayoutDashboard,
  },
  {
    href: "/counties",
    label: "Counties",
    description: "County map and profiles",
    icon: MapPin,
  },
];

const adminNavLinks: NavLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Operations overview",
    icon: LayoutDashboard,
  },
  {
    href: "/counties",
    label: "Counties",
    description: "Map and ward detail",
    icon: MapPin,
  },
  {
    href: "/releases",
    label: "Releases",
    description: "Fund releases",
    icon: Wallet,
  },
  {
    href: "/tenders",
    label: "Tenders",
    description: "Contracts and field checks",
    icon: Hammer,
  },
  {
    href: "/transparency",
    label: "Transparency",
    description: "Public disbursal tracker",
    icon: FileText,
  },
];

export function resolveNavGroups(options: {
  sessionActive: boolean;
  profile: SessionProfile | null;
}): NavGroup[] {
  const { sessionActive, profile } = options;

  if (!sessionActive || !profile) {
    return [{ id: "public", title: "Public portal", subtitle: "", items: citizenNavLinks }];
  }

  switch (profile.role) {
    case "RESPONDER":
      return [{ id: "responder", title: "Field operations", subtitle: "", items: responderNavLinks }];
    case "VERIFIER":
      return [{ id: "verifier", title: "Audit desk", subtitle: "", items: verifierNavLinks }];
    case "ADMIN":
      return [{ id: "admin", title: "County admin", subtitle: "", items: adminNavLinks }];
    default:
      return [{ id: "public", title: "Public portal", subtitle: "", items: citizenNavLinks }];
  }
}

export function showCountySearchInHeader(profile: SessionProfile | null): boolean {
  if (!profile) return true;
  return profile.role === "ADMIN" || profile.role === "VERIFIER";
}

export function roleNavLabel(profile: SessionProfile): string {
  switch (profile.role) {
    case "RESPONDER":
      return profile.ward ? `Responder · ${profile.ward}` : "Responder";
    case "VERIFIER":
      return "Verifier";
    case "ADMIN":
      return `Admin · ${profile.county}`;
    default:
      return profile.role;
  }
}

/** Short links shown inside the mobile dashboard shell footer */
export function dashboardFooterLinks(role: ElmaRole): NavLink[] {
  switch (role) {
    case "RESPONDER":
      return [
        { href: "/transparency", label: "Public tracker", description: "", icon: FileText },
        { href: "/", label: "Home", description: "", icon: Home },
      ];
    case "VERIFIER":
      return [
        { href: "/dashboard", label: "Console", description: "", icon: LayoutDashboard },
        { href: "/", label: "Home", description: "", icon: Home },
      ];
    case "ADMIN":
      return [
        { href: "/safety", label: "Help hub", description: "", icon: AlertTriangle },
        { href: "/", label: "Home", description: "", icon: Home },
      ];
    default:
      return [{ href: "/", label: "Home", description: "", icon: Home }];
  }
}
