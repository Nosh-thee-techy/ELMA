import { EmptyState } from "@/components/feedback/empty-state";
import { PageFrame } from "@/components/layout/page-frame";
import { AlertModerationPanel } from "@/components/moderate/alert-moderation-panel";
import { getCommunityAlerts } from "@/lib/data/repository";
export default async function ModeratePage({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  const alerts = await getCommunityAlerts();
  const modKey = searchParams.key ?? "";

  const expected = process.env.ELMA_MODERATOR_KEY;
  const allowed =
    !expected || modKey === expected || process.env.NODE_ENV === "development";

  if (!allowed) {
    return (
      <PageFrame pathname="/moderate" showAudience={false}>
        <EmptyState
          icon="shield"
          title="Moderator access required"
          description="Append ?key=YOUR_MODERATOR_KEY to the URL (set ELMA_MODERATOR_KEY in production)."
        />
      </PageFrame>
    );
  }

  return (
    <PageFrame pathname="/moderate">
      <AlertModerationPanel alerts={alerts} modKey={modKey} />
    </PageFrame>
  );
}
