import { listAuditEvents, listCitizenFlags } from "@/lib/store/audit-store";
import Link from "next/link";

export function AuditTrailPanel() {
  const events = listAuditEvents(25);
  const flags = listCitizenFlags(8);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-elma-navy dark:text-slate-50">Public audit trail</h2>
          <p className="text-sm text-muted-foreground">
            Append-only log of reports, shelter updates, flags, and verifications (demo memory store).
          </p>
        </div>
        <Link
          href="/api/transparency/audit-trail?format=csv"
          className="text-sm font-bold text-primary underline-offset-2 hover:underline"
        >
          Export CSV for auditors
        </Link>
      </div>

      {flags.length > 0 ? (
        <div className="elma-card p-4">
          <p className="text-xs font-bold uppercase text-amber-700 dark:text-amber-400">Open citizen flags</p>
          <ul className="mt-2 flex flex-col gap-2">
            {flags.map((f) => (
              <li key={f.id} className="text-sm">
                <span className="font-semibold">{f.reason}</span>
                <span className="text-muted-foreground">
                  {" "}
                  · {f.targetType} {f.targetId} · {f.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <ul className="elma-card divide-y divide-border overflow-hidden">
        {events.length === 0 ? (
          <li className="p-6 text-sm text-muted-foreground">No events yet — try the feature phone or dashboard.</li>
        ) : (
          events.map((e) => (
            <li key={e.id} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">{e.summary}</p>
                <p className="text-xs text-muted-foreground">
                  {e.actor}
                  {e.ward ? ` · ${e.ward}` : ""}
                  {e.county ? `, ${e.county}` : ""}
                </p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p className="font-mono uppercase">{e.kind}</p>
                <p>{new Date(e.createdAt).toLocaleString()}</p>
                <p className="font-mono text-[10px]">{e.contentHash}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
