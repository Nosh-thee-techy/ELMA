import { HumanPhoto } from "@/components/media/human-photo";
import { buttonVariants } from "@/components/ui/button-variants";
import { audiencePhotoById, elmaPhotos } from "@/lib/content/stock-images";
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
    title: "Explore openly",
    body: "Use Transparency and Counties — no login required for disbursals, tenders, and shelter status.",
  },
  {
    title: "Act when it matters",
    body: "Report via web or the feature-phone simulator; responders sign in to update live shelter capacity.",
  },
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
              href="/counties"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 font-bold")}
            >
              Explore counties
              <ArrowRight data-icon="inline-end" />
            </Link>
            <Link
              href="/transparency"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "rounded-full font-bold",
              )}
            >
              View disbursals
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
          <div className="relative flex min-h-[320px] flex-col gap-4 p-4 sm:p-6 lg:min-h-[420px] lg:p-5">
            <HumanPhoto
              src={elmaPhotos.heroCommunity}
              alt="Maasai community celebration in Kenya"
              className="absolute inset-0 rounded-none lg:rounded-l-none"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <p className="relative z-10 flex items-center gap-2 text-sm font-bold text-white drop-shadow-md">
              <Users className="size-4" aria-hidden />
              Built for people on the ground
            </p>
            <div className="relative z-10 mt-auto grid grid-cols-2 gap-2 sm:gap-3">
              {targetAudiences.slice(0, 4).map((a) => (
                <article
                  key={a.id}
                  className="overflow-hidden rounded-2xl bg-white/95 shadow-lg ring-1 ring-black/10 backdrop-blur-sm dark:bg-slate-900/90"
                >
                  <HumanPhoto
                    src={audiencePhotoById[a.id] ?? elmaPhotos.heroRelief}
                    alt={a.title}
                    className="aspect-[4/3] w-full"
                    sizes="200px"
                  />
                  <div className="p-3">
                    <p className="text-sm font-bold leading-snug text-foreground">{a.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                      {a.who}
                    </p>
                  </div>
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
              Field & audit roles
            </p>
            <p className="mt-2 text-xl font-extrabold">
              Responders update shelters; verifiers record proof on the disbursal tracker — citizens stay on
              the public map.
            </p>
          </div>
          <Link
            href="/responder/login"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-emerald-500 font-bold text-white hover:bg-emerald-400",
            )}
          >
            <MapPin data-icon="inline-start" />
            First responder login
          </Link>
        </div>
      </section>
    </div>
  );
}
