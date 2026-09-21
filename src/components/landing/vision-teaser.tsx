import { coreProblem, part1Vision, part2Vision } from "@/lib/content/vision";
import Link from "next/link";

export function VisionTeaser() {
  return (
    <section className="elma-card p-6 sm:p-8">
      <h2 className="text-xl font-extrabold">Why ELMA is two parts</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{coreProblem}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-[#eef0ff] p-4">
          <p className="text-xs font-bold uppercase text-primary">{part1Vision.tagline}</p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            See allocations moving — projects, contractors, shelters — with room for tamper-evident
            records.
          </p>
        </div>
        <div className="rounded-2xl bg-[#ffeef0] p-4">
          <p className="text-xs font-bold uppercase text-destructive">{part2Vision.tagline}</p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            USSD, SMS, voice, and WhatsApp when data is down and rumors are loud.
          </p>
        </div>
      </div>
      <Link href="/about" className="mt-5 inline-block text-sm font-bold text-primary hover:underline">
        Read the full mission →
      </Link>
    </section>
  );
}
