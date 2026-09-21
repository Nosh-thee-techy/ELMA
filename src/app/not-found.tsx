import { EmptyState } from "@/components/feedback/empty-state";
export default function NotFound() {
  return (
    <EmptyState
      icon="map"
      title="Page not found"
      description="This route is not part of the ELMA demo. Head home to explore transparency and emergency tools."
      actionLabel="Back to home"
      actionHref="/"
    />
  );
}
