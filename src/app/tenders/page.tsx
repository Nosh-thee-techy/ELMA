import { EmptyState } from "@/components/feedback/empty-state";
import { FundFlowPipeline } from "@/components/counties/fund-flow-pipeline";
import { ProjectCard } from "@/components/transparency/project-card";
import { getMitigationProjects } from "@/lib/data/repository";
import { formatKes } from "@/lib/utils";

export default async function TendersPage() {
  const mitigationProjects = await getMitigationProjects();
  const totalBudget = mitigationProjects.reduce((s, p) => s + p.budgetKes, 0);
  const mismatches = mitigationProjects.filter(
    (p) => p.paperStatus === "complete" && p.fieldStatus !== "confirmed",
  ).length;

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Tenders</p>
        <h1 className="mt-2 text-3xl font-extrabold text-elma-navy">Contracts & field progress</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Ward-level procurement across demo counties — allocated amounts, contractors, and paper vs
          field status.
        </p>
      </section>

      <FundFlowPipeline compact />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="elma-card p-5">
          <p className="text-xs font-bold uppercase text-muted-foreground">Total allocated</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-700">{formatKes(totalBudget)}</p>
        </div>
        <div className="elma-card p-5">
          <p className="text-xs font-bold uppercase text-muted-foreground">Accountability flags</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-700">{mismatches}</p>
          <p className="text-xs text-muted-foreground">Paper complete · field not confirmed</p>
        </div>
      </div>

      {mitigationProjects.length === 0 ? (
        <EmptyState
          icon="folder"
          title="No tenders published yet"
          description="When counties publish ward-level data, it will appear here."
          actionLabel="Browse counties"
          actionHref="/counties"
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {mitigationProjects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
