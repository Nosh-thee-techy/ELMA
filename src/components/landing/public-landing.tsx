import { buttonVariants } from "@/components/ui/button-variants";
import { targetAudiences } from "@/lib/content/site";
import { cn } from "@/lib/utils";
import { ArrowRight, MapPin, Shield, Users } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    title: "Understand ELMA",
    body: "See how public money and emergency help are supposed to reach your ward — in plain language.",
  },
  {
    title: "Sign in",
    body: "Open the county map to explore releases, tenders, and what you can access where you live.",
  },
  {
    title: "Pick your county",
    body: "Tap the map or use the filter — then read funds, contractors, and help near you.",
  },
];

const portraitTints = [
  "from-[#0F172A] to-[#334155]",
  "from-[#059669] to-[#0D9488]",
  "from-[#0D9488] to-[#14B8A6]",
  "from-[#D97706] to-[#F59E0B]",
];

export function PublicLanding() {
  return (
    <div className="flex flex-col gap-8 pb-4">
      <section className="elma-card overflow-hidden p-0">
        <div className="grid lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-5 p-8 sm:p-10 lg:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary/80">
              El Niño · Floods · Drought
            </p>
            <h1 className="text-balance text-3xl font-extrabold leading-tight sm:text-4xl">
              Transparency first. Help where you live.
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              ELMA shows what government released for your county, how tenders are progressing, and
              what you can actually use — shelter, relief, and verified alerts — during OND rains or
              dry spells.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login?next=/counties"
                className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 font-bold")}
              >
                Explore counties
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link
                href="/about"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "rounded-full font-bold",
                )}
              >
                How ELMA works
              </Link>
            </div>
          </div>
          <div className="relative min-h-[280px] bg-slate-100 p-6 sm:p-8 lg:min-h-0">
            <p className="mb-4 flex items-center gap-2 text-sm font-bold text-primary">
              <Users className="size-4" aria-hidden />
              Built for people on the ground
            </p>
            <div className="grid grid-cols-2 gap-3">
              {targetAudiences.slice(0, 4).map((a, i) => (
                <article
                  key={a.id}
                  className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
                >
                  <div
                    className={cn(
                      "mb-3 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-extrabold text-white",
                      portraitTints[i % portraitTints.length],
                    )}
                    aria-hidden
                  >
                    {a.title.slice(0, 1)}
                  </div>
                  <p className="font-bold leading-snug text-foreground">{a.title}</p>
                  <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    {a.who}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="elma-card p-6">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary/15 text-sm font-extrabold text-primary">
              {i + 1}
            </span>
            <p className="mt-3 font-extrabold text-foreground">{step.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </div>
        ))}
      </section>

      <section className="elma-header elma-card border-0 p-8 text-white sm:p-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="flex items-center gap-2 text-sm font-bold text-white/80">
              <Shield className="size-4" aria-hidden />
              After sign-in
            </p>
            <p className="mt-2 text-xl font-extrabold">
              Interactive Kenya map — filter or tap a county to open releases, tenders, and help.
            </p>
          </div>
          <Link
            href="/login?next=/counties"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-emerald-500 font-bold text-white hover:bg-emerald-400",
            )}
          >
            <MapPin data-icon="inline-start" />
            Sign in to map
          </Link>
        </div>
      </section>
    </div>
  );
}
