import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PhoneSimulatorTabs } from "./phone-simulator-tabs";

export default function FeaturePhonePage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">
          Kabambe channel lab
        </p>
        <h1 className="text-balance text-3xl font-extrabold text-elma-navy dark:text-slate-50 sm:text-4xl">
          Feature phone simulator
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          Try ELMA on the channels that still work when mobile data fails: USSD menus and structured
          SMS. Reports and shelter lookups hit the same backend as the web app (demo deployment).
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/safety" className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}>
            Back to Help hub
          </Link>
          <Link
            href="/api/transparency/audit-trail?format=csv"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
          >
            Download audit CSV
          </Link>
        </div>
      </section>

      <PhoneSimulatorTabs />

      <section className="elma-card grid gap-4 p-6 md:grid-cols-2">
        <div>
          <h2 className="font-extrabold text-elma-navy dark:text-slate-50">USSD flow</h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Dial *384*253# (green button)</li>
            <li>1 → emergency type → ward → description</li>
            <li>2 → shelter occupancy by ward</li>
            <li>3 → ward fund disbursal summary</li>
          </ol>
        </div>
        <div>
          <h2 className="font-extrabold text-elma-navy dark:text-slate-50">SMS flow</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Text <span className="font-mono text-foreground">REPORT|category|ward|details</span> to
            shortcode 40101 (simulated). Minimum 10 characters in the message body.
          </p>
        </div>
      </section>
    </div>
  );
}
