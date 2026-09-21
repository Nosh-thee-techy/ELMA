"use client";

import { MotionAlertCard } from "@/components/motion/motion-alert-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { sourceLabel } from "@/lib/data/source-catalog";
import type { CommunityAlert } from "@/lib/types";
import { cn, formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

export function AlertsFeed({ alerts }: { alerts: CommunityAlert[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {alerts.map((alert, index) => (
        <li key={alert.id}>
          <MotionAlertCard
            index={index}
            pulse={alert.verification === "rumor" && index === 0}
            className={cn(
              alert.verification === "rumor" &&
                "rounded-xl ring-1 ring-destructive/20 motion-safe:animate-[pulse_3s_ease-in-out_infinite]",
            )}
          >
            <Card
              className={cn(
                "border-border/80 shadow-sm",
                alert.verification === "rumor" && "border-destructive/25 bg-destructive/[0.03]",
              )}
            >
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge label={alert.severity} variant={alert.severity} />
                  <StatusBadge label={alert.verification} variant={alert.verification} />
                  {alert.riskLevel ? (
                    <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">
                      {alert.riskLevel}
                    </span>
                  ) : null}
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(alert.createdAt)}
                  </span>
                </div>
                {alert.alertId ? (
                  <p className="text-xs font-semibold text-muted-foreground">{alert.alertId}</p>
                ) : null}
                <h2 className="font-heading text-lg leading-snug">{alert.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{alert.body}</p>
                <p className="text-xs text-muted-foreground">
                  {alert.ward}, {alert.county}
                  {alert.source ? ` · ${alert.source}` : null}
                  {alert.dataSource ? ` · ${sourceLabel(alert.dataSource)}` : null}
                </p>
                {alert.evacuationCenters && alert.evacuationCenters.length > 0 ? (
                  <ul className="rounded-xl bg-[#eef0ff] px-3 py-2 text-sm">
                    {alert.evacuationCenters.map((center) => (
                      <li key={`${center.name}-${center.lat}`}>
                        <span className="font-semibold">{center.name}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          · capacity {center.capacity}
                          {center.hotline ? ` · hotline ${center.hotline}` : ""}
                        </span>
                        {center.shelterId ? (
                          <>
                            {" "}
                            <Link href="/shelters" className="font-semibold text-primary">
                              View shelters
                            </Link>
                          </>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </CardContent>
            </Card>
          </MotionAlertCard>
        </li>
      ))}
    </ul>
  );
}
