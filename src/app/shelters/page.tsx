import { EmptyState } from "@/components/feedback/empty-state";
import { ElmaMap } from "@/components/maps/elma-map";
import { BackToSafety } from "@/components/layout/back-to-safety";
import { PageFrame } from "@/components/layout/page-frame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getShelters } from "@/lib/data/repository";
export default async function SheltersPage() {
  const shelters = await getShelters();

  const mapPoints = shelters.map((s) => ({
    id: s.id,
    lat: s.lat,
    lng: s.lng,
    label: s.name,
    tone: s.occupancy >= s.capacity ? ("alert" as const) : ("clay" as const),
  }));

  return (
    <PageFrame pathname="/shelters">
      <div className="flex flex-col gap-8">
        <BackToSafety />
        <ElmaMap points={mapPoints} initialZoom={11.5} />

        {shelters.length === 0 ? (
          <EmptyState
            icon="home"
            title="No shelters listed"
            description="Partners can publish open halls and occupancy during activations."
            actionLabel="View alerts"
            actionHref="/alerts"
          />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {shelters.map((s) => {
              const pct = Math.round((s.occupancy / s.capacity) * 100);
              const full = s.occupancy >= s.capacity;
              return (
                <li key={s.id}>
                  <Card className="h-full border-border/80 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-heading text-lg">{s.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {s.ward}, {s.county}
                      </p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      <p className="text-sm">{s.address}</p>
                      {s.hotline ? (
                        <p className="text-sm font-semibold text-primary">Hotline {s.hotline}</p>
                      ) : null}
                      {s.contactPerson ? (
                        <p className="text-xs text-muted-foreground">Contact: {s.contactPerson}</p>
                      ) : null}
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Occupancy</span>
                          <span>
                            {s.occupancy} / {s.capacity} ({pct}%)
                          </span>
                        </div>
                        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full ${full ? "bg-destructive" : "bg-primary"}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PageFrame>
  );
}
