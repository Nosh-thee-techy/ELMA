import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BookOpen,
  CloudRain,
  FileText,
  Home,
  Radio,
  Shield,
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

export const navGroups: NavGroup[] = [
  {
    id: "start",
    title: "Start here",
    subtitle: "What ELMA is and who it serves",
    items: [
      {
        href: "/",
        label: "Overview",
        description: "Platform summary and quick links",
        icon: Home,
      },
      {
        href: "/about",
        label: "Mission & audience",
        description: "Problem, tracks, and people we build for",
        icon: BookOpen,
      },
    ],
  },
  {
    id: "track2",
    title: "Track 2 · Before floods",
    subtitle: "County transparency & accountability",
    items: [
      {
        href: "/transparency",
        label: "Mitigation projects",
        description: "Ward budgets, contractors, paper vs field",
        icon: Shield,
      },
      {
        href: "/policy",
        label: "Policy in plain language",
        description: "Turn dense PDF rules into actionable steps",
        icon: FileText,
      },
    ],
  },
  {
    id: "track3",
    title: "Track 3 · During floods",
    subtitle: "Community safety & response",
    items: [
      {
        href: "/emergency",
        label: "Report an emergency",
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
        label: "Shelters & capacity",
        description: "Which halls are open and have space",
        icon: CloudRain,
      },
    ],
  },
  {
    id: "ops",
    title: "Ward & partner tools",
    subtitle: "For committees and moderators",
    items: [
      {
        href: "/moderate",
        label: "Alert moderation",
        description: "Verify or flag community alerts",
        icon: ShieldCheck,
      },
    ],
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
    title: "Platform overview",
    summary:
      "Close the information gap: ward allocations before floods, multi-channel safety during floods.",
    building:
      "Part 1 shows how public resources are allocated and moving (budgets, tenders, shelters). Part 2 reaches people on USSD, SMS, voice, and WhatsApp when networks and trust break down.",
    audienceIds: ["residents", "committees", "advocates", "low-connectivity"],
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
    title: "Ward mitigation transparency",
    summary: "See what was allocated for your ward and whether work is actually moving.",
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
