import { FormSkeleton, PageHeaderSkeleton } from "@/components/feedback/loading-skeletons";

export default function PolicyLoading() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeaderSkeleton />
      <FormSkeleton />
    </div>
  );
}
