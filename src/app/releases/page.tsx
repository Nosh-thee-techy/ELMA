import { FundFlowPipeline } from "@/components/counties/fund-flow-pipeline";
import { PageHero } from "@/components/layout/page-hero";
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
      <PageHero
        variant="minimal"
        eyebrow="Fund releases"
        title="What reached each county"
        description="Treasury and programme releases for the OND El Niño window (demo). Open the map for the full story per county."
      />
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
