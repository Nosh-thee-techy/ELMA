import { IphoneShell } from "@/components/app/iphone-shell";
import { buttonVariants } from "@/components/ui/button-variants";
import { getServerSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function FieldAppPage() {
  const { active, profile } = getServerSession();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 py-4">
      <section className="flex flex-col gap-3 text-center sm:text-left">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">
          Not on the public website
        </p>
        <h1 className="text-balance text-3xl font-extrabold text-elma-navy dark:text-slate-50">
          ELMA field app
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Shelter triage, reports, and alerts live here — on a phone, not scattered across the main
          site. Sign in to use the live dashboard inside your ward scope.
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
          {active && profile ? (
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full font-bold")}
            >
              Open live dashboard
            </Link>
          ) : (
            <Link
              href="/responder/login?next=/dashboard"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full font-bold")}
            >
              Staff sign in
            </Link>
          )}
          <Link
            href="/explore"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "rounded-full font-bold")}
          >
            Back to public map
          </Link>
        </div>
      </section>

      <div className="grid items-start gap-10 lg:grid-cols-2">
        <IphoneShell label="Operations">
          <div className="flex flex-col gap-3 p-4">
            <p className="text-sm font-extrabold">Shelter triage</p>
            <p className="text-xs text-muted-foreground">
              ±10 occupancy, set full, urgent needs — built for thumb and bad networks.
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
            <p className="text-sm font-extrabold">USSD · SMS · alerts</p>
            <p className="text-xs text-muted-foreground">
              The public site keeps policy and the Kenya map. Reporting and ops stay in the app.
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link href="/channels/phone" className="font-bold text-primary underline-offset-2 hover:underline">
                  Try USSD *384*253#
                </Link>{" "}
                (also on web for demo)
              </li>
              <li>
                <Link href="/policy" className="font-bold text-primary underline-offset-2 hover:underline">
                  Read relief policy
                </Link>
              </li>
            </ul>
          </div>
        </IphoneShell>
      </div>
    </div>
  );
}
