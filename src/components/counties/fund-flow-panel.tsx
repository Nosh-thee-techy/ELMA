import type { PeriodFundSummary } from "@/lib/data/county-finance";
import { formatKes } from "@/lib/utils";

export function FundFlowPanel({ period }: { period: PeriodFundSummary }) {
  const remaining = Math.max(0, period.countyReceivedKes - period.countySpentKes);
  const receivedPct =
    period.nationalReleasedKes > 0
      ? Math.round((period.countyReceivedKes / period.nationalReleasedKes) * 100)
      : 0;
  const spentPct =
    period.countyReceivedKes > 0
      ? Math.round((period.countySpentKes / period.countyReceivedKes) * 100)
      : 0;

  return (
    <section className="elma-card flex flex-col gap-6 p-6 sm:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-primary">{period.label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{period.sourceNote}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl bg-[#eef0ff] p-4">
          <p className="text-xs font-bold uppercase text-muted-foreground">National released</p>
          <p className="mt-1 text-xl font-extrabold">{formatKes(period.nationalReleasedKes)}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-border/80">
          <p className="text-xs font-bold uppercase text-muted-foreground">County received</p>
          <p className="mt-1 text-xl font-extrabold text-primary">
            {formatKes(period.countyReceivedKes)}
          </p>
          <p className="text-xs text-muted-foreground">{receivedPct}% of release</p>
        </div>
        <div className="rounded-2xl bg-[#e8f5e9] p-4">
          <p className="text-xs font-bold uppercase text-muted-foreground">Spent to date</p>
          <p className="mt-1 text-xl font-extrabold">{formatKes(period.countySpentKes)}</p>
          <p className="text-xs text-muted-foreground">{spentPct}% of received</p>
        </div>
        <div className="rounded-2xl bg-[#fff4e6] p-4">
          <p className="text-xs font-bold uppercase text-muted-foreground">Unspent (cash)</p>
          <p className="mt-1 text-xl font-extrabold">{formatKes(remaining)}</p>
          <p className="text-xs text-muted-foreground">
            {formatKes(period.countyCommittedKes)} committed in tenders
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold uppercase text-muted-foreground">Money path (demo)</p>
        <div className="flex h-4 overflow-hidden rounded-full bg-muted">
          <div
            className="bg-primary/80"
            style={{ width: `${Math.min(100, receivedPct)}%` }}
            title="Received"
          />
        </div>
        <div className="flex h-4 overflow-hidden rounded-full bg-muted">
          <div
            className="bg-emerald-600/80"
            style={{ width: `${Math.min(100, spentPct)}%` }}
            title="Spent"
          />
        </div>
        <div className="flex justify-between text-[10px] font-semibold uppercase text-muted-foreground">
          <span>Received vs national</span>
          <span>Spent vs received</span>
        </div>
      </div>
    </section>
  );
}
