import { PageHeaderSkeleton, StatGridSkeleton } from "@/components/feedback/loading-skeletons";

export default function SheltersLoading() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeaderSkeleton />
      <StatGridSkeleton count={3} />
    </div>
  );
}
