"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CloudOff } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message = "We could not load this section. Check your connection and try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <Alert
      variant="destructive"
      className={cn("rounded-2xl border-destructive/30 bg-destructive/5 py-8", className)}
    >
      <CloudOff className="size-5" />
      <AlertTitle className="font-heading text-lg">{title}</AlertTitle>
      <AlertDescription className="mt-2 text-sm leading-relaxed">{message}</AlertDescription>
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          className="mt-5 min-h-11 border-destructive/30 bg-background hover:bg-accent"
          onClick={onRetry}
        >
          Try again
        </Button>
      ) : null}
    </Alert>
  );
}
