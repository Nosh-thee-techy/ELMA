"use client";

import { ElmaVoiceChat } from "@/components/ai/elma-voice-chat";
import { FeaturePhone } from "@/components/channels/feature-phone";
import { cn } from "@/lib/utils";
import { useState } from "react";

const tabs = [
  { id: "ussd" as const, label: "USSD *384*253#" },
  { id: "sms" as const, label: "SMS 40101" },
  { id: "voice" as const, label: "Voice · Qwen" },
];

export function PhoneSimulatorTabs() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("ussd");

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex max-w-full flex-wrap justify-center rounded-full bg-muted p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide sm:px-6 sm:text-sm",
              tab === t.id ? "bg-elma-navy text-white shadow" : "text-muted-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "voice" ? (
        <ElmaVoiceChat />
      ) : (
        <FeaturePhone key={tab} mode={tab} />
      )}
    </div>
  );
}
