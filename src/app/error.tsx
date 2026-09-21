"use client";

import { ErrorState } from "@/components/feedback/error-state";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const detail =
    process.env.NODE_ENV === "development"
      ? error.message || error.digest
      : undefined;

  return (
    <div className="py-12">
      <ErrorState
        title="ELMA hit a snag"
        message={
          detail
            ? `${detail}. Try again, or refresh the page.`
            : "This page failed to render. Your connection may be unstable, or we need to fix a bug."
        }
        onRetry={reset}
      />
    </div>
  );
}
