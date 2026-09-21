import {
  coreProblem,
  informationGapBullets,
  part1Vision,
  part2Vision,
} from "@/lib/content/vision";
import Link from "next/link";

export function VisionSections() {
  return (
    <div className="flex flex-col gap-6">
      <section className="elma-card p-6 sm:p-8">
        <h2 className="text-xl font-extrabold">The gap we are closing</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{coreProblem}</p>
        <p className="mt-4 text-sm font-semibold text-foreground">
          Citizens rarely know, for their own ward:
        </p>
        <ul className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
          {informationGapBullets.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-primary" aria-hidden>
                ·
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="elma-card bg-[#eef0ff] p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {part1Vision.tagline}
        </p>
        <h2 className="mt-2 text-xl font-extrabold">{part1Vision.title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {part1Vision.summary}
        </p>
        <ul className="mt-6 flex flex-col gap-4">
          {part1Vision.features.map((f) => (
            <li key={f.heading} className="rounded-2xl bg-white/80 px-4 py-3.5">
              <p className="font-bold text-foreground">{f.heading}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm">
          <Link href="/transparency" className="font-bold text-primary hover:underline">
            Explore ward projects & budgets →
          </Link>
        </p>
      </section>

      <section className="elma-card bg-[#ffeef0] p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-destructive">
          {part2Vision.tagline}
        </p>
        <h2 className="mt-2 text-xl font-extrabold">{part2Vision.title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {part2Vision.summary}
        </p>
        <p className="mt-3 text-sm font-medium text-foreground">
          Flooding often knocks out mobile data, power, or both — especially where feature phones
          dominate. Low-tech channels are not a fallback; they are the main line.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {part2Vision.channels.map((ch) => (
            <li key={ch.id} className="rounded-2xl bg-white/80 px-4 py-3.5">
              <p className="font-bold text-foreground">{ch.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{ch.why}</p>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm">
          <Link href="/emergency" className="font-bold text-destructive hover:underline">
            Try web report & USSD stub →
          </Link>
        </p>
      </section>

      <p className="max-w-3xl px-1 text-sm leading-relaxed text-muted-foreground">
        Design rule: every feature must help a ward resident, committee member, or advocate take a
        concrete next step — not just display data for its own sake.
      </p>
    </div>
  );
}
