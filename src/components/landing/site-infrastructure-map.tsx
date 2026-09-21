import { navGroups } from "@/lib/content/site";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const rowTints = ["bg-[#eef0ff]", "bg-[#f3eefc]", "bg-[#e8f5e9]", "bg-[#fff4e6]"];

export function SiteInfrastructureMap() {
  return (
    <section aria-labelledby="infra-heading" className="elma-card p-6 sm:p-8">
      <h2 id="infra-heading" className="text-xl font-extrabold">
        Site map
      </h2>
      <p className="mt-1 text-sm font-medium text-muted-foreground">
        Same sections as the top navigation — pick a track to explore.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        {navGroups.flatMap((group, groupIndex) =>
          group.items.map((item, itemIndex) => {
            const tint = rowTints[(groupIndex + itemIndex) % rowTints.length];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5 transition hover:opacity-90 ${tint}`}
              >
                <div>
                  <p className="font-bold text-foreground">{item.label}</p>
                  <p className="text-xs font-medium text-muted-foreground">{item.description}</p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <ArrowUpRight className="size-4 text-primary" aria-hidden />
                </span>
              </Link>
            );
          }),
        )}
      </div>
    </section>
  );
}
