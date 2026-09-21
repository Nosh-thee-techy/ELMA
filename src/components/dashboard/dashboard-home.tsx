import { StatCard } from "@/components/layout/stat-card";
import { AreaDashboard } from "@/components/dashboard/area-dashboard";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  buildAreaSummaries,
  totalsFromSummaries,
  uniqueCounties,
} from "@/lib/data/dashboard-aggregates";
import {
  getCommunityAlerts,
  getEmergencyReports,
  getMitigationProjects,
  getShelters,
} from "@/lib/data/repository";
import { cn, formatKes } from "@/lib/utils";
import { AlertTriangle, FileText, Shield, Siren } from "lucide-react";
import Link from "next/link";

export async function DashboardHome() {
  const [projects, alerts, reports, shelters] = await Promise.all([
    getMitigationProjects(),
    getCommunityAlerts(),
    getEmergencyReports(),
    getShelters(),
  ]);

  const areas = buildAreaSummaries({ projects, alerts, reports, shelters });
  const counties = uniqueCounties(areas);
  const totals = totalsFromSummaries(areas);

  return (
    <div className="flex flex-col gap-5">
      <section className="elma-card flex flex-col gap-3 p-6 sm:p-8">
        <p className="max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground">
          Filter by county, scan the ward table for assigned prep money and flags, then open{" "}
          <span className="font-bold text-foreground">Assignments</span> for project detail or{" "}
          <span className="font-bold text-foreground">Safety</span> when you need help during
          floods.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            href="/transparency"
            className={cn(buttonVariants({ size: "lg" }), "rounded-full font-bold")}
          >
            <Shield data-icon="inline-start" />
            Ward assignments
          </Link>
          <Link
            href="/safety"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "rounded-full font-bold",
            )}
          >
            <Siren data-icon="inline-start" />
            Safety hub
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Wards in demo data"
          value={String(totals.wards)}
          hint={`${counties.length} counties`}
          icon={Shield}
        />
        <StatCard
          label="Prep money assigned"
          value={formatKes(totals.budgetKes)}
          hint={`${totals.projects} projects`}
          icon={FileText}
        />
        <StatCard
          label="Accountability flags"
          value={String(totals.flags)}
          hint="paper vs field mismatch"
          tone={totals.flags > 0 ? "alert" : "default"}
          icon={AlertTriangle}
        />
        <StatCard
          label="Verified alerts · shelter space"
          value={`${totals.verifiedAlerts} · ${totals.shelterSpacesLeft}`}
          hint={
            totals.openReports > 0
              ? `${totals.openReports} open community report${totals.openReports === 1 ? "" : "s"}`
              : "Open reports in queue"
          }
          icon={Siren}
        />
      </div>

      <AreaDashboard areas={areas} counties={counties} />

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/transparency" className="elma-card block p-5 transition hover:shadow-md">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Before floods</p>
          <p className="mt-2 font-bold">Assignments & contractors</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Budgets, procurement refs, paper vs field checks per project.
          </p>
        </Link>
        <Link href="/policy" className="elma-card block p-5 transition hover:shadow-md">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Understand rules</p>
          <p className="mt-2 font-bold">Policy in plain language</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Turn county PDF wording into steps you can follow today.
          </p>
        </Link>
        <Link href="/safety" className="elma-card block p-5 transition hover:shadow-md">
          <p className="text-xs font-bold uppercase tracking-wide text-destructive">During floods</p>
          <p className="mt-2 font-bold">Safety hub</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Report danger, verified alerts, and shelter capacity in one place.
          </p>
        </Link>
      </section>
    </div>
  );
}
