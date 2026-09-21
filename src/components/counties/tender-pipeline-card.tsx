import { procurementStages } from "@/lib/data/county-finance";
import { StatusBadge } from "@/components/ui/status-badge";
import type { MitigationProject } from "@/lib/types";
import { formatKes } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function TenderPipelineCard({ project }: { project: MitigationProject }) {
  const stages = procurementStages(project);
  const mismatch =
    project.paperStatus === "complete" && project.fieldStatus !== "confirmed";
  const pct = project.completionPercentage ?? 0;

  return (
    <article
      className={cn(
        "elma-card flex flex-col gap-4 p-5 sm:p-6",
        mismatch && "ring-2 ring-destructive/25",
      )}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            {project.ward} · {project.procurementRef ?? "Tender"}
          </p>
          <Link
            href={`/transparency/projects/${project.id}`}
            className="mt-1 text-lg font-extrabold leading-snug hover:text-primary"
          >
            {project.title}
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">{project.contractor}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase text-muted-foreground">Allocated</p>
          <p className="text-lg font-extrabold text-primary">{formatKes(project.budgetKes)}</p>
          {project.disbursedKes != null ? (
            <p className="text-xs text-muted-foreground">
              Disbursed {formatKes(project.disbursedKes)}
            </p>
          ) : null}
        </div>
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
        {project.procurementStatus ? (
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
            {project.procurementStatus}
          </span>
        ) : null}
      </div>

      <div>
        <div className="mb-1 flex justify-between text-xs font-bold">
          <span>Physical progress</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", mismatch ? "bg-destructive" : "bg-primary")}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ol className="flex flex-wrap gap-2">
        {stages.map((s) => (
          <li
            key={s.id}
            className={cn(
              "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide",
              s.done
                ? "bg-emerald-100 text-emerald-900"
                : s.current
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground",
            )}
          >
            {s.label}
          </li>
        ))}
      </ol>
    </article>
  );
}
