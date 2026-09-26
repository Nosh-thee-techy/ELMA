import { IphoneShell } from "@/components/app/iphone-shell";
import { PageHero } from "@/components/layout/page-hero";
import { buttonVariants } from "@/components/ui/button-variants";
import { getServerSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function FieldAppPage() {
  const { active, profile } = getServerSession();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 py-2">
      <PageHero
        variant="navy"
        eyebrow="Field operations"
        title="ELMA on your phone"
        description="Shelter triage, reports, and alerts — scoped to your ward. The public website stays for transparency; this is where responders work."
      >
        <div className="mt-2 flex flex-wrap gap-3">
          {active && profile ? (
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-emerald-500 font-bold hover:bg-emerald-400",
              )}
            >
              Open live dashboard
            </Link>
          ) : (
            <Link
              href="/responder/login?next=/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-emerald-500 font-bold hover:bg-emerald-400",
              )}
            >
              Staff sign in
            </Link>
          )}
          <Link
            href="/explore"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "rounded-full border-white/25 bg-white/10 font-bold text-white hover:bg-white/20",
            )}
          >
            Public map
          </Link>
        </div>
      </PageHero>

      <div className="grid items-start gap-10 lg:grid-cols-2">
        <IphoneShell label="Operations">
          <div className="flex flex-col gap-3 p-4">
            <p className="text-sm font-extrabold">Shelter triage</p>
            <p className="text-xs text-muted-foreground">
              ±10 occupancy, capacity bar, urgent needs — thumb-first for bad networks.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {["−10", "47", "+10"].map((t) => (
                <div
                  key={t}
                  className="flex min-h-12 items-center justify-center rounded-xl bg-muted text-lg font-extrabold"
                >
                  {t}
                </div>
              ))}
            </div>
            <Link
              href={active ? "/dashboard" : "/responder/login?next=/dashboard"}
              className={cn(buttonVariants(), "mt-2 rounded-xl font-bold")}
            >
              {active ? "Continue in app" : "Sign in to update"}
            </Link>
          </div>
        </IphoneShell>

        <IphoneShell label="Channels">
          <div className="flex flex-col gap-3 p-4">
            <p className="text-sm font-extrabold">USSD · SMS · Qwen voice</p>
            <p className="text-xs text-muted-foreground">
              Citizens use the public channels lab; responders sync the same backend here.
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link
                  href="/channels/phone"
                  className="font-bold text-primary underline-offset-2 hover:underline"
                >
                  Try USSD *384*253#
                </Link>
              </li>
              <li>
                <Link href="/policy" className="font-bold text-primary underline-offset-2 hover:underline">
                  Policy plain language
                </Link>
              </li>
            </ul>
          </div>
        </IphoneShell>
      </div>
    </div>
  );
}
