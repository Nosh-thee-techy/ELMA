import type { FundDisbursal, ProjectProof, Shelter } from "@/lib/types";
import { ArrowRight, Link2 } from "lucide-react";
import Link from "next/link";

type Props = {
  disbursal: FundDisbursal;
  proof?: ProjectProof;
  linkedShelter?: Shelter;
};

export function ChainOfCustody({ disbursal, proof, linkedShelter }: Props) {
  if (!proof?.linkedShelterId && !proof?.sourceDocumentHash) return null;

  return (
    <section className="rounded-2xl border border-dashed border-emerald-600/40 bg-emerald-50/50 p-4 dark:bg-emerald-950/20">
      <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
        <Link2 className="size-3.5" aria-hidden />
        Chain of custody (demo)
      </p>
      <ol className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center">
        <li className="rounded-lg bg-white/80 px-3 py-2 font-semibold dark:bg-slate-900/60">
          Allocation · {disbursal.projectId ?? disbursal.id}
        </li>
        <ArrowRight className="hidden size-4 text-muted-foreground sm:block" aria-hidden />
        <li className="rounded-lg bg-white/80 px-3 py-2 font-semibold dark:bg-slate-900/60">
          Disbursed · {proof?.tenderId ?? "—"}
        </li>
        <ArrowRight className="hidden size-4 text-muted-foreground sm:block" aria-hidden />
        <li className="rounded-lg bg-white/80 px-3 py-2 font-semibold dark:bg-slate-900/60">
          Field · {proof?.mediaProofUrls.length ?? 0} photo(s)
        </li>
        {linkedShelter ? (
          <>
            <ArrowRight className="hidden size-4 text-muted-foreground sm:block" aria-hidden />
            <li>
              <Link
                href="/shelters"
                className="rounded-lg bg-emerald-600 px-3 py-2 font-bold text-white hover:bg-emerald-500"
              >
                Shelter · {linkedShelter.name}
              </Link>
            </li>
          </>
        ) : null}
      </ol>
      {proof?.sourceDocumentHash ? (
        <p className="mt-2 font-mono text-[10px] text-muted-foreground">
          Document fingerprint: {proof.sourceDocumentHash}
        </p>
      ) : null}
    </section>
  );
}
