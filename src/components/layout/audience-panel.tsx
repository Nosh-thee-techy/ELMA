import type { AudienceProfile } from "@/lib/content/site";
import { Users } from "lucide-react";

const rowTints = ["bg-[#eef0ff]", "bg-[#f3eefc]", "bg-[#e8f5e9]", "bg-[#fff4e6]"];

export function AudiencePanel({
  audiences,
  compact = false,
}: {
  audiences: AudienceProfile[];
  compact?: boolean;
}) {
  return (
    <section aria-labelledby="audience-heading" className="flex flex-col gap-3">
      {!compact ? (
        <div className="flex items-center gap-2 px-1">
          <Users className="size-4 text-primary" aria-hidden />
          <h2 id="audience-heading" className="text-sm font-extrabold uppercase tracking-wide">
            Built for
          </h2>
        </div>
      ) : (
        <h2 id="audience-heading" className="sr-only">
          Built for
        </h2>
      )}
      <ul className="flex flex-col gap-2">
        {audiences.map((a, index) => (
          <li
            key={a.id}
            className={`rounded-2xl p-4 sm:p-5 ${rowTints[index % rowTints.length]}`}
          >
            <p className="font-bold text-foreground">{a.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{a.who}</p>
            {!compact ? (
              <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-sm text-foreground">
                {a.elmaHelps}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
