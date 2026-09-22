import { HumanPhoto } from "@/components/media/human-photo";
import { StatCard } from "@/components/layout/stat-card";
import { elmaPhotos } from "@/lib/content/stock-images";
import { PageFrame } from "@/components/layout/page-frame";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  getCommunityAlerts,
  getEmergencyReports,
  getShelters,
} from "@/lib/data/repository";
import { cn } from "@/lib/utils";
import { AlertTriangle, CloudRain, Radio, Siren } from "lucide-react";
import Link from "next/link";

export default async function SafetyPage() {
  const [alerts, reports, shelters] = await Promise.all([
    getCommunityAlerts(),
    getEmergencyReports(),
    getShelters(),
  ]);

  const verified = alerts.filter((a) => a.verification === "verified").length;
  const rumors = alerts.filter((a) => a.verification === "rumor").length;
  const openReports = reports.filter((r) => r.status !== "resolved").length;
  const spacesLeft = shelters
    .filter((s) => s.open)
    .reduce((n, s) => n + Math.max(0, s.capacity - s.occupancy), 0);

  return (
    <PageFrame pathname="/safety">
      <div className="elma-card overflow-hidden p-0">
        <div className="grid md:grid-cols-[1fr_240px]">
          <p className="p-6 text-sm font-medium leading-relaxed text-muted-foreground md:p-8">
            Everything for when rains hit — pick one action below. You do not need to hunt through the
            top menu.
          </p>
          <HumanPhoto
            src={elmaPhotos.safetyReporting}
            alt="African woman using a mobile phone to reach help"
            className="min-h-[160px] md:min-h-full"
            sizes="240px"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Verified alerts" value={String(verified)} hint={`${rumors} rumor flagged`} />
        <StatCard
          label="Open reports"
          value={String(openReports)}
          hint="community queue"
          tone={openReports > 0 ? "alert" : "default"}
        />
        <StatCard label="Shelter spaces left" value={String(spacesLeft)} hint="open halls in demo" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/channels/phone"
          className="elma-card flex flex-col gap-3 border-emerald-600/20 bg-emerald-50/50 p-6 transition hover:shadow-md dark:bg-emerald-950/20"
        >
          <Radio className="size-8 text-emerald-700 dark:text-emerald-400" aria-hidden />
          <p className="text-lg font-extrabold">Feature phone (USSD/SMS)</p>
          <p className="text-sm text-muted-foreground">
            On-screen Kabambe simulator — dial *384*253# or text REPORT|… end to end.
          </p>
          <span className={cn(buttonVariants(), "mt-auto w-fit rounded-full bg-emerald-600 font-bold")}>
            Open simulator
          </span>
        </Link>

        <Link
          href="/emergency"
          className="elma-card flex flex-col gap-3 border-destructive/20 bg-[#fff5f5] p-6 transition hover:shadow-md"
        >
          <Siren className="size-8 text-destructive" aria-hidden />
          <p className="text-lg font-extrabold">Report an emergency</p>
          <p className="text-sm text-muted-foreground">
            Structured distress signal when hotlines jam — web form or feature-phone USSD/SMS lab.
          </p>
          <span className={cn(buttonVariants(), "mt-auto w-fit rounded-full bg-destructive font-bold")}>
            Open form
          </span>
        </Link>

        <Link
          href="/alerts"
          className="elma-card flex flex-col gap-3 p-6 transition hover:shadow-md"
        >
          <Radio className="size-8 text-primary" aria-hidden />
          <p className="text-lg font-extrabold">Alerts feed</p>
          <p className="text-sm text-muted-foreground">
            Verified KMD/WRA/KRCS updates vs WhatsApp rumors — check before you forward.
          </p>
          <span className={cn(buttonVariants({ variant: "outline" }), "mt-auto w-fit rounded-full font-bold")}>
            View feed
          </span>
        </Link>

        <Link
          href="/shelters"
          className="elma-card flex flex-col gap-3 p-6 transition hover:shadow-md"
        >
          <CloudRain className="size-8 text-primary" aria-hidden />
          <p className="text-lg font-extrabold">Shelters & capacity</p>
          <p className="text-sm text-muted-foreground">
            Which halls are open and how many beds are left — avoid walking to a full centre.
          </p>
          <span className={cn(buttonVariants({ variant: "outline" }), "mt-auto w-fit rounded-full font-bold")}>
            Find space
          </span>
        </Link>
      </div>

      <p className="text-sm text-muted-foreground">
        Ward volunteers:{" "}
        <Link href="/moderate" className="font-semibold text-primary underline-offset-2 hover:underline">
          alert moderation
        </Link>{" "}
        <AlertTriangle className="inline size-3.5 text-muted-foreground" aria-hidden /> (moderator
        key in production)
      </p>
    </PageFrame>
  );
}
