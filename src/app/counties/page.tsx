import { CountyExplorer } from "@/components/counties/county-explorer";
import { FundFlowPipeline } from "@/components/counties/fund-flow-pipeline";
import { KENYA_COUNTIES } from "@/lib/data/counties";
import { buildCountyCardSummaries } from "@/lib/data/county-finance";

export default function CountiesPage() {
  const summaries = buildCountyCardSummaries(KENYA_COUNTIES);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
          County explorer
        </p>
        <h1 className="text-balance text-3xl font-extrabold text-elma-navy sm:text-4xl">
          See releases, spending, and tenders where you live
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
          Use the map or county cards to open a full transparency profile. Green pins and{" "}
          <span className="font-semibold text-emerald-700">Full data</span> counties include demo
          fund and tender detail for this season.
        </p>
      </section>

      <FundFlowPipeline />

      <CountyExplorer summaries={summaries} />
    </div>
  );
}
