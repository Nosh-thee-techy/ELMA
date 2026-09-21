"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ inverted }: { inverted?: boolean }) {
  const { theme, toggle } = useTheme();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      className={cn(
        "rounded-full",
        inverted
          ? "border-white/25 bg-white/10 text-white hover:bg-white/20"
          : "border-border bg-card",
      )}
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
