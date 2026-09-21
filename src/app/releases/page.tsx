import { FundFlowPipeline } from "@/components/counties/fund-flow-pipeline";
import { CountyDataBadge } from "@/components/ui/county-data-badge";
import { buttonVariants } from "@/components/ui/button-variants";
import { KENYA_COUNTIES } from "@/lib/data/counties";
import { buildCountyCardSummaries } from "@/lib/data/county-finance";
import { cn, formatKes } from "@/lib/utils";
import Link from "next/link";

export default function ReleasesPage() {
  const summaries = buildCountyCardSummaries(KENYA_COUNTIES).filter((c) => c.hasDemoData);

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">Fund releases</p>
        <h1 className="mt-2 text-3xl font-extrabold text-elma-navy">What reached each county</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Treasury and programme releases published for the OND El Niño window (demo figures). Open a
          county for spending breakdown and tenders.
        </p>
      </section>
      <FundFlowPipeline compact />
      <ul className="grid gap-4 sm:grid-cols-2">
        {summaries.map((c) => (
          <li key={c.slug} className="elma-card flex flex-col gap-3 p-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-extrabold text-elma-navy">{c.name}</h2>
              <CountyDataBadge fullData />
            </div>
            <p className="text-2xl font-extrabold text-emerald-700">{formatKes(c.allocatedKes)}</p>
            <p className="text-sm text-muted-foreground">County received (demo)</p>
            <Link
              href={`/counties/${c.slug}`}
              className={cn(buttonVariants({ size: "sm" }), "mt-auto w-fit rounded-xl font-bold")}
            >
              View spending & tenders
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
