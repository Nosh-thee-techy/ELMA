import { StatCard } from "@/components/layout/stat-card";
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
      <p className="-mt-2 max-w-2xl text-sm font-medium text-muted-foreground">
        Everything for when rains hit — pick one action below. You do not need to hunt through the
        top menu.
      </p>

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

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/emergency"
          className="elma-card flex flex-col gap-3 border-destructive/20 bg-[#fff5f5] p-6 transition hover:shadow-md"
        >
          <Siren className="size-8 text-destructive" aria-hidden />
          <p className="text-lg font-extrabold">Report an emergency</p>
          <p className="text-sm text-muted-foreground">
            Structured distress signal when hotlines jam. Web today; USSD/SMS on the roadmap.
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
