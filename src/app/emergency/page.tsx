import { EmptyState } from "@/components/feedback/empty-state";
import { PageFrame } from "@/components/layout/page-frame";
import { ReportForm } from "@/components/emergency/report-form";
import { Card, CardContent } from "@/components/ui/card";
import { DEMO_COUNTY } from "@/lib/data/seed";
import { getEmergencyReports } from "@/lib/data/repository";
import { formatRelativeTime } from "@/lib/utils";
export default async function EmergencyPage() {
  const reports = await getEmergencyReports();

  return (
    <PageFrame pathname="/emergency">
      <div className="flex flex-col gap-8">
        <ReportForm defaultCounty={DEMO_COUNTY} />

        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-xl">Ward queue (demo)</h2>
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
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="font-medium capitalize text-destructive">{r.category}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(r.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{r.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.ward}, {r.county} · {r.status}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PageFrame>
  );
}
