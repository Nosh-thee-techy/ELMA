import { buttonVariants } from "@/components/ui/button-variants";
import { citizenAppNavLink } from "@/lib/content/site";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ClipboardCheck,
  LifeBuoy,
  MapPin,
  Mic,
  Presentation,
  ShieldCheck,
  Siren,
  Smartphone,
  Sparkles,
  Waves,
} from "lucide-react";
import Link from "next/link";

const websitePillars = [
  {
    href: "/explore",
    icon: MapPin,
    title: "Explore the map",
    description: "County money, tenders, and who published the data — for journalists and ward reps.",
    accent: "from-teal-500/20 to-emerald-500/5",
  },
  {
    href: "/policy",
    icon: Sparkles,
    title: "Policy · Qwen",
    description: "Paste dense PDF rules; Qwen rewrites them into ward steps on the website.",
    accent: "from-violet-500/15 to-teal-500/5",
  },
  {
    href: "/responder/login",
    icon: ShieldCheck,
    title: "Staff sign-in",
    description: "Responders and verifiers use mock phone login → live dashboard & SOS queue.",
    accent: "from-slate-500/15 to-teal-500/5",
  },
] as const;

const pocketTabs = [
  { icon: Siren, label: "SOS", desc: "Report · same queue as USSD" },
  { icon: LifeBuoy, label: "Now", desc: "Do / don’t + Qwen for your ward" },
  { icon: ClipboardCheck, label: "Ready", desc: "Go-bag + prep plan from Qwen" },
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

        <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-14">
          <div className="flex flex-col gap-6 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-teal-200 ring-1 ring-white/10">
                <Waves className="size-3.5" aria-hidden />
                El Niño · Floods · Drought
              </span>
              <span className="rounded-full bg-red-500/25 px-3 py-1 text-xs font-bold text-red-100 ring-1 ring-red-400/40">
                Citizens → Pocket app
              </span>
            </div>

            <h1 className="font-display max-w-2xl text-balance text-4xl leading-[1.08] sm:text-5xl lg:text-[3.15rem]">
              Transparency on the web.{" "}
              <span className="elma-gradient-text">SOS on your phone.</span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-white/75">
              This site is for maps, policy, and staff. If you need to report danger or learn what to
              do in the next ten minutes, use <strong className="text-white">ELMA Pocket</strong> — Qwen
              personalizes “Now” and “Ready” for your ward without blocking the SOS button.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={citizenAppNavLink.href}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-full bg-red-500 px-8 font-bold text-white shadow-lg shadow-red-950/40 hover:bg-red-400",
                )}
              >
                <Siren data-icon="inline-start" />
                Open SOS app
                <ArrowRight data-icon="inline-end" />
              </Link>
              <Link
                href="/explore"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 rounded-full border-white/25 bg-white/10 font-bold text-white hover:bg-white/20",
                )}
              >
                <MapPin data-icon="inline-start" />
                Explore map
              </Link>
              <Link
                href="/responder/login"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 rounded-full border-white/20 font-bold text-white/90 hover:bg-white/10",
                )}
              >
                Staff sign-in
              </Link>
              <a
                href="https://canva.link/78kvq7fjr9gmokd"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-12 rounded-full border-white/20 font-bold text-white/90 hover:bg-white/10",
                )}
              >
                <Presentation data-icon="inline-start" />
                Slide deck
              </a>
            </div>
          </div>

          <Link
            href="/app"
            className="group elma-glass-panel flex flex-col gap-4 rounded-2xl p-5 text-foreground transition-transform hover:scale-[1.01] lg:p-6"
          >
            <p className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
              <span className="flex items-center gap-2">
                <Smartphone className="size-4" aria-hidden />
                ELMA Pocket preview
              </span>
              <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5" />
            </p>
            <ul className="flex flex-col gap-2">
              {pocketTabs.map((t) => (
                <li
                  key={t.label}
                  className="flex items-start gap-3 rounded-xl bg-muted/50 px-3 py-2.5 text-sm"
                >
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-emerald-600 text-white">
                    <t.icon className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="font-extrabold">{t.label}</span>
                    <span className="block text-xs text-muted-foreground">{t.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="border-t border-border/60 pt-3 text-xs text-muted-foreground">
              <Mic className="mr-1 inline size-3.5" aria-hidden />
              Voice Qwen lives on{" "}
              <span className="font-semibold text-foreground">/channels/phone</span> for hands-free;
              Pocket uses the same ModelScope key for typed guidance.
            </p>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="elma-card p-6 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Website
          </p>
          <p className="mt-2 font-display text-2xl text-elma-navy dark:text-slate-50">
            Accountability & staff
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Maps, policy PDFs, audit trail, and responder dashboard. Optimized for reading and
            verification — not thumb-first SOS.
          </p>
        </div>
        <div className="elma-card border-red-500/15 bg-gradient-to-br from-card to-red-500/5 p-6 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
            ELMA Pocket
          </p>
          <p className="mt-2 font-display text-2xl text-elma-navy dark:text-slate-50">
            Report · survive · prepare
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Static checklists load instantly; tap Qwen for ward-specific “Now” and “Ready” plans. SOS
            always posts first — AI is optional enrichment.
          </p>
          <Link
            href="/app?tab=ready"
            className="mt-4 inline-flex text-sm font-bold text-primary underline-offset-2 hover:underline"
          >
            Try prep tab
          </Link>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {websitePillars.map((p) => (
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
