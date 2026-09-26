import { cn } from "@/lib/utils";
import { Activity, MapPin, Users } from "lucide-react";

export function DashboardHero({
  eyebrow,
  title,
  description,
  stats,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  stats?: { label: string; value: string; icon?: "users" | "activity" | "map" }[];
  className?: string;
}) {
  const icons = { users: Users, activity: Activity, map: MapPin };

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-elma-navy via-slate-900 to-teal-950 p-6 text-white shadow-xl ring-1 ring-white/10 sm:p-8",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-teal-400/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 left-1/4 size-48 rounded-full bg-emerald-500/15 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">{eyebrow}</p>
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">{title}</h1>
        <p className="max-w-md text-sm leading-relaxed text-white/70">{description}</p>
        {stats && stats.length > 0 ? (
          <div className="mt-2 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
            {stats.map((s) => {
              const Icon = s.icon ? icons[s.icon] : Activity;
              return (
                <div
                  key={s.label}
                  className="rounded-xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10 backdrop-blur-sm"
                >
                  <Icon className="mb-1 size-4 text-teal-300" aria-hidden />
                  <p className="text-lg font-extrabold tabular-nums">{s.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-white/50">
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
