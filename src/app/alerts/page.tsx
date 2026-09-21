import { AlertsFeed } from "@/components/alerts/alerts-feed";
import { EmptyState } from "@/components/feedback/empty-state";
import { BackToSafety } from "@/components/layout/back-to-safety";
import { PageFrame } from "@/components/layout/page-frame";
import { getCommunityAlerts } from "@/lib/data/repository";

export default async function AlertsPage() {
  const sorted = await getCommunityAlerts();

  return (
    <PageFrame pathname="/alerts">
      <BackToSafety />
      {sorted.length === 0 ? (
        <EmptyState
          icon="radio"
          title="No alerts right now"
          description="Verified ward updates and flagged rumors will appear here as conditions change."
          actionLabel="Check shelters"
          actionHref="/shelters"
        />
      ) : (
        <AlertsFeed alerts={sorted} />
      )}
    </PageFrame>
  );
}
