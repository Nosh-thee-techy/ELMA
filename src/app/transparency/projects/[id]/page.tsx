import { PageFrame } from "@/components/layout/page-frame";
import { ElmaMap } from "@/components/maps/elma-map";
import { StatusBadge } from "@/components/ui/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button-variants";
import { sourceLabel } from "@/lib/data/source-catalog";
import { getMitigationProjects } from "@/lib/data/repository";
import { cn, formatKes } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const projects = await getMitigationProjects();
  const project = projects.find((p) => p.id === params.id);
  if (!project) notFound();

  const mismatch =
    project.paperStatus === "complete" && project.fieldStatus !== "confirmed";

  return (
    <PageFrame pathname="/transparency">
      <div className="flex flex-col gap-6">
        <Link
          href="/transparency"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 w-fit")}
        >
          ← Back to all projects
        </Link>

        <div>
          <h2 className="font-heading text-2xl">{project.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {project.county}
            {project.subCounty ? ` · ${project.subCounty}` : ""} · {project.ward}
          </p>
          <p className="mt-1 text-xs font-semibold text-primary/80">
            Source: {sourceLabel(project.dataSource)}
            {project.procurementRef ? ` · ${project.procurementRef}` : ""}
          </p>
          <p className="mt-3 text-muted-foreground">{project.description}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-border/80 shadow-sm">
            <CardContent className="flex flex-col gap-1 p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Allocated</p>
              <p className="font-heading text-2xl text-primary">{formatKes(project.budgetKes)}</p>
              {project.disbursedKes != null ? (
                <p className="text-sm text-muted-foreground">
                  Disbursed {formatKes(project.disbursedKes)}
                </p>
              ) : null}
            </CardContent>
          </Card>
          <Card className="border-border/80 shadow-sm">
            <CardContent className="flex flex-col gap-1 p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Contractor</p>
              <p className="text-lg">{project.contractor}</p>
              {project.procurementStatus ? (
                <p className="text-sm text-muted-foreground">{project.procurementStatus}</p>
              ) : null}
            </CardContent>
          </Card>
          <Card className="border-border/80 shadow-sm">
            <CardContent className="flex flex-col gap-1 p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Timeline</p>
              {project.startDate ? (
                <p className="text-sm">Start {project.startDate}</p>
              ) : null}
              <p className="text-sm">Due {project.deadline}</p>
              {project.completionPercentage != null ? (
                <p className="font-bold text-primary">{project.completionPercentage}% complete</p>
              ) : null}
            </CardContent>
          </Card>
        </div>
        {project.sourceUrl ? (
          <p className="text-sm">
            <a
              href={project.sourceUrl}
              className="font-semibold text-primary underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View procurement notice
            </a>
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <StatusBadge label={`Paper: ${project.paperStatus}`} variant={project.paperStatus} />
          <StatusBadge label={`Field: ${project.fieldStatus}`} variant={project.fieldStatus} />
        </div>

        {mismatch ? (
          <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
            <AlertTriangle />
            <AlertTitle className="font-heading">Accountability gap</AlertTitle>
            <AlertDescription>
              Marked complete on paper but not fully confirmed on the ground — flagged for advocates
              and ward residents.
            </AlertDescription>
          </Alert>
        ) : null}

        {project.lat != null && project.lng != null ? (
          <ElmaMap
            initialZoom={14}
            points={[
              {
                id: project.id,
                lat: project.lat,
                lng: project.lng,
                label: project.ward,
                tone: mismatch ? "alert" : "primary",
              },
            ]}
          />
        ) : null}
      </div>
    </PageFrame>
  );
}
