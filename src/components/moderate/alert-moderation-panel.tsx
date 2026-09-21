"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CommunityAlert, VerificationStatus } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AlertModerationPanel({
  alerts,
  modKey,
}: {
  alerts: CommunityAlert[];
  modKey: string;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function moderate(id: string, verification: VerificationStatus) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/alerts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-elma-mod-key": modKey,
        },
        body: JSON.stringify({ verification }),
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } catch {
      setError("Could not update alert. Check moderator key and try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <ul className="flex flex-col gap-3">
        {alerts.map((alert) => (
          <li key={alert.id}>
            <Card className="border-border/80 shadow-sm">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge label={alert.verification} variant={alert.verification} />
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(alert.createdAt)}
                  </span>
                </div>
                <p className="font-heading text-lg">{alert.title}</p>
                <p className="text-sm text-muted-foreground">{alert.body}</p>
                <div className="flex flex-wrap gap-2">
                  {(["verified", "disputed", "rumor", "pending"] as VerificationStatus[]).map(
                    (v) => (
                      <Button
                        key={v}
                        type="button"
                        size="sm"
                        variant={alert.verification === v ? "default" : "outline"}
                        className="min-h-10 capitalize"
                        disabled={busyId === alert.id}
                        onClick={() => moderate(alert.id, v)}
                      >
                        {v}
                      </Button>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
