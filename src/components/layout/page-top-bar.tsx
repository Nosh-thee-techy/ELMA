"use client";

import { Input } from "@/components/ui/input";
import { metaForPath } from "@/lib/content/site";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";

export function PageTopBar({ showSearch = true }: { showSearch?: boolean }) {
  const pathname = usePathname();
  const meta = metaForPath(pathname);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        {meta.title}
      </h1>
      {showSearch ? (
        <div className="relative w-full max-w-md lg:hidden">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search wards, projects, alerts…"
            className="h-12 rounded-full border-0 bg-white pl-11 shadow-sm ring-1 ring-black/5"
            aria-label="Search"
          />
        </div>
      ) : null}
    </div>
  );
}
