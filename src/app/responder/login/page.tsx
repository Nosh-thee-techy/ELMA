"use client";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import { Loader2, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResponderLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [role, setRole] = useState<"RESPONDER" | "ADMIN" | "VERIFIER">("RESPONDER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/responder-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
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
        <p className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
          <Shield className="size-4" aria-hidden />
          First responder access
        </p>
        <h1 className="mt-2 text-2xl font-extrabold">Operational dashboard</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Demo login for ward responders and county admins. Update shelter capacity, log urgent
          needs, and upload field photos.
        </p>
        <div className="mt-4 flex gap-2">
          {(["RESPONDER", "ADMIN", "VERIFIER"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={cn(
                "flex-1 rounded-xl px-2 py-2 text-[10px] font-bold uppercase tracking-wide sm:text-xs",
                role === r ? "bg-emerald-600 text-white" : "bg-muted text-muted-foreground",
              )}
            >
              {r === "RESPONDER" ? "Responder" : r === "ADMIN" ? "Admin" : "Verifier"}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => void signIn()}
          className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full rounded-xl font-bold")}
        >
          {loading ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
          Enter dashboard
        </button>
        {error ? <p className="mt-3 text-sm font-semibold text-destructive">{error}</p> : null}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="font-semibold text-primary underline-offset-2 hover:underline">
            Back to public portal
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResponderLoginPage() {
  return (
    <Suspense fallback={<p className="py-12 text-center text-muted-foreground">Loading…</p>}>
      <ResponderLoginForm />
    </Suspense>
  );
}
