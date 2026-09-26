import { ReportStatusBadge } from "@/components/emergency/report-status-badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { ReportForm } from "@/components/emergency/report-form";
import { PageHero } from "@/components/layout/page-hero";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card, CardContent } from "@/components/ui/card";
import { DEMO_COUNTY } from "@/lib/data/seed";
import { getEmergencyReports } from "@/lib/data/repository";
import { cn, formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

export default async function EmergencyPage() {
  const reports = await getEmergencyReports();

  return (
    <div className="flex flex-col gap-8">
      <PageHero
        variant="minimal"
        eyebrow="Community reporting"
        title="Structured emergency reports"
        description="When hotlines jam, neighbors can file ward-scoped distress signals — same pipeline as USSD option 1."
      >
        <Link
          href="/channels/phone"
          className={cn(buttonVariants({ size: "sm", variant: "outline" }), "mt-2 w-fit rounded-full font-bold")}
        >
          USSD simulator
        </Link>
      </PageHero>

      <ReportForm defaultCounty={DEMO_COUNTY} />

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl text-elma-navy dark:text-slate-50">Ward queue (demo)</h2>
        {reports.length === 0 ? (
          <EmptyState
            icon="inbox"
            title="No reports in the queue"
            description="When neighbors submit emergencies, ward responders see them here."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {reports.map((r) => (
              <li key={r.id}>
                <Card className="border-border/80 shadow-sm">
                  <CardContent className="flex flex-col gap-2 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold capitalize text-foreground">{r.category}</p>
                      <ReportStatusBadge status={r.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {r.ward}, {r.county} · {formatRelativeTime(r.createdAt)} · ref{" "}
                      {r.id.slice(0, 8)}
                    </p>
                    <p className="text-sm leading-relaxed">{r.description}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
