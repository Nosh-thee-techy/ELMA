import { FundFlowPipeline } from "@/components/counties/fund-flow-pipeline";
import { PageHero } from "@/components/layout/page-hero";
import { AuditTrailPanel } from "@/components/transparency/audit-trail-panel";
import { ProofCard } from "@/components/transparency/proof-card";
import { PublicShelterCard } from "@/components/shelters/public-shelter-card";
import { buttonVariants } from "@/components/ui/button-variants";
import { getServerSession } from "@/lib/auth/session";
import { fundDisbursals, projectProofs } from "@/lib/data/disbursals-seed";
import { getShelters } from "@/lib/data/repository";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function TransparencyPage() {
  const shelters = await getShelters();
  const { profile } = getServerSession();
  const canVerify = profile?.role === "VERIFIER" || profile?.role === "ADMIN";
  const shelterById = new Map(shelters.map((s) => [s.id, s]));

  return (
    <div className="flex flex-col gap-10">
      <PageHero
        variant="navy"
        eyebrow="Public audit portal"
        title="Disbursals, proofs, and shelter status"
        description="Inspect allocations, tender lines, field evidence, and the append-only audit trail — with citations where counties published them."
      >
        <Link
          href="/explore"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-2 w-fit rounded-full border-white/25 bg-white/10 font-bold text-white hover:bg-white/20",
          )}
        >
          Open Kenya map
        </Link>
      </PageHero>

      <FundFlowPipeline />

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl text-elma-navy dark:text-slate-50">Disbursal records</h2>
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
        <h2 className="font-display text-2xl text-elma-navy dark:text-slate-50">
          Shelter capacity (live demo)
        </h2>
        <p className="text-sm text-muted-foreground">
          Updated by verified responders on the operational dashboard.
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
