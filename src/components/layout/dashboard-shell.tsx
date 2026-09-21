"use client";

import { ElmaLogo } from "@/components/brand/elma-logo";
import { LogoutButton } from "@/components/layout/logout-button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import Link from "next/link";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="elma-header sticky top-0 z-40 border-b border-white/10 px-4 py-3 shadow-md">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <Link href="/dashboard">
            <ElmaLogo variant="light" showWordmark={false} />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle inverted />
            <LogoutButton dark />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-lg px-4 pb-8 text-center text-xs text-muted-foreground">
        <Link href="/" className="font-semibold text-primary hover:underline">
          Public portal
        </Link>
      </footer>
    </div>
  );
}
