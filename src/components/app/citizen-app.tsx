"use client";

import { CitizenNowTab } from "@/components/app/citizen-now-tab";
import { CitizenPhoneShell, type CitizenTab } from "@/components/app/citizen-phone-shell";
import { CitizenReadyTab } from "@/components/app/citizen-ready-tab";
import { CitizenSosTab } from "@/components/app/citizen-sos-tab";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useMemo } from "react";

function CitizenAppInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");
  const activeTab: CitizenTab =
    tabParam === "now" || tabParam === "ready" || tabParam === "sos" ? tabParam : "sos";

  const setTab = useCallback(
    (tab: CitizenTab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`/app?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const topBar = useMemo(
    () => (
      <>
        <Link href="/" className="hover:text-teal-200">
          ← Site
        </Link>
        <span className="text-white/80">ELMA Pocket</span>
      </>
    ),
    [],
  );

  return (
    <CitizenPhoneShell activeTab={activeTab} onTabChange={setTab} topBar={topBar}>
      {activeTab === "sos" ? <CitizenSosTab /> : null}
      {activeTab === "now" ? <CitizenNowTab onGoSos={() => setTab("sos")} /> : null}
      {activeTab === "ready" ? <CitizenReadyTab /> : null}
    </CitizenPhoneShell>
  );
}

export function CitizenApp() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center text-sm text-muted-foreground">
          Loading ELMA Pocket…
        </div>
      }
    >
      <CitizenAppInner />
    </Suspense>
  );
}
