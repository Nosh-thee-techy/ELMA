import { CountyPortalView } from "@/components/counties/county-portal-view";
import { countyBySlug } from "@/lib/data/counties";
import { getCountyPortalData } from "@/lib/data/county-finance";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

export default async function CountyPage({ params }: Props) {
  const county = countyBySlug(params.slug);
  if (!county) notFound();

  const data = await getCountyPortalData(params.slug);
  if (!data) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">
            County transparency
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">{data.countyName}</h1>
        </div>
        <Link
          href="/counties"
          className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
        >
          ← Change county
        </Link>
      </div>
      <CountyPortalView data={data} />
    </div>
  );
}
