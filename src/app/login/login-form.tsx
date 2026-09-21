"use client";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/counties";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/demo-login", { method: "POST" });
      if (!res.ok) throw new Error("Could not sign in");
      router.push(next);
      router.refresh();
    } catch {
      setError("Sign-in failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 py-8">
      <div className="elma-card p-8">
        <h1 className="text-2xl font-extrabold">Sign in to ELMA</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          PoC uses a demo sign-in — no password. After this you can open the Kenya county map and
          read fund releases, tenders, and help for your area.
        </p>
        <button
          type="button"
          disabled={loading}
          onClick={() => void signIn()}
          className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full rounded-full font-bold")}
        >
          {loading ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
          Continue (demo)
        </button>
        {error ? <p className="mt-3 text-sm font-semibold text-destructive">{error}</p> : null}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-semibold text-primary underline-offset-2 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
