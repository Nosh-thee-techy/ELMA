import { EmptyState } from "@/components/feedback/empty-state";
import { PageHero } from "@/components/layout/page-hero";
import { ElmaMap } from "@/components/maps/elma-map";
import { PublicShelterCard } from "@/components/shelters/public-shelter-card";
import { buttonVariants } from "@/components/ui/button-variants";
import { getShelters } from "@/lib/data/repository";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function SheltersPage() {
  const shelters = await getShelters();

  const mapPoints = shelters.map((s) => ({
    id: s.id,
    lat: s.lat,
    lng: s.lng,
    label: s.name,
    tone:
      s.occupancy >= s.capacity
        ? ("alert" as const)
        : s.occupancy >= s.capacity * 0.75
          ? ("clay" as const)
          : ("primary" as const),
  }));

  return (
    <div className="flex flex-col gap-8">
      <PageHero
        variant="minimal"
        eyebrow="Live capacity"
        title="Open shelters & beds"
        description="Map pins show responder-updated occupancy in the demo Kisumu cluster. Green = space available, amber = filling up, red = at capacity."
      >
        <Link
          href="/explore"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-2 w-fit rounded-full font-bold")}
        >
          County fund map
        </Link>
      </PageHero>

      <ElmaMap points={mapPoints} initialZoom={11.8} title="Shelter map · Kisumu demo" />

      {shelters.length === 0 ? (
        <EmptyState
          icon="home"
          title="No shelters listed"
          description="Partners can publish open halls and occupancy during activations."
          actionLabel="Explore counties"
          actionHref="/explore"
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
