"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PublicCountySearch({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        const query = q.trim();
        router.push(query ? `/counties?q=${encodeURIComponent(query)}` : "/counties");
      }}
    >
      <div className="relative w-full min-w-[10rem] lg:w-52">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-white/50"
          aria-hidden
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search county…"
          className="h-10 rounded-full border-0 bg-white/15 pl-9 text-sm text-white placeholder:text-white/50 focus-visible:bg-white/20 focus-visible:ring-white/30"
          aria-label="Search county"
        />
      </div>
    </form>
  );
}
