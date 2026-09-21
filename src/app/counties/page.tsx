import { CountyExplorer } from "@/components/counties/county-explorer";
import { KENYA_COUNTIES } from "@/lib/data/counties";
import Link from "next/link";

export default function CountiesPage() {
  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-2xl text-sm font-medium text-muted-foreground">
        Pick where you live or work. Each county page shows{" "}
        <span className="text-foreground">releases → spending → tenders</span>, plus what you can
        use for help during El Niño, floods, or drought.
      </p>
      <CountyExplorer counties={KENYA_COUNTIES} />
      <p className="text-sm text-muted-foreground">
        Need the old ward list?{" "}
        <Link href="/transparency" className="font-semibold text-primary underline-offset-2 hover:underline">
          Browse all assignments
        </Link>
      </p>
    </div>
  );
}
