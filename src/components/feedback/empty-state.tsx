import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import {
  FolderOpen,
  Home,
  Inbox,
  MapPinOff,
  Radio,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const emptyStateIcons = {
  folder: FolderOpen,
  home: Home,
  inbox: Inbox,
  map: MapPinOff,
  radio: Radio,
  shield: ShieldCheck,
} as const satisfies Record<string, LucideIcon>;

export type EmptyStateIcon = keyof typeof emptyStateIcons;

type EmptyStateProps = {
  icon: EmptyStateIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  const Icon = emptyStateIcons[icon];

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center",
        className,
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-accent text-primary">
        <Icon className="size-7" aria-hidden />
      </div>
      <h3 className="mt-5 font-heading text-xl">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className={cn(buttonVariants({ size: "lg" }), "mt-6 min-h-11 px-6")}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
