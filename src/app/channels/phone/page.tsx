import { PageHero } from "@/components/layout/page-hero";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PhoneSimulatorTabs } from "./phone-simulator-tabs";

export default function FeaturePhonePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHero
        variant="glass"
        eyebrow="Kabambe channel lab"
        title="Every channel that still works in a storm"
        description="USSD menus, structured SMS, and Qwen voice chat — same backend as the web app and field dashboard."
      >
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href="/explore" className={cn(buttonVariants({ size: "sm" }), "rounded-full font-bold")}>
            County map
          </Link>
          <Link
            href="/api/transparency/audit-trail?format=csv"
            className={cn(buttonVariants({ size: "sm", variant: "outline" }), "rounded-full font-bold")}
          >
            Audit CSV
          </Link>
        </div>
      </PageHero>

      <PhoneSimulatorTabs />

      <section className="elma-card grid gap-6 p-6 md:grid-cols-2 md:p-8">
        <div>
          <h2 className="font-display text-xl text-elma-navy dark:text-slate-50">USSD flow</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Dial *384*253# (green button on simulator)</li>
            <li>1 → emergency type → ward → description</li>
            <li>2 → shelter occupancy by ward</li>
            <li>3 → ward fund disbursal summary</li>
          </ol>
        </div>
        <div>
          <h2 className="font-display text-xl text-elma-navy dark:text-slate-50">Voice · Qwen</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Open the <span className="font-semibold text-foreground">Voice · Qwen</span> tab to speak
            or type about shelters, funds, and policy. Replies can be read aloud — production IVR would
            use the same API over a phone line.
          </p>
        </div>
      </section>
    </div>
  );
}
