import { track2Sources } from "@/lib/data/source-catalog";

export function DataSourcesPanel() {
  return (
    <section className="elma-card p-6 sm:p-8">
      <h2 className="text-lg font-extrabold">Track 2 data sources (reference)</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Local dev uses seed data shaped like live feeds from these portals. See{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">src/lib/data/mocks/</code>.
      </p>
      <ul className="mt-5 flex flex-col gap-4">
        {track2Sources.map((source) => (
          <li
            key={source.id}
            className="rounded-2xl bg-[#eef0ff] px-4 py-3.5 text-sm"
          >
            <p className="font-bold text-foreground">
              {source.name}{" "}
              <span className="font-normal text-muted-foreground">· {source.portal}</span>
            </p>
            <ul className="mt-2 list-inside list-disc text-muted-foreground">
              {source.dataProvided.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs font-medium text-primary/90">Ingestion: {source.ingestion}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
