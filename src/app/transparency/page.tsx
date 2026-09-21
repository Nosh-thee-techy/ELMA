import { EmptyState } from "@/components/feedback/empty-state";
import { ElmaMap } from "@/components/maps/elma-map";
import { PageFrame } from "@/components/layout/page-frame";
import { StatCard } from "@/components/layout/stat-card";
import { DataSourcesPanel } from "@/components/transparency/data-sources-panel";
import { ProjectCard } from "@/components/transparency/project-card";
import { getMitigationProjects } from "@/lib/data/repository";
import { formatKes } from "@/lib/utils";
export default async function TransparencyPage() {
  const mitigationProjects = await getMitigationProjects();
  const totalBudget = mitigationProjects.reduce((s, p) => s + p.budgetKes, 0);
  const mismatches = mitigationProjects.filter(
    (p) => p.paperStatus === "complete" && p.fieldStatus !== "confirmed",
  ).length;

  const mapPoints = mitigationProjects
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => ({
      id: p.id,
      lat: p.lat as number,
      lng: p.lng as number,
      label: p.ward,
      tone:
        p.paperStatus === "complete" && p.fieldStatus !== "confirmed"
          ? ("alert" as const)
          : ("primary" as const),
    }));

  return (
    <PageFrame pathname="/transparency">
      <div className="flex flex-col gap-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Total allocated (demo)" value={formatKes(totalBudget)} />
          <StatCard
            label="Accountability flags"
            value={String(mismatches)}
            hint="complete on paper, not confirmed on ground"
            tone="alert"
          />
        </div>

        <ElmaMap points={mapPoints} />

        <DataSourcesPanel />

        {mitigationProjects.length === 0 ? (
          <EmptyState
            icon="folder"
            title="No projects published yet"
            description="When counties publish ward-level mitigation data, it will appear here."
            actionLabel="Return home"
            actionHref="/"
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
    </PageFrame>
  );
}
