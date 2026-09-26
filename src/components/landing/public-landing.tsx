import { buttonVariants } from "@/components/ui/button-variants";
import { fieldAppNavLink } from "@/lib/content/site";
import { cn } from "@/lib/utils";
import { ArrowRight, MapPin, Smartphone } from "lucide-react";
import Link from "next/link";

export function PublicLanding() {
  return (
    <div className="flex flex-col gap-10 pb-4">
      <section className="elma-header elma-card overflow-hidden border-0 p-8 text-white sm:p-12 lg:p-16">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-300">
          El Niño · Floods · Drought
        </p>
        <h1 className="mt-4 max-w-2xl text-balance text-4xl font-extrabold leading-tight sm:text-5xl">
          See where the money went — before the rains hit again.
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/80">
          One public map for counties, contractors, and published data. Policy and USSD for
          everyone. Field work stays in the ELMA app — not cluttering this site.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/explore"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full bg-emerald-500 px-8 font-bold text-white hover:bg-emerald-400",
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
              "rounded-full border-white/30 bg-white/10 font-bold text-white hover:bg-white/20",
            )}
          >
            <Smartphone data-icon="inline-start" />
            {fieldAppNavLink.label}
          </Link>
          <Link
            href="/responder/login"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "rounded-full border-white/30 font-bold text-white hover:bg-white/20",
            )}
          >
            Staff sign in
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/explore" className="elma-card group p-6 transition hover:shadow-lg">
          <p className="text-lg font-extrabold group-hover:text-primary">Interactive map</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Kilimani-scale clarity: pick a county, follow releases, see who published the data.
          </p>
        </Link>
        <Link href="/policy" className="elma-card group p-6 transition hover:shadow-lg">
          <p className="text-lg font-extrabold group-hover:text-primary">Policy, plain language</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Turn dense PDF rules into what your ward can actually use for relief and shelter.
          </p>
        </Link>
        <Link href="/channels/phone" className="elma-card group p-6 transition hover:shadow-lg">
          <p className="text-lg font-extrabold group-hover:text-primary">USSD simulator</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Dial *384*253# on a feature-phone screen — reports and shelter lookup end to end.
          </p>
        </Link>
      </section>
    </div>
  );
}
