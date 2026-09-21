import { AudiencePanel } from "@/components/layout/audience-panel";
import { StatCard } from "@/components/layout/stat-card";
import { SiteInfrastructureMap } from "@/components/landing/site-infrastructure-map";
import { VisionTeaser } from "@/components/landing/vision-teaser";
import { buttonVariants } from "@/components/ui/button-variants";
import { targetAudiences } from "@/lib/content/site";
import { getMitigationProjects } from "@/lib/data/repository";
import { cn, formatKes } from "@/lib/utils";
import { AlertTriangle, ArrowRight, Shield } from "lucide-react";
import Link from "next/link";

export async function LandingPage() {
  const mitigationProjects = await getMitigationProjects();
  const mismatches = mitigationProjects.filter(
    (p) => p.paperStatus === "complete" && p.fieldStatus !== "confirmed",
  ).length;
  const totalBudget = mitigationProjects.reduce((s, p) => s + p.budgetKes, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="elma-card flex flex-col gap-4 p-6 sm:p-8 lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">
            OND El Niño · Kenya
          </p>
          <h2 className="text-balance text-2xl leading-tight sm:text-3xl">
            See county flood work before the rains. Stay safe when they hit.
          </h2>
          <p className="max-w-xl text-sm font-medium leading-relaxed text-muted-foreground">
            Part 1: see what your ward was allocated and how resources are moving. Part 2: report
            and get help via web, USSD, SMS, voice, or WhatsApp when floods hit.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              href="/transparency"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-primary px-6 font-bold text-primary-foreground hover:bg-primary/90",
              )}
            >
              Track 2 · Mitigation
              <ArrowRight data-icon="inline-end" />
            </Link>
            <Link
              href="/emergency"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-destructive px-6 font-bold text-white hover:bg-destructive/90",
              )}
            >
              Track 3 · Report
              <AlertTriangle data-icon="inline-end" />
            </Link>
          </div>
        </section>

        <div className="flex flex-col gap-5">
          <StatCard
            label="Demo ward budget"
            value={formatKes(totalBudget)}
            hint={`${mitigationProjects.length} Kisumu projects`}
            icon={Shield}
          />
          <StatCard
            label="Accountability flags"
            value={String(mismatches)}
            hint="paper complete · field not confirmed"
            tone="alert"
            icon={AlertTriangle}
          />
        </div>
      </div>

      <VisionTeaser />

      <div className="grid gap-5 md:grid-cols-2">
        <section className="elma-card bg-[#eef0ff] p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Track 2</p>
          <p className="mt-2 font-bold text-foreground">Before floods</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <li>Mitigation projects — budgets, contractors, field checks</li>
            <li>Policy in plain language</li>
          </ul>
        </section>
        <section className="elma-card bg-[#ffeef0] p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-destructive">Track 3</p>
          <p className="mt-2 font-bold text-foreground">During floods</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <li>Emergency reports (web + USSD stub)</li>
            <li>Verified alerts vs rumors · shelter capacity</li>
          </ul>
        </section>
      </div>

      <SiteInfrastructureMap />

      <section className="elma-card p-6 sm:p-8">
        <h2 className="text-xl font-extrabold">Who we build for</h2>
        <div className="mt-5">
          <AudiencePanel audiences={targetAudiences} compact />
        </div>
      </section>

      <section className="elma-sidebar elma-card border-0 p-6 text-white sm:p-8">
        <h2 className="text-xl font-extrabold text-white">Stay prepared this season</h2>
        <ul className="mt-4 flex flex-col gap-2 text-sm text-white/85">
          <li>· Bookmark mitigation projects in your ward</li>
          <li>· Turn on Lite mode on slow networks</li>
          <li>· Share verified alerts, not rumors</li>
        </ul>
        <Link
          href="/about"
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-6 rounded-full bg-white font-bold text-elma-sidebar hover:bg-white/90",
          )}
        >
          Mission & audience
        </Link>
      </section>
    </div>
  );
}
