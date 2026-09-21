import { AlertFeedSkeleton, PageHeaderSkeleton } from "@/components/feedback/loading-skeletons";

export default function AlertsLoading() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeaderSkeleton />
      <AlertFeedSkeleton />
    </div>
  );
}
