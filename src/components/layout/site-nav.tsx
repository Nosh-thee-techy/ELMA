"use client";

import { navGroups, type NavLink } from "@/lib/content/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavItem({
  item,
  onNavigate,
  dark,
  horizontal,
}: {
  item: NavLink;
  onNavigate?: () => void;
  dark?: boolean;
  horizontal?: boolean;
}) {
  const pathname = usePathname();
  const active =
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={item.description}
      className={cn(
        "flex shrink-0 items-center gap-2 font-semibold transition-colors",
        horizontal ? "rounded-full px-3 py-2 text-sm" : "rounded-full px-4 py-2.5 text-sm",
        dark
          ? active
            ? "bg-white text-elma-sidebar shadow-sm"
            : "text-white/90 hover:bg-white/10"
          : active
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-muted",
      )}
    >
      <item.icon className="size-4 shrink-0" aria-hidden />
      <span>{item.label}</span>
    </Link>
  );
}

export function SiteNav({
  onNavigate,
  className,
  dark = false,
  orientation = "vertical",
}: {
  onNavigate?: () => void;
  className?: string;
  dark?: boolean;
  orientation?: "vertical" | "horizontal";
}) {
  if (orientation === "horizontal") {
    return (
      <nav
        className={cn(
          "flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          className,
        )}
        aria-label="Main navigation"
      >
        {navGroups.map((group, groupIndex) => (
          <div key={group.id} className="flex shrink-0 items-center gap-0.5">
            {groupIndex > 0 ? (
              <span
                className={cn(
                  "mx-1 hidden h-5 w-px shrink-0 lg:block",
                  dark ? "bg-white/25" : "bg-border",
                )}
                aria-hidden
              />
            ) : null}
            {group.items.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                onNavigate={onNavigate}
                dark={dark}
                horizontal
              />
            ))}
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav className={cn("flex flex-col gap-6", className)} aria-label="Site sections">
      {navGroups.map((group) => (
        <div key={group.id} className="flex flex-col gap-1.5">
          <p
            className={cn(
              "px-4 text-[10px] font-bold uppercase tracking-[0.2em]",
              dark ? "text-white/45" : "text-muted-foreground",
            )}
          >
            {group.title}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <NavItem key={item.href} item={item} onNavigate={onNavigate} dark={dark} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
