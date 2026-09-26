import { buttonVariants } from "@/components/ui/button-variants";
import { fieldAppNavLink } from "@/lib/content/site";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  MapPin,
  Mic,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Waves,
} from "lucide-react";
import Link from "next/link";

const pillars = [
  {
    href: "/explore",
    icon: MapPin,
    title: "Explore the map",
    description: "Pick a county, follow releases, see contractors and who published the data.",
    accent: "from-teal-500/20 to-emerald-500/5",
  },
  {
    href: "/policy",
    icon: Sparkles,
    title: "Policy, plain language",
    description: "Qwen rewrites dense PDF rules into ward steps your neighbors can use today.",
    accent: "from-violet-500/15 to-teal-500/5",
  },
  {
    href: "/channels/phone",
    icon: Mic,
    title: "USSD & voice",
    description: "Kabambe menus, SMS, and spoken Qwen chat when data is thin or hands are full.",
    accent: "from-amber-500/15 to-orange-500/5",
  },
] as const;

export function PublicLanding() {
  return (
    <div className="flex flex-col gap-12 pb-8">
      <section className="elma-header relative overflow-hidden rounded-[2rem] border-0 p-0 shadow-2xl">
        <div className="elma-hero-grid pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-teal-400/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 size-96 rounded-full bg-emerald-500/15 blur-3xl"
          aria-hidden
        />

        <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:p-14">
          <div className="flex flex-col gap-6 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-teal-200 ring-1 ring-white/10">
                <Waves className="size-3.5" aria-hidden />
                El Niño · Floods · Drought
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-100 ring-1 ring-emerald-400/30">
                Kenya civic stack
              </span>
            </div>

            <h1 className="font-display max-w-2xl text-balance text-4xl leading-[1.08] sm:text-5xl lg:text-[3.25rem]">
              See where the money went{" "}
              <span className="elma-gradient-text">before the rains</span> hit again.
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-white/75">
              One calm public site: interactive county transparency, policy you can read, and channels
              that work on a Kabambe. Field ops live in the app — not scattered across the navbar.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/explore"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 font-bold text-white shadow-lg shadow-emerald-900/30 hover:from-emerald-400 hover:to-teal-400",
                )}
              >
                <MapPin data-icon="inline-start" />
                Explore the map
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link
                href={fieldAppNavLink.href}
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 rounded-full border-white/25 bg-white/10 font-bold text-white backdrop-blur-sm hover:bg-white/20",
                )}
              >
                <Smartphone data-icon="inline-start" />
                {fieldAppNavLink.label}
              </Link>
              <Link
                href="/responder/login"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 rounded-full border-white/20 font-bold text-white/90 hover:bg-white/10",
                )}
              >
                Staff sign in
              </Link>
            </div>
          </div>

          <div className="elma-glass-panel flex flex-col gap-4 rounded-2xl p-6 text-foreground lg:mb-2">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
              <ShieldCheck className="size-4" aria-hidden />
              Built for trust under stress
            </p>
            <ul className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                Ward-level releases, tenders, and shelter status in one narrative.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal-500" />
                Audit trail and proofs for journalists and ward reps.
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500" />
                USSD *384*253# and Qwen voice when the network barely holds.
              </li>
            </ul>
            <div className="mt-2 grid grid-cols-3 gap-2 border-t border-border/60 pt-4">
              {[
                { k: "47", l: "Counties" },
                { k: "3", l: "Demo profiles" },
                { k: "24/7", l: "Public map" },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <p className="text-xl font-extrabold tabular-nums text-elma-navy dark:text-slate-50">
                    {s.k}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {pillars.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="elma-card-hover group relative overflow-hidden p-6 sm:p-7"
          >
            <div
              className={cn(
                "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                p.accent,
              )}
              aria-hidden
            />
            <div className="relative flex flex-col gap-4">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-900/20">
                <p.icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-lg font-extrabold tracking-tight group-hover:text-primary">
                  {p.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-primary">
                Open
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
