"use client";

import { ElmaLogo } from "@/components/brand/elma-logo";
import { LogoutButton } from "@/components/layout/logout-button";
import { SiteNav } from "@/components/layout/site-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { SessionProfile } from "@/lib/auth/session";
import { dashboardFooterLinks, resolveAppNavGroups, roleNavLabel } from "@/lib/content/nav-by-role";
import { cn } from "@/lib/utils";
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
    <div className="elma-page-bg min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 pb-10 pt-4 sm:px-6">
        <header className="elma-header mb-6 overflow-hidden rounded-[1.75rem] shadow-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
            <Link href="/dashboard" className="shrink-0">
              <ElmaLogo variant="light" showWordmark={false} />
            </Link>
            <div className="flex min-w-0 items-center gap-2">
              {profile ? (
                <span className="hidden max-w-[10rem] truncate rounded-full bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-100 ring-1 ring-emerald-400/25 sm:inline">
                  {roleNavLabel(profile)}
                </span>
              ) : null}
              <ThemeToggle inverted />
              <LogoutButton dark />
            </div>
          </div>
          <div className="border-t border-white/10 px-2 pb-2 pt-1">
            <SiteNav
              dark
              orientation="horizontal"
              groups={navGroups}
              className="justify-start px-1"
            />
          </div>
        </header>

        <main className={cn("flex flex-1 flex-col gap-6")}>{children}</main>

        <footer className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-semibold text-primary transition-colors hover:text-teal-600 dark:hover:text-teal-400"
            >
              {link.label}
            </Link>
          ))}
        </footer>
      </div>
    </div>
  );
}
