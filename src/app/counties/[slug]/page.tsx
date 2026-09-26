import { CountyPortalView } from "@/components/counties/county-portal-view";
import { PageHero } from "@/components/layout/page-hero";
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
    <div className="flex flex-col gap-8">
      <PageHero
        variant="minimal"
        eyebrow="County transparency profile"
        title={data.countyName}
        description="Fund releases, ward projects, and contractor lines for this county — linked from the national explore map."
      >
        <Link
          href="/explore"
          className="mt-1 inline-block text-sm font-bold text-primary underline-offset-2 hover:underline"
        >
          ← Back to Kenya map
        </Link>
      </PageHero>
      <CountyPortalView data={data} />
    </div>
  );
}
