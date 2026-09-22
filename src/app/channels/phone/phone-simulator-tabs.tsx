"use client";

import { FeaturePhone } from "@/components/channels/feature-phone";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function PhoneSimulatorTabs() {
  const [tab, setTab] = useState<"ussd" | "sms">("ussd");

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex rounded-full bg-muted p-1">
        {(["ussd", "sms"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wide",
              tab === t ? "bg-elma-navy text-white shadow" : "text-muted-foreground",
            )}
          >
            {t === "ussd" ? "USSD *384*253#" : "SMS 40101"}
          </button>
        ))}
      </div>
      <FeaturePhone key={tab} mode={tab} />
    </div>
  );
}
