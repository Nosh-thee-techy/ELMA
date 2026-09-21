"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({ dark }: { dark?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      disabled={loading}
      className={cn(
        "h-9 rounded-full px-4 text-sm font-semibold",
        dark && "border-white/25 bg-transparent text-white hover:bg-white/10",
      )}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/auth/demo-logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
    >
      Log out
    </Button>
  );
}
