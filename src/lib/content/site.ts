import type { LucideIcon } from "lucide-react";
import {
  CloudRain,
  FileText,
  Home,
  MapPin,
  Radio,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

export type NavLink = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export type NavGroup = {
  id: string;
  title: string;
  subtitle: string;
  items: NavLink[];
};

/** Main public website — keep this short */
export const mainSiteNavLinks: NavLink[] = [
  {
    href: "/",
    label: "Home",
    description: "What ELMA is",
    icon: Home,
  },
  {
    href: "/explore",
    label: "Explore",
    description: "Interactive Kenya map — funds, tenders, who published what",
    icon: MapPin,
  },
  {
    href: "/policy",
    label: "Policy",
    description: "Plain-language rules for relief and shelter",
    icon: FileText,
  },
  {
    href: "/channels/phone",
    label: "USSD",
    description: "Feature-phone simulator",
    icon: Radio,
  },
];

/** @deprecated use mainSiteNavLinks */
export const publicNavLinks = mainSiteNavLinks;

export const fieldAppNavLink: NavLink = {
  href: "/app",
  label: "Field app",
  description: "Responder iPhone experience",
  icon: Smartphone,
};

export const navGroups: NavGroup[] = [
  {
    id: "main",
    title: "Navigate",
    subtitle: "",
    items: mainSiteNavLinks,
  },
];

/** Linked from dashboard cards — not in the top bar */
export const secondaryNavLinks: NavLink[] = [
  {
    href: "/policy",
    label: "Policy plain language",
    description: "Turn dense PDF rules into actionable steps",
    icon: FileText,
  },
  {
    href: "/channels/phone",
    label: "USSD / SMS lab",
    description: "Kabambe simulator",
    icon: Radio,
  },
  {
    href: "/explore",
    label: "County map",
    description: "Pick your county on the map",
    icon: MapPin,
  },
  {
    href: "/shelters",
    label: "Shelters",
    description: "Which halls are open and have space",
    icon: CloudRain,
  },
  {
    href: "/moderate",
    label: "Alert moderation",
    description: "Verify or flag community alerts",
    icon: ShieldCheck,
  },
];

export type AudienceProfile = {
  id: string;
  title: string;
  who: string;
  needs: string[];
  elmaHelps: string;
};

export const targetAudiences: AudienceProfile[] = [
  {
    id: "residents",
    title: "Ward residents",
    who: "Families in flood-prone neighborhoods (e.g. Nyalenda, Kondele, Manyatta)",
    needs: [
      "Know if drainage work was actually done before rains",
      "Understand shelter and relief rules without reading legal PDFs",
      "Report danger when phone lines are jammed",
    ],
    elmaHelps: "The map shows ward projects; the field app handles reports and shelter space.",
  },
  {
    id: "committees",
    title: "Ward disaster committees",
    who: "Volunteer leaders coordinating local response",
    needs: [
      "Publish verified alerts residents can trust",
      "See incoming structured reports in one queue",
      "Counter WhatsApp rumors quickly",
    ],
    elmaHelps: "Field app moderation tools and labeled alert feeds reduce panic.",
  },
  {
    id: "advocates",
    title: "Accountability advocates & journalists",
    who: "CSOs, ward reps, and media tracking county spend",
    needs: [
      "Compare official “100% complete” claims with field reality",
      "Export-friendly view of budgets and contractors",
    ],
    elmaHelps: "Explore map highlights paper vs field mismatches per ward.",
  },
  {
    id: "low-connectivity",
    title: "Low-connectivity users",
    who: "People on 2G/3G, limited data, or power outages during storms",
    needs: ["Text-first pages", "Minimal images", "Fast forms"],
    elmaHelps: "Lite mode and USSD/SMS paths when data is down.",
  },
];

export type PageMeta = {
  title: string;
  summary: string;
  audienceIds: string[];
};

export const pageMeta: Record<string, PageMeta> = {
  "/": {
    title: "ELMA",
    summary: "Disaster fund transparency and field response for Kenya.",
    audienceIds: ["residents", "advocates"],
  },
  "/explore": {
    title: "Explore Kenya",
    summary: "Interactive map — pick a county, follow the money, see who published it.",
    audienceIds: ["residents", "advocates"],
  },
  "/policy": {
    title: "Policy in plain language",
    summary: "Relief and shelter rules you can actually use.",
    audienceIds: ["residents"],
  },
  "/channels/phone": {
    title: "USSD & SMS lab",
    summary: "Try *384*253# on a feature-phone simulator.",
    audienceIds: ["low-connectivity", "residents"],
  },
  "/app": {
    title: "ELMA field app",
    summary: "Responder operations on your phone.",
    audienceIds: ["committees"],
  },
  "/counties": {
    title: "Explore Kenya",
    summary: "Redirected to the interactive map.",
    audienceIds: ["residents"],
  },
  "/transparency": {
    title: "Disbursal tracker",
    summary: "Fund flows and proofs (linked from Explore).",
    audienceIds: ["advocates"],
  },
};

export function audiencesForPath(pathname: string): AudienceProfile[] {
  const meta = metaForPath(pathname);
  return targetAudiences.filter((a) => meta.audienceIds.includes(a.id));
}

export function metaForPath(pathname: string): PageMeta {
  if (pathname === "/") return pageMeta["/"];
  const match = Object.entries(pageMeta)
    .filter(([k]) => k !== "/")
    .sort((a, b) => b[0].length - a[0].length)
    .find(([k]) => pathname.startsWith(k));
  return match?.[1] ?? pageMeta["/"];
}
