import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-9 w-full max-w-md" />
      <Skeleton className="h-4 w-full max-w-xl" />
    </div>
  );
}

export function StatGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-border/80 bg-card shadow-sm">
          <CardContent className="flex flex-col gap-2 p-5 pt-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-3 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ProjectListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <ul className="flex flex-col gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i}>
          <Card className="border-border/80 bg-card shadow-sm">
            <CardHeader className="gap-2 pb-2">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-6 w-4/5 max-w-lg" />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export function AlertFeedSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <ul className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i}>
          <Card className={cn("border-border/80 bg-card shadow-sm")}>
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export function FormSkeleton() {
  return (
    <Card className="border-border/80 bg-card shadow-sm">
      <CardContent className="flex flex-col gap-4 p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        ))}
        <Skeleton className="mt-2 h-12 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}
