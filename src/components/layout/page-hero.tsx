import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  variant?: "glass" | "navy" | "minimal";
};

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
  variant = "glass",
}: PageHeroProps) {
  if (variant === "minimal") {
    return (
      <section className={cn("flex flex-col gap-2", className)}>
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-700 dark:text-teal-400">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-balance text-3xl text-elma-navy dark:text-slate-50 sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
        {children}
      </section>
    );
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] p-6 sm:p-8",
        variant === "navy"
          ? "bg-gradient-to-br from-elma-navy via-slate-900 to-teal-950 text-white shadow-xl ring-1 ring-white/10"
          : "elma-glass-panel",
        className,
      )}
    >
      {variant === "navy" ? (
        <div
          className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-teal-400/20 blur-3xl"
          aria-hidden
        />
      ) : null}
      <div className="relative flex flex-col gap-3">
        {eyebrow ? (
          <p
            className={cn(
              "text-xs font-bold uppercase tracking-[0.25em]",
              variant === "navy" ? "text-teal-300" : "text-teal-700 dark:text-teal-400",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "font-display text-balance text-3xl leading-tight sm:text-4xl",
            variant === "navy" ? "text-white" : "text-elma-navy dark:text-slate-50",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed",
              variant === "navy" ? "text-white/75" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
