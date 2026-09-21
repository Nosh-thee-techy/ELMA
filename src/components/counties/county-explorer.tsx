"use client";

import { CountyCardGrid } from "@/components/counties/county-card-grid";
import { KenyaCountyMap } from "@/components/counties/kenya-county-map";
import type { CountyCardSummary } from "@/lib/data/county-finance";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export function CountyExplorer({ summaries }: { summaries: CountyCardSummary[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return summaries;
    return summaries.filter((c) => c.name.toLowerCase().includes(q));
  }, [summaries, query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative max-w-xl">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search counties…"
          className="h-12 rounded-xl border-border bg-white pl-11 shadow-sm"
          aria-label="Search counties"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        <KenyaCountyMap
          counties={filtered}
          selectedSlug={selectedSlug}
          onSelect={setSelectedSlug}
        />
        <CountyCardGrid
          counties={filtered}
          selectedSlug={selectedSlug}
          onSelect={setSelectedSlug}
        />
      </div>
    </div>
  );
}
