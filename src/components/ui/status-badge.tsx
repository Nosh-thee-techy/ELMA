import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusTone =
  | "complete"
  | "in_progress"
  | "not_started"
  | "delayed"
  | "confirmed"
  | "partial"
  | "not_done"
  | "unverified"
  | "verified"
  | "pending"
  | "disputed"
  | "rumor"
  | "info"
  | "watch"
  | "warning"
  | "critical";

const toneClass: Record<StatusTone, string> = {
  complete: "bg-primary/15 text-primary border-primary/20",
  in_progress: "bg-secondary text-secondary-foreground",
  not_started: "bg-muted text-muted-foreground",
  delayed: "bg-accent text-accent-foreground border-elma-clay/30",
  confirmed: "bg-primary/20 text-primary",
  partial: "bg-accent text-accent-foreground",
  not_done: "bg-destructive/10 text-destructive",
  unverified: "bg-muted text-muted-foreground",
  verified: "bg-primary/15 text-primary",
  pending: "bg-muted text-muted-foreground",
  disputed: "bg-accent text-accent-foreground",
  rumor: "bg-destructive/15 text-destructive border-destructive/20",
  info: "bg-secondary text-secondary-foreground",
  watch: "bg-accent text-accent-foreground",
  warning: "bg-elma-clay/15 text-elma-clay-deep border-elma-clay/25",
  critical: "bg-destructive/15 text-destructive",
};

export function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: StatusTone;
}) {
  return (
    <Badge variant="outline" className={cn("capitalize", toneClass[variant])}>
      {label}
    </Badge>
  );
}
