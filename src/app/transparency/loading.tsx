import {
  PageHeaderSkeleton,
  ProjectListSkeleton,
  StatGridSkeleton,
} from "@/components/feedback/loading-skeletons";

export default function TransparencyLoading() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeaderSkeleton />
      <StatGridSkeleton count={2} />
      <ProjectListSkeleton />
    </div>
  );
}
