import { FundFlowPipeline } from "@/components/counties/fund-flow-pipeline";
import { ProofCard } from "@/components/transparency/proof-card";
import { PublicShelterCard } from "@/components/shelters/public-shelter-card";
import { fundDisbursals, projectProofs } from "@/lib/data/disbursals-seed";
import { getShelters } from "@/lib/data/repository";

export default async function TransparencyPage() {
  const shelters = await getShelters();

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">
          Public audit portal
        </p>
        <h1 className="text-balance text-3xl font-extrabold text-elma-navy dark:text-slate-50 sm:text-4xl">
          Disaster fund disbursals & proof
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          Inspect allocations, what was disbursed, tender details, and field evidence — with official
          citations where published.
        </p>
      </section>

      <FundFlowPipeline />

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-extrabold text-elma-navy dark:text-slate-50">Disbursal records</h2>
        <ul className="flex flex-col gap-6">
          {fundDisbursals.map((d) => (
            <li key={d.id}>
              <ProofCard disbursal={d} proof={projectProofs.find((p) => p.disbursalId === d.id)} />
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-extrabold text-elma-navy dark:text-slate-50">
          Shelter capacity (live demo)
        </h2>
        <p className="text-sm text-muted-foreground">
          Status updated by verified responders on the operational dashboard.
        </p>
        <ul className="grid gap-4 md:grid-cols-2">
          {shelters.map((s) => (
            <li key={s.id}>
              <PublicShelterCard shelter={s} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
