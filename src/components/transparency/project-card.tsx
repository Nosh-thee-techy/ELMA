import { sourceLabel } from "@/lib/data/source-catalog";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MitigationProject } from "@/lib/types";
import { formatKes } from "@/lib/utils";
import Link from "next/link";

export function ProjectCard({ project }: { project: MitigationProject }) {
  const mismatch =
    project.paperStatus === "complete" && project.fieldStatus !== "confirmed";

  return (
    <Card
      className={
        mismatch
          ? "border-destructive/30 bg-card shadow-sm ring-1 ring-destructive/10"
          : "border-border/80 bg-card shadow-sm"
      }
    >
      <CardHeader className="gap-1 pb-2">
        <CardDescription className="text-xs uppercase tracking-wide text-primary/80">
          {project.ward}
          {project.subCounty ? ` · ${project.subCounty}` : ""} · {project.county}
        </CardDescription>
        <CardTitle className="font-heading text-xl leading-snug">
          <Link
            href={`/transparency/projects/${project.id}`}
            className="transition hover:text-primary"
          >
            {project.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
          <span className="rounded-full bg-muted px-2.5 py-1">{sourceLabel(project.dataSource)}</span>
          {project.procurementRef ? (
            <span className="rounded-full bg-muted px-2.5 py-1">{project.procurementRef}</span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Allocated</p>
            <p className="font-heading text-lg text-primary">{formatKes(project.budgetKes)}</p>
            {project.disbursedKes != null ? (
              <p className="text-xs text-muted-foreground">
                Disbursed {formatKes(project.disbursedKes)}
              </p>
            ) : null}
          </div>
          {project.completionPercentage != null ? (
            <p className="text-sm font-bold">{project.completionPercentage}% complete</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            label={`Paper: ${project.paperStatus.replace("_", " ")}`}
            variant={project.paperStatus}
          />
          <StatusBadge
            label={`Field: ${project.fieldStatus.replace("_", " ")}`}
            variant={project.fieldStatus}
          />
        </div>
        {mismatch ? (
          <p className="rounded-lg bg-destructive/5 px-3 py-2 text-sm text-destructive">
            Accountability flag: marked complete on paper but not confirmed on the ground.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
