"use client";

import { ElmaLogo } from "@/components/brand/elma-logo";
import { LogoutButton } from "@/components/layout/logout-button";
import { SiteNav } from "@/components/layout/site-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { SessionProfile } from "@/lib/auth/session";
import { dashboardFooterLinks, resolveAppNavGroups, roleNavLabel } from "@/lib/content/nav-by-role";
import Link from "next/link";
import { useMemo } from "react";

export function DashboardShell({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: SessionProfile | null;
}) {
  const navGroups = useMemo(() => resolveAppNavGroups(profile), [profile]);
  const footerLinks = profile ? dashboardFooterLinks() : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="elma-header sticky top-0 z-40 flex flex-col gap-2 border-b border-white/10 px-4 py-3 shadow-md">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3">
          <Link href="/dashboard">
            <ElmaLogo variant="light" showWordmark={false} />
          </Link>
          <div className="flex items-center gap-2">
            {profile ? (
              <span className="max-w-[8rem] truncate rounded-full bg-white/15 px-2 py-1 text-[10px] font-bold text-white sm:max-w-none sm:px-3 sm:text-xs">
                {roleNavLabel(profile)}
              </span>
            ) : null}
            <ThemeToggle inverted />
            <LogoutButton dark />
          </div>
        </div>
        <SiteNav
          dark
          orientation="horizontal"
          groups={navGroups}
          className="mx-auto w-full max-w-lg pb-1"
        />
      </header>
      <main className="mx-auto max-w-lg px-4 py-6">{children}</main>
      <footer className="mx-auto flex max-w-lg flex-wrap justify-center gap-x-4 gap-y-2 px-4 pb-8 text-center text-xs text-muted-foreground">
        {footerLinks.map((link) => (
          <Link key={link.href} href={link.href} className="font-semibold text-primary hover:underline">
            {link.label}
          </Link>
        ))}
      </footer>
    </div>
  );
}
