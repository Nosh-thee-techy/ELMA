import { KenyaVaultExplorer } from "@/components/explore/kenya-vault-explorer";
import { KENYA_COUNTIES } from "@/lib/data/counties";
import { buildCountyCardSummaries, getCountyPortalData } from "@/lib/data/county-finance";

export default async function ExplorePage() {
  const summaries = buildCountyCardSummaries(KENYA_COUNTIES);
  const demoSlugs = summaries.filter((s) => s.hasDemoData).map((s) => s.slug);
  const entries = await Promise.all(
    demoSlugs.map(async (slug) => [slug, await getCountyPortalData(slug)] as const),
  );
  const portalBySlug = Object.fromEntries(entries) as Record<
    string,
    Awaited<ReturnType<typeof getCountyPortalData>>
  >;

  return <KenyaVaultExplorer summaries={summaries} portalBySlug={portalBySlug} />;
}
