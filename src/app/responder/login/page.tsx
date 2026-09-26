"use client";

import { PageHero } from "@/components/layout/page-hero";
import { buttonVariants } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2, Phone, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function normalizeDemoPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length >= 12) return `+${digits}`;
  if (digits.startsWith("0") && digits.length >= 10) return `+254${digits.slice(1)}`;
  if (digits.length >= 9) return `+254${digits}`;
  return raw.trim();
}

function ResponderLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [role, setRole] = useState<"RESPONDER" | "ADMIN" | "VERIFIER">("RESPONDER");
  const [phone, setPhone] = useState("0712 345 678");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    setError(null);
    const normalized = normalizeDemoPhone(phone);
    if (normalized.replace(/\D/g, "").length < 9) {
      setError("Enter a valid Kenyan mobile number (demo — no SMS sent).");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/responder-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, phone: normalized }),
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
    <div className="elma-page-bg flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <PageHero
          variant="navy"
          eyebrow="Staff · website only"
          title="Operational dashboard"
          description="Mock sign-in with a phone number — same session cookies as the demo roles. Citizens use ELMA Pocket (/app), not this flow."
          className="text-center sm:text-left"
        />

        <div className="elma-glass-panel p-6 sm:p-8">
          <p className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
            <Phone className="size-4" aria-hidden />
            Phone number (demo)
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <Label htmlFor="staff-phone" className="sr-only">
              Phone number
            </Label>
            <Input
              id="staff-phone"
              inputMode="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="min-h-12 rounded-xl font-mono text-base"
              placeholder="07xx xxx xxx"
            />
            <p className="text-xs text-muted-foreground">No OTP — any valid-format number works for the hackathon demo.</p>
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
            <Shield className="size-4" aria-hidden />
            Choose a demo role
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {(["RESPONDER", "ADMIN", "VERIFIER"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "rounded-xl px-2 py-2.5 text-[10px] font-bold uppercase tracking-wide sm:text-xs",
                  role === r
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                    : "bg-muted text-muted-foreground",
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
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold",
            )}
          >
            {loading ? <Loader2 className="animate-spin" data-icon="inline-start" /> : null}
            Enter dashboard
          </button>
          {error ? <p className="mt-3 text-sm font-semibold text-destructive">{error}</p> : null}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/" className="font-semibold text-primary underline-offset-2 hover:underline">
              Back to public site
            </Link>
            {" · "}
            <Link href="/app" className="font-semibold text-primary underline-offset-2 hover:underline">
              Citizen SOS app
            </Link>
          </p>
        </div>
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
