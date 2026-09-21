import { EmptyState } from "@/components/feedback/empty-state";
import { ElmaMap } from "@/components/maps/elma-map";
import { PageFrame } from "@/components/layout/page-frame";
import { StatCard } from "@/components/layout/stat-card";
import { DataSourcesPanel } from "@/components/transparency/data-sources-panel";
import { ProjectCard } from "@/components/transparency/project-card";
import { getMitigationProjects } from "@/lib/data/repository";
import { formatKes } from "@/lib/utils";
type Props = {
  searchParams?: { county?: string; ward?: string };
};

export default async function TransparencyPage({ searchParams }: Props) {
  const allProjects = await getMitigationProjects();
  const countyFilter = searchParams?.county?.trim();
  const wardFilter = searchParams?.ward?.trim();
  const mitigationProjects = allProjects.filter((p) => {
    if (countyFilter && p.county !== countyFilter) return false;
    if (wardFilter && p.ward !== wardFilter) return false;
    return true;
  });
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
        {countyFilter || wardFilter ? (
          <p className="rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold text-foreground">
            Showing{" "}
            {wardFilter ? (
              <>
                <span className="text-primary">{wardFilter}</span>
                {countyFilter ? ` · ${countyFilter}` : ""}
              </>
            ) : (
              <span className="text-primary">{countyFilter}</span>
            )}{" "}
            —{" "}
            <a href="/transparency" className="underline underline-offset-2">
              clear filter
            </a>
          </p>
        ) : null}
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
