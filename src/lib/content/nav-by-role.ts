import type { SessionProfile } from "@/lib/auth/session";
import { type NavGroup, type NavLink, mainSiteNavLinks } from "@/lib/content/site";
import {
  AlertTriangle,
  FileText,
  Hammer,
  Home,
  LayoutDashboard,
  MapPin,
  Wallet,
} from "lucide-react";

/** Public marketing site — identical for citizens and staff browsing the web */
export function resolvePublicNavGroups(): NavGroup[] {
  return [{ id: "main", title: "ELMA", subtitle: "", items: mainSiteNavLinks }];
}

const responderAppLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", description: "Shelter triage", icon: LayoutDashboard },
  { href: "/shelters", label: "Shelters", description: "Capacity", icon: MapPin },
  { href: "/channels/phone", label: "USSD", description: "Field channel", icon: AlertTriangle },
];

const verifierAppLinks: NavLink[] = [
  { href: "/explore", label: "Map", description: "County explorer", icon: MapPin },
  { href: "/transparency", label: "Verify", description: "Proofs", icon: FileText },
  { href: "/dashboard", label: "Console", description: "Desk", icon: LayoutDashboard },
];

const adminAppLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", description: "Ops", icon: LayoutDashboard },
  { href: "/explore", label: "Map", description: "Counties", icon: MapPin },
  { href: "/releases", label: "Releases", description: "Funds", icon: Wallet },
  { href: "/tenders", label: "Tenders", description: "Contracts", icon: Hammer },
  { href: "/transparency", label: "Audit", description: "Tracker", icon: FileText },
];

/** Inside field app / dashboard shell only */
export function resolveAppNavGroups(profile: SessionProfile | null): NavGroup[] {
  if (!profile) {
    return [{ id: "demo", title: "Preview", subtitle: "", items: responderAppLinks }];
  }
  switch (profile.role) {
    case "RESPONDER":
      return [{ id: "ops", title: "Field ops", subtitle: "", items: responderAppLinks }];
    case "VERIFIER":
      return [{ id: "audit", title: "Audit", subtitle: "", items: verifierAppLinks }];
    case "ADMIN":
      return [{ id: "admin", title: "Admin", subtitle: "", items: adminAppLinks }];
    default:
      return resolvePublicNavGroups();
  }
}

/** @deprecated — main site always uses public nav */
export function resolveNavGroups(options: {
  sessionActive: boolean;
  profile: SessionProfile | null;
}): NavGroup[] {
  void options;
  return resolvePublicNavGroups();
}

export function showCountySearchInHeader(): boolean {
  return false;
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

export function dashboardFooterLinks(): NavLink[] {
  return [
    { href: "/explore", label: "Public map", description: "", icon: MapPin },
    { href: "/", label: "Website home", description: "", icon: Home },
  ];
}
