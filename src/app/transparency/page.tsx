import { HumanPhoto } from "@/components/media/human-photo";
import { FundFlowPipeline } from "@/components/counties/fund-flow-pipeline";
import { elmaPhotos } from "@/lib/content/stock-images";
import { AuditTrailPanel } from "@/components/transparency/audit-trail-panel";
import { ProofCard } from "@/components/transparency/proof-card";
import { PublicShelterCard } from "@/components/shelters/public-shelter-card";
import { getServerSession } from "@/lib/auth/session";
import { fundDisbursals, projectProofs } from "@/lib/data/disbursals-seed";
import { getShelters } from "@/lib/data/repository";

export default async function TransparencyPage() {
  const shelters = await getShelters();
  const { profile } = getServerSession();
  const canVerify = profile?.role === "VERIFIER" || profile?.role === "ADMIN";
  const shelterById = new Map(shelters.map((s) => [s.id, s]));

  return (
    <div className="flex flex-col gap-10">
      <section className="elma-card overflow-hidden p-0">
        <div className="grid lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">
              Public audit portal
            </p>
            <h1 className="text-balance text-3xl font-extrabold text-elma-navy dark:text-slate-50 sm:text-4xl">
              Disaster fund disbursals & proof
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              Inspect allocations, what was disbursed, tender details, and field evidence — with official
              citations where published.
            </p>
          </div>
          <HumanPhoto
            src={elmaPhotos.proofShelterCommunity}
            alt="Maasai mother and child in Kenya — shelter and care"
            className="min-h-[220px] lg:min-h-full"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </section>

      <FundFlowPipeline />

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-extrabold text-elma-navy dark:text-slate-50">Disbursal records</h2>
        <ul className="flex flex-col gap-6">
          {fundDisbursals.map((d) => {
            const proof = projectProofs.find((p) => p.disbursalId === d.id);
            const linkedShelter = proof?.linkedShelterId
              ? shelterById.get(proof.linkedShelterId)
              : undefined;
            return (
              <li key={d.id}>
                <ProofCard
                  disbursal={d}
                  proof={proof}
                  linkedShelter={linkedShelter}
                  canVerify={canVerify}
                />
              </li>
            );
          })}
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

      <AuditTrailPanel />
    </div>
  );
}
