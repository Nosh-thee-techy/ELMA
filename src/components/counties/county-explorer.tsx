"use client";

import { KenyaCountyMap } from "@/components/counties/kenya-county-map";
import type { KenyaCounty } from "@/lib/data/counties";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CountyExplorer({ counties }: { counties: KenyaCounty[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Filter by county or tap a point on the map.
          </p>
        </div>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          County
          <select
            value={selected}
            onChange={(e) => {
              const slug = e.target.value;
              setSelected(slug);
              if (slug) router.push(`/counties/${slug}`);
            }}
            className="h-11 min-w-[14rem] rounded-full border border-border bg-white px-4 font-medium shadow-sm"
          >
            <option value="">Select county…</option>
            {counties.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
                {c.hasDemoData ? "" : " (preview)"}
              </option>
            ))}
          </select>
        </label>
      </div>
      <KenyaCountyMap counties={counties} selectedSlug={selected || undefined} />
      <p className="text-center text-xs text-muted-foreground">
        Purple pins have full demo fund & tender data (Kisumu, Nairobi, Garissa, Kilifi).
      </p>
    </div>
  );
}
