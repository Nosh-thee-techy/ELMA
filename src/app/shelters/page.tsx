import { EmptyState } from "@/components/feedback/empty-state";
import { ElmaMap } from "@/components/maps/elma-map";
import { BackToSafety } from "@/components/layout/back-to-safety";
import { PublicShelterCard } from "@/components/shelters/public-shelter-card";
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
          {shelters.map((s) => (
            <li key={s.id}>
              <PublicShelterCard shelter={s} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
