import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BookOpen,
  CloudRain,
  FileText,
  Home,
  MapPin,
  Radio,
  ShieldCheck,
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

/** Public site — before sign-in */
export const publicNavLinks: NavLink[] = [
  {
    href: "/",
    label: "Home",
    description: "What ELMA is and how it works",
    icon: Home,
  },
  {
    href: "/about",
    label: "About",
    description: "Mission, tracks, and audiences",
    icon: BookOpen,
  },
];

/** Signed-in portal */
export const portalNavLinks: NavLink[] = [
  {
    href: "/counties",
    label: "Counties",
    description: "Kenya map and county fund transparency",
    icon: MapPin,
  },
  {
    href: "/safety",
    label: "Safety",
    description: "Reports, alerts, shelters",
    icon: AlertTriangle,
  },
  {
    href: "/about",
    label: "About",
    description: "Why ELMA exists",
    icon: BookOpen,
  },
];

export const navGroups: NavGroup[] = [
  {
    id: "main",
    title: "Navigate",
    subtitle: "",
    items: publicNavLinks,
  },
];

/** Linked from dashboard cards and assignment pages — not in the top bar */
export const secondaryNavLinks: NavLink[] = [
  {
    href: "/policy",
    label: "Policy plain language",
    description: "Turn dense PDF rules into actionable steps",
    icon: FileText,
  },
  {
    href: "/emergency",
    label: "Report emergency",
    description: "Structured reports when hotlines backlog",
    icon: AlertTriangle,
  },
  {
    href: "/alerts",
    label: "Alerts feed",
    description: "Verified updates vs social-media rumors",
    icon: Radio,
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
    elmaHelps: "Track 2 shows ward projects; Track 3 gives reports, alerts, and shelter space.",
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
    elmaHelps: "Moderation tools and labeled alert feeds reduce panic and duplication.",
  },
  {
    id: "advocates",
    title: "Accountability advocates & journalists",
    who: "CSOs, ward reps, and media tracking county spend",
    needs: [
      "Compare official “100% complete” claims with field reality",
      "Export-friendly view of budgets and contractors",
    ],
    elmaHelps: "Mitigation dashboard highlights paper vs field mismatches per ward.",
  },
  {
    id: "low-connectivity",
    title: "Low-connectivity users",
    who: "People on 2G/3G, limited data, or power outages during storms",
    needs: ["Text-first pages", "Minimal images", "Fast forms"],
    elmaHelps: "Lite mode in the navbar strips weight while keeping core actions.",
  },
];

export type PageMeta = {
  title: string;
  summary: string;
  building: string;
  audienceIds: AudienceProfile["id"][];
};

export const pageMeta: Record<string, PageMeta> = {
  "/": {
    title: "ELMA",
    summary: "Transparency and help for El Niño, floods, and drought — start here, then sign in to explore counties.",
    building:
      "Part 1 shows how public resources are allocated and moving (budgets, tenders, shelters). Part 2 reaches people on USSD, SMS, voice, and WhatsApp when networks and trust break down.",
    audienceIds: ["residents", "committees", "advocates", "low-connectivity"],
  },
  "/counties": {
    title: "Choose your county",
    summary: "Interactive Kenya map — filter or tap to open fund releases and tenders.",
    building: "County-level transparency after sign-in.",
    audienceIds: ["residents", "advocates"],
  },
  "/login": {
    title: "Sign in",
    summary: "Demo access to the county map and transparency portal.",
    building: "Production will use real accounts; PoC uses one-click demo sign-in.",
    audienceIds: ["residents"],
  },
  "/safety": {
    title: "Safety hub",
    summary: "During floods: report danger, read verified alerts, find shelter space.",
    building:
      "One entry point for Track 3 — web forms today; USSD, SMS, voice, and WhatsApp on the roadmap.",
    audienceIds: ["residents", "committees", "low-connectivity"],
  },
  "/about": {
    title: "Mission & who we serve",
    summary:
      "El Niño floods expose information asymmetry — ELMA makes ward-level preparedness visible, then dispatches help on every channel.",
    building:
      "Full story: what citizens cannot see today, blockchain-ready integrity for allocations, and why Kabambe-era USSD/SMS/voice matter as much as the web app.",
    audienceIds: ["residents", "committees", "advocates", "low-connectivity"],
  },
  "/transparency": {
    title: "Ward assignments",
    summary: "Project-level detail: budgets, contractors, and paper vs field status.",
    building:
      "Ward resource map from PPIP, COB, county ADPs, and NDMA-style feeds — budgets, contractors, completion, shelters, with tamper-evident records planned on-chain.",
    audienceIds: ["residents", "advocates"],
  },
  "/policy": {
    title: "Policy plain-language engine",
    summary: "Paste county rules; get steps you can follow today.",
    building:
      "AI-assisted rewriting (Gemma via OpenRouter) with offline fallback for slow networks.",
    audienceIds: ["residents", "low-connectivity"],
  },
  "/emergency": {
    title: "Community emergency reporting",
    summary: "Structured distress signals when hotlines jam.",
    building:
      "Web form today; roadmap USSD shortcode, SMS pings, IVR voice menus, and WhatsApp location/photo share for urban wards.",
    audienceIds: ["residents", "committees", "low-connectivity"],
  },
  "/alerts": {
    title: "Verified alerts vs rumors",
    summary: "See what is confirmed before you share it forward.",
    building:
      "Labeled feed (verified, pending, disputed, rumor) so messaging-app noise does not drive movement.",
    audienceIds: ["residents", "committees"],
  },
  "/shelters": {
    title: "Shelter capacity",
    summary: "Find open halls and whether they still have space.",
    building:
      "Occupancy bars and map pins so families do not walk to already-full centers on bad information.",
    audienceIds: ["residents", "committees"],
  },
  "/moderate": {
    title: "Alert moderation",
    summary: "Ward partners mark alerts verified or rumor.",
    building:
      "Simple ops panel for disaster committees — protected by moderator key in production.",
    audienceIds: ["committees"],
  },
};

export function audiencesForPage(pathname: string): AudienceProfile[] {
  const key = Object.keys(pageMeta).find((k) =>
    k === "/" ? pathname === "/" : pathname.startsWith(k),
  );
  const meta = key ? pageMeta[key] : pageMeta["/"];
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
