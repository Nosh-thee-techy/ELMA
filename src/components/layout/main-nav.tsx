"use client";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

export function MainNav({
  items,
  className,
  onNavigate,
}: {
  items: NavItem[];
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-1 lg:flex-row lg:flex-wrap", className)} aria-label="Main">
      {items.map(({ href, label, shortLabel, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              buttonVariants({
                variant: active ? "secondary" : "ghost",
                size: "lg",
              }),
              "min-h-11 w-full justify-start gap-2 px-3 lg:w-auto lg:min-h-9",
              active && "bg-primary/10 text-primary hover:bg-primary/15",
            )}
          >
            <Icon data-icon="inline-start" />
            <span className="lg:hidden">{shortLabel}</span>
            <span className="hidden lg:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
