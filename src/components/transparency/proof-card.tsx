import type { FundDisbursal, ProjectProof } from "@/lib/types";
import { formatKes } from "@/lib/utils";
import { ExternalLink, FileCheck, MapPin } from "lucide-react";
import Image from "next/image";

type Props = {
  disbursal: FundDisbursal;
  proof?: ProjectProof;
};

export function ProofCard({ disbursal, proof }: Props) {
  const disbursedPct =
    disbursal.totalAllocatedKes > 0
      ? Math.round((disbursal.totalDisbursedKes / disbursal.totalAllocatedKes) * 100)
      : 0;

  return (
    <article className="elma-card flex flex-col gap-5 p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-teal-700 dark:text-teal-400">
            {disbursal.county} · {disbursal.ward}
          </p>
          <h3 className="mt-1 text-xl font-extrabold text-elma-navy dark:text-slate-50">
            {disbursal.title}
          </h3>
          <p className="mt-1 text-sm capitalize text-muted-foreground">
            {disbursal.category.replace(/_/g, " ")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase text-muted-foreground">Disbursed</p>
          <p className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
            {formatKes(disbursal.totalDisbursedKes)}
          </p>
          <p className="text-xs text-muted-foreground">
            of {formatKes(disbursal.totalAllocatedKes)} ({disbursedPct}%)
          </p>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-emerald-600"
          style={{ width: `${disbursedPct}%` }}
        />
      </div>

      {proof ? (
        <section className="rounded-2xl border border-border/80 bg-slate-50 p-4 dark:bg-slate-900/50">
          <p className="flex items-center gap-2 text-sm font-extrabold text-elma-navy dark:text-slate-100">
            <FileCheck className="size-4 text-emerald-600" aria-hidden />
            Evidence & citations
          </p>
          <dl className="mt-3 grid gap-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Contractor</dt>
              <dd className="font-semibold">{proof.contractorName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Tender ID</dt>
              <dd className="font-mono text-xs font-semibold">{proof.tenderId}</dd>
            </div>
          </dl>
          <ul className="mt-3 flex flex-wrap gap-2">
            {proof.gazetteNoticeUrl ? (
              <li>
                <a
                  href={proof.gazetteNoticeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-primary ring-1 ring-border dark:bg-slate-800"
                >
                  Gazette / tender notice
                  <ExternalLink className="size-3" />
                </a>
              </li>
            ) : null}
            {proof.bankReceiptUrl ? (
              <li>
                <a
                  href={proof.bankReceiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-primary ring-1 ring-border dark:bg-slate-800"
                >
                  Bank receipt
                  <ExternalLink className="size-3" />
                </a>
              </li>
            ) : null}
          </ul>
          {proof.mediaProofUrls.length > 0 ? (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {proof.mediaProofUrls.map((url) => (
                <li key={url} className="overflow-hidden rounded-xl ring-1 ring-border">
                  <div className="relative aspect-video bg-muted">
                    <Image src={url} alt={proof.caption ?? "Field proof"} fill className="object-cover" unoptimized />
                  </div>
                  {proof.caption ? (
                    <p className="flex items-start gap-1 p-2 text-xs text-muted-foreground">
                      {proof.lat != null ? <MapPin className="mt-0.5 size-3 shrink-0" /> : null}
                      {proof.caption}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
          {proof.verifiedAt ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Verified {new Date(proof.verifiedAt).toLocaleDateString()} · {proof.verifiedBy}
            </p>
          ) : null}
        </section>
      ) : null}
    </article>
  );
}
