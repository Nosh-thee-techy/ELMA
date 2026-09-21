"use client";

import { CountyDataBadge } from "@/components/ui/county-data-badge";
import { buttonVariants } from "@/components/ui/button-variants";
import type { CountyCardSummary } from "@/lib/data/county-finance";
import { cn, formatKes } from "@/lib/utils";
import Link from "next/link";

type Props = {
  counties: CountyCardSummary[];
  selectedSlug?: string;
  onSelect: (slug: string) => void;
};

export function CountyCardGrid({ counties, selectedSlug, onSelect }: Props) {
  if (counties.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
        No counties match your search.
      </p>
    );
  }

  return (
    <ul className="grid max-h-[min(70vh,560px)] gap-3 overflow-y-auto pr-1 sm:grid-cols-1 lg:grid-cols-2">
      {counties.map((c) => {
        const selected = c.slug === selectedSlug;
        return (
          <li key={c.slug}>
            <article
              role="button"
              tabIndex={0}
              onClick={() => onSelect(c.slug)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(c.slug);
                }
              }}
              className={cn(
                "flex h-full cursor-pointer flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm transition",
                selected
                  ? "border-teal-500 ring-2 ring-teal-500/30"
                  : "border-border/80 hover:border-teal-300 hover:shadow-md",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-extrabold text-elma-navy">{c.name}</h3>
                <CountyDataBadge fullData={c.hasDemoData} />
              </div>
              <p className="text-sm text-muted-foreground">
                {c.hasDemoData && c.allocatedKes > 0 ? (
                  <>
                    <span className="font-bold text-emerald-700">{formatKes(c.allocatedKes)}</span>{" "}
                    received (El Niño window, demo)
                  </>
                ) : (
                  "County profile will appear when data is published."
                )}
              </p>
              <Link
                href={`/counties/${c.slug}`}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "mt-auto w-full rounded-xl font-bold",
                )}
              >
                View spending & tenders
              </Link>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
